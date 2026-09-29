"""Local dev server that always disables caching, so the browser can never
show a stale build no matter how it navigates (hash-only, back/forward,
repeat loads). Plain `python3 -m http.server` doesn't send Cache-Control,
which let real browsers reuse old HTML/CSS/images across reloads.
"""
import functools
import http.server
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4182
ROOT = sys.argv[2] if len(sys.argv) > 2 else '.'


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        super().end_headers()


handler = functools.partial(NoCacheHandler, directory=ROOT)
http.server.ThreadingHTTPServer(('127.0.0.1', PORT), handler).serve_forever()
