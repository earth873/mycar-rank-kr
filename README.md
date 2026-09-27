# 내차몇위

대한민국 주요 국산차의 국내 누적판매 순위를 검색하는 Next.js App Router MVP입니다. React, TypeScript, Tailwind CSS와 로컬 JSON을 사용하며 별도 DB나 API 서버가 없습니다. 차량과 브랜드 수는 현재 데이터에서 자동 계산합니다.

## 실행

Node.js 20.9 이상을 설치한 뒤 프로젝트 폴더에서 실행합니다.

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인합니다.

## 데이터

- `data/cars.json`: 판매량·순위·역사·세대 기준 데이터
- `data/car_search_index.json`: 클라이언트 검색 데이터

원본 JSON을 변경 없이 복사했습니다. 순위는 원본 필드를 따르며 표시 판매량으로 정렬하지 않습니다. 차급 카드의 SUV·세단은 여러 세부 차급을 묶은 전체 순위이고, 상세의 차급 순위는 원본 세부 차급 순위입니다. 검색과 랭킹 필터는 클라이언트에서 처리합니다. 브랜드 URL에서 `/`는 `-`로 표현합니다.

## 검증 및 빌드

```bash
npm run validate
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

프로덕션 서버를 실행한 상태에서 `npm run test:smoke`를 실행하면 현재 데이터의 모든 상세 주소와 브랜드 주소, canonical, JSON-LD, robots, 사이트맵과 404 응답을 검사합니다. 사이트맵 기대 수는 기본 주소 3개 + 브랜드 수 + 차량 수입니다. 한글 URL의 인코딩된 경로 매개변수도 처리합니다. `TEST_BASE_URL`로 검사할 서버 주소를 지정할 수 있고, 빌드할 때와 검사할 때 환경이 다르면 `TEST_SITE_URL`을 빌드에 사용한 사이트 주소로 설정합니다.

빌드 전에 비어 있지 않은 차량 목록, slug·순위 중복, 1부터 차량 수까지 연속된 순위, 0 이상의 숫자 판매량, 필수 필드, 검색 인덱스의 개수와 양방향 slug 대응을 검증합니다. 과거 원본 폴더에 의존하지 않습니다. 데이터 추가 시 두 JSON을 함께 갱신한 뒤 검증·빌드를 실행하세요. 회귀 테스트는 별도 메모리 fixture로 더 큰 데이터셋도 검사하며 운영 데이터는 변경하지 않습니다.

차량과 브랜드 라우트는 `generateStaticParams()`와 `dynamicParams = false`로 데이터에 있는 모든 경로를 미리 생성합니다. 미등록 경로는 404이고 런타임에 새 상세 페이지를 생성하지 않습니다. Next.js 정적 사전 렌더링 구조이며 `output: export`를 사용하는 별도 HTML 내보내기는 아닙니다.

## 환경변수와 배포

`.env.example`을 `.env.local`로 복사할 수 있습니다.

- `NEXT_PUBLIC_SITE_URL`: canonical·사이트맵·robots용 사이트 주소. **실제 배포 시 `NEXT_PUBLIC_SITE_URL=https://실제도메인`을 반드시 설정**하세요. 미설정 시 `VERCEL_PROJECT_PRODUCTION_URL` → `VERCEL_URL` → 로컬 실행용 `http://localhost:3000` 순으로 사용합니다. 경로·쿼리 없는 HTTP(S) origin을 입력합니다. Vercel URL 환경변수에는 프로토콜 없는 호스트를 사용합니다.
- `NEXT_PUBLIC_KAKAO_JS_KEY`: 선택 사항. 있으면 카카오 공유 버튼과 SDK를 사용합니다. 없으면 Web Share와 링크 복사로 작동합니다. Kakao Developers에서 서비스의 JavaScript 키와 웹 도메인을 등록해야 합니다.

Vercel에 저장소를 연결하고 Next.js 프리셋, 루트 디렉터리 `.`, 빌드 `npm run build`를 선택합니다. 환경변수를 설정한 뒤 배포합니다. 키나 도메인을 변경하면 다시 빌드합니다. 링크 복사와 Web Share는 HTTPS 또는 localhost에서 사용합니다.

공통 사이트 이름·판매량 기준일·URL 결정 규칙은 `lib/site.ts`에서 관리합니다. 기준일은 데이터 갱신 시 함께 확인하세요.

## 소스 ZIP

Windows에서 `npm run package:source`를 실행하면 기본 제공 `tar.exe`로 `dist/naecha-source.zip`이 생성됩니다. 다른 운영체제에서는 `bsdtar`가 필요합니다. 실행에 필요한 소스, 데이터, 테스트, 잠금 파일과 문서를 허용 목록으로 포함하며 `node_modules`, `.next`, 환경변수 파일(`.env.example` 제외), `*.tsbuildinfo`와 기존 ZIP은 제외합니다. 로컬 실행을 위해 설치·빌드 결과물은 디스크에 유지하지만 Git 및 ZIP에는 포함하지 않습니다.

