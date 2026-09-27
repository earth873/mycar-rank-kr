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

## 향후 TODO

출시 도메인 설정, 카카오 공유 실기기 확인(사용 시), 데이터 갱신. 향후 수입차·연도별 통계·공유 이미지는 별도 범위입니다.
