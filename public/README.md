# Public Assets

배포 시 그대로 제공되는 asset만 둡니다.

Recommended:

```text
public/
├── images/
│   ├── product/
│   ├── editorial/
│   └── story/
├── icons/
└── fonts/
```

Rules:

- original filename보다 semantic filename 사용
- product ID 또는 slug와 연결
- width/height와 alt metadata를 content model에 보관
- font license 확인 전 font file commit 금지
- duplicate export와 working PSD/AI file은 repository 밖에서 관리