과거 원본 자료는 로컬 `dist/reference-build-pack`에만 보관하며 Git·배포 소스 ZIP·빌드 의존성에서 제외합니다.

## V1.1 운영 설정

| 변수                     | 필수         | 용도                                               |
| ------------------------ | ------------ | -------------------------------------------------- |
| NEXT_PUBLIC_SITE_URL     | 배포 후 권장 | canonical / sitemap / OG 이미지의 실제 사이트 주소 |
| NEXT_PUBLIC_GA_ID        | 선택         | Google Analytics 4                                 |
| GOOGLE_SITE_VERIFICATION | 선택         | Google Search Console HTML 태그 인증               |
| NEXT_PUBLIC_KAKAO_JS_KEY | 선택         | 카카오톡 공유                                      |

### Analytics 설정

Vercel Project → Settings → Environment Variables에서 `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`를 실제 Measurement ID로 등록하고 재배포합니다. 값이 없거나 올바른 ID 형식이 아니면 GA 스크립트를 삽입하지 않습니다. 루트 레이아웃에서 `next/script`의 `afterInteractive`로 한 번만 로드합니다.

페이지뷰는 GA4 기본 설정과 **향상된 측정 → 페이지 조회 → 고급 설정 → 브라우저 기록 이벤트에 따른 페이지 변경**을 켜서 수집합니다. App Router 이동은 History API를 사용하므로 수동 page_view를 중복 전송하지 않습니다. 실제 ID 등록 후 GA 실시간/DebugView에서 첫 방문과 차량 간 이동이 각각 한 번씩 기록되는지 확인하세요. [Google SPA 측정 안내](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications)

`search_select`는 선택된 차량명·브랜드·순위만, `share_car`는 차량명·공유 방식·순위만 전송합니다. 검색창의 자유 입력값, 차량번호, 이름·이메일 등을 전송하는 커스텀 코드는 없습니다. 기존 카카오 텍스트 공유는 그대로 유지하며, 링크 공유 시 OG 이미지를 사용할 수 있습니다.

### Search Console 설정

Vercel 환경변수 `GOOGLE_SITE_VERIFICATION`에 HTML 태그의 `content` 값만 등록하고 재배포합니다. 태그 전체를 붙여 넣지 않습니다. 그다음 Search Console에서 URL 접두어 속성의 HTML 태그 방식으로 확인합니다. 미설정 시 빈 인증 meta 태그를 만들지 않습니다.

### Sitemap

Search Console에 `https://도메인/sitemap.xml`을 제출합니다. 사이트맵은 기존 페이지 주소만 포함하고 OG 이미지 URL은 포함하지 않습니다. 도메인 변경 시 `NEXT_PUBLIC_SITE_URL`을 바꾸고 재배포합니다.

### OG 공유 이미지

Next.js `ImageResponse`로 `/og/site`와 `/og/[차량 slug]`에 1200×630 PNG를 정적으로 생성합니다. 차량 페이지는 계속 Server Component와 정적 생성 구조를 사용합니다. 없는 차량의 이미지 요청은 404입니다. Open Graph와 Twitter `summary_large_image`가 같은 차량별 이미지를 참조합니다. 외부 자동차 사진이나 런타임 폰트 다운로드는 사용하지 않습니다.

한글 폰트는 Google Fonts의 **Noto Sans KR Bold**를 필요한 글자만 담은 로컬 서브셋으로 사용합니다. `public/fonts/OFL.txt`에 SIL OFL 1.1 라이선스가 포함되어 있습니다. [원본 라이선스](https://github.com/google/fonts/blob/main/ofl/notosanskr/OFL.txt) · [Google Fonts 서브셋 안내](https://developers.google.com/fonts/docs/getting_started#optimizing_your_font_requests)

차량명이나 이미지 문구 변경으로 새 글자가 추가되면 `npm run font:og`를 한 번 실행하고 생성된 폰트·글자 목록·라이선스를 소스에 포함하세요. 이 갱신 명령만 네트워크를 사용하며 일반 빌드에는 필요하지 않습니다. `npm test`가 새 글자의 누락을 감지합니다. `npm run smoke`는 페이지·메타데이터·이미지 endpoint를 검사합니다.

## 향후 TODO

실제 GA ID·Search Console 인증값 등록 및 재배포, 출시 도메인 설정, 카카오 공유 실기기 확인(사용 시), 데이터 갱신. 향후 수입차·연도별 통계는 별도 범위입니다.
