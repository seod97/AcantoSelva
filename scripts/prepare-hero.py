"""Prepare the original STL for the web without removing any triangles.

Requires numpy. Run from any directory; the source STL is never modified.
Vertex-normal averaging, centering and orientation match the previous renderer.
"""
import json
import struct
from pathlib import Path

import numpy as np

root = Path(__file__).resolve().parents[1]
source = root / 'public/assets/models/knot.stl'
destination = source.with_name('knot-web.glb')
data = source.read_bytes()
count = struct.unpack_from('<I', data, 80)[0]
assert len(data) == 84 + count * 50, 'Expected a binary STL'
triangles = np.frombuffer(data, dtype=np.dtype([
    ('normal', '<f4', 3), ('vertices', '<f4', (3, 3)), ('attribute', '<u2')
]), offset=84, count=count)
positions = triangles['vertices'].reshape(-1, 3)
face_normals = np.repeat(triangles['normal'], 3, axis=0)
# JS Math.round, used by the previous normal averaging code.
keys = np.floor(positions.astype(np.float64) * 2048 + .5).astype(np.int64)
_, normal_groups = np.unique(keys, axis=0, return_inverse=True)
sums = np.zeros((normal_groups.max() + 1, 3), dtype=np.float64)
np.add.at(sums, normal_groups, face_normals)
lengths = np.linalg.norm(sums, axis=1, keepdims=True)
sums /= np.maximum(lengths, 1e-12)
# Index exact coordinates, not the rounded normal-group keys: no shape changes.
vertices, first, indices = np.unique(positions, axis=0, return_index=True, return_inverse=True)
normals = sums[normal_groups[first]]
minimum, maximum = vertices.min(axis=0), vertices.max(axis=0)
size = maximum - minimum
vertices = vertices.astype(np.float64) - (minimum + maximum) / 2
axis = int(np.argmin(size))
rotation = np.eye(3)
if axis == 0:
    rotation = np.array([[0, 0, 1], [0, 1, 0], [-1, 0, 0]])
elif axis == 1:
    rotation = np.array([[1, 0, 0], [0, 0, -1], [0, 1, 0]])
vertices = np.asarray((vertices @ rotation.T) * (2 / size.max()), dtype='<f4')
normals = np.asarray(normals @ rotation.T, dtype='<f4')
indices = np.asarray(indices, dtype='<u4')
blocks = [vertices.tobytes(), normals.tobytes(), indices.tobytes()]
offsets = [0, len(blocks[0]), len(blocks[0]) + len(blocks[1])]
binary = b''.join(blocks)
model = {
    'asset': {'version': '2.0', 'generator': 'AcantoSelva STL preparation (lossless topology)'},
    'scene': 0, 'scenes': [{'nodes': [0]}], 'nodes': [{'mesh': 0}],
    'meshes': [{'primitives': [{'attributes': {'POSITION': 0, 'NORMAL': 1}, 'indices': 2}]}],
    'buffers': [{'byteLength': len(binary)}],
    'bufferViews': [{'buffer': 0, 'byteOffset': offset, 'byteLength': len(block),
                     'target': 34963 if i == 2 else 34962}
                    for i, (offset, block) in enumerate(zip(offsets, blocks))],
    'accessors': [
        {'bufferView': 0, 'componentType': 5126, 'count': len(vertices), 'type': 'VEC3',
         'min': vertices.min(axis=0).tolist(), 'max': vertices.max(axis=0).tolist()},
        {'bufferView': 1, 'componentType': 5126, 'count': len(normals), 'type': 'VEC3'},
        {'bufferView': 2, 'componentType': 5125, 'count': len(indices), 'type': 'SCALAR'}
    ]
}
document = json.dumps(model, separators=(',', ':')).encode()
document += b' ' * (-len(document) % 4)
binary += b'\0' * (-len(binary) % 4)
glb = (struct.pack('<III', 0x46546C67, 2, 12 + 8 + len(document) + 8 + len(binary))
       + struct.pack('<II', len(document), 0x4E4F534A) + document
       + struct.pack('<II', len(binary), 0x004E4942) + binary)
destination.write_bytes(glb)
assert len(indices) == count * 3
assert np.isfinite(vertices).all() and np.isfinite(normals).all()
print(json.dumps({'source_bytes': len(data), 'web_bytes': len(glb), 'triangles': count,
                  'indexed_vertices': len(vertices), 'source_vertices': len(positions)}))
