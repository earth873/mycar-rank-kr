# V1.2 정적 차급 랭킹 검증 기록

2026-09-27 · Windows · Next.js 16.3.6 · 로컬 프로덕션 빌드 및 서버

| 검사 | 결과 |
| --- | --- |
| npm run validate | PASS, 차량 117개 및 검색 항목 117개 |
| npm run typecheck | PASS |
| npm run lint | PASS |
| npm test | PASS, 기존 12개 유지 + 신규 5개 = 17개 |
| npm run build | PASS, 신규 차급 5개 SSG |
| npm run smoke | PASS, 실제 HTTP 및 prerender manifest 검사 |
| git diff --check | PASS |

테스트 첫 실행은 Windows 샌드박스의 uv_os_get_passwd ENOMEM 오류로 중단됐습니다. 일반 실행 권한으로 다시 실행한 npm test와 npm run smoke가 통과했습니다.

## 생성된 페이지와 데이터

| URL | 표시명 | 차량 수 |
| --- | --- | ---: |
| /rank/suv | SUV | 40 |
| /rank/sedan | 세단 | 40 |
| /rank/compact | 경차 | 6 |
| /rank/mpv | MPV | 11 |
| /rank/commercial | 상용차 | 6 |

- 모든 그룹이 최소 3개 및 권장 5개 기준 충족. 기존 categoryGroup()을 사용하며 기타 14개는 새 페이지 대상에서 제외.
- 세부 차급의 category_rank 대신 estimated_domestic_sales 내림차순으로 UI 순위 1~N 표시. 동률은 기존 전체 순위 순서 유지.
- 공통 config를 정적 경로, metadata, sitemap, 내부 링크에서 재사용.
- 차량 117개, 브랜드 6개, OG PNG 118개 정적 생성 유지. 신규 차급 페이지 5개 모두 SSG manifest에 포함.
- sitemap 126개 → 131개(+5). 예상 URL 집합을 데이터와 config에서 계산하여 검사.
- 차급 페이지마다 고유 title/description/canonical 및 OG/Twitter metadata, BreadcrumbList, ItemList 확인.
- 실제 HTML의 순위 1~N과 ItemList의 차량·순서·URL 일치 확인. /rank/not-existing HTTP 404 및 dynamicParams=false 확인.
- 기존 차량/브랜드/OG 전 경로 HTTP 200, 미등록 경로 404, robots 및 OG 이미지 크기 검사 통과.

## 내부 탐색 및 화면 확인

- 홈 SUV·세단·경차 카드의 화살표를 정적 페이지로 연결.
- 상세페이지 같은 차급 영역에 해당 그룹 전체 순위 링크 추가.
- /rank 필터 위에 5개 정적 차급 링크 추가. 기존 /rank?category=SUV의 40개 모델 및 전체 순위 표시 유지 확인.
- Browser로 320px에서 5개 페이지 모두 가로 넘침 및 모델명 잘림 없음 확인.
- 390px SUV 화면의 TOP 3 세로 배치, 1440px 화면의 TOP 3 3열 및 랭킹 1열 확인.
- Analytics·Search Console·검색·공유·기존 OG 구현 변경 없음.

## 원본 파일 보존

작업 전후 SHA-256 동일:

- data/cars.json: A42C941C18B764DBBA2FE8E31510BA20AF85342E3ACFA3B27065D8D5C4EE4C56
- data/car_search_index.json: 4E7DE30FFA91803E94D9D753E2265D166D5D5EF9EE2517834697C00AC391D8AB

새 의존성 및 .gitignore 변경 없음. 커밋·push·Vercel 재배포는 수행하지 않았습니다. 아래 V1.1 기록은 당시 검증 이력입니다.

---

# V1.1 운영 준비 검증 기록 (이전 이력)

2026-09-27 · Windows · Next.js 16.3.6 · 로컬 프로덕션 서버

## 실행 결과

| 검사 | 결과 |
| --- | --- |
| npm run validate | PASS |
| npm run typecheck | PASS |
| npm run lint | PASS, 오류·경고 없음 |
| npm test | PASS, 12개 테스트 |
| npm run build | PASS |
| npm run smoke | PASS |

## 정적 생성 및 데이터 보존

- 차량 상세 117개, 브랜드 6개 정적 생성 유지
- 기본 OG 1개 + 차량 OG 117개 = PNG 118개 정적 생성
- 차량·브랜드·OG 경로의 dynamicParams=false 유지
- 모든 차량·브랜드·OG endpoint HTTP 200, 미등록 경로 HTTP 404
- 사이트맵 URL 126개 유지, OG endpoint는 사이트맵에서 제외
- canonical, WebSite/Breadcrumb JSON-LD, robots의 사이트맵 주소 검사 통과
- 기존 차량·검색 JSON의 SHA-256 작업 전후 동일, 새 npm 의존성 없음

## CTA

- 검색 영역 id=car-search, 하단 CTA href=#car-search
- 같은 해시에서 반복 클릭해도 동작하는 기본 앵커 사용
- 모바일 390px 및 데스크톱 1440px에서 클릭 후 검색 영역이 화면 위 100px 위치에 표시됨
- 기존 smooth scroll 및 prefers-reduced-motion의 auto 설정 유지
- 확인한 브라우저에서 콘솔 오류·hydration 경고 없음

## Analytics / Search Console

- GA ID가 없으면 컴포넌트가 null을 반환하며 프로덕션 HTML에 GA URL 미삽입
- 잘못된 ID, 브라우저 없는 실행에서도 안전한 no-op 테스트 통과
- 초기화 스크립트를 격리된 VM에서 실행해 config 1회 큐 등록 확인
- 임시 로컬 서버에 테스트 GA ID와 인증 토큰을 설정하여 실제 응답 HTML의 GA init/loader 및 google-site-verification meta 확인
- 임시 서버는 검사 후 종료했으며 테스트 값을 파일에 저장하지 않음
- 위 검사는 HTML만 읽었고 실제 Google 수집 요청은 실행하지 않음
- 빈 Search Console 토큰은 metadata에서 제외, 값이 있으면 포함하는 테스트 통과
- GA 페이지뷰는 기본 설정과 향상된 측정의 History 이벤트를 사용하며 수동 page_view 중복 전송 없음
- 검색 이벤트는 선택 모델명·브랜드·순위만 사용하며 자유 입력 검색어를 전송하지 않음
- 실제 계정의 GA 수신/SPA 페이지뷰 및 Search Console 소유권 인증은 사용자 값 등록 후 확인 필요

## OG 검사

| 이미지 | PNG 크기 | 내용 및 한글 확인 |
| --- | --- | --- |
| 기본 | 1200×630 | PASS, 데이터 기반 모델 수 |
| 싼타페 | 1200×630 | PASS, #6 / 약 156만대 |
| 그랜저 | 1200×630 | PASS, #5 / 약 241만대 |
| 레이 | 1200×630 | PASS, #25 / 약 49만대 |

전체 118개 PNG의 signature·크기·응답 형식을 검사했습니다. 위 4개 이미지는 직접 열어 시각적으로 확인했습니다. 모든 차량 페이지의 og:image, twitter:image, summary_large_image 메타데이터가 올바른 endpoint를 참조합니다.

Google Fonts Noto Sans KR Bold의 SIL OFL 서브셋 33,276바이트를 로컬 저장했습니다. 폰트 내부 cmap을 검사해 필요한 214개 문자가 모두 포함됨을 확인했습니다. 빌드 및 요청 시 외부 폰트 다운로드가 없습니다. 라이선스는 public/fonts/OFL.txt에 포함합니다.

## 전달 및 배포 상태

README 및 .env.example에 GA·Search Console·Sitemap·Vercel 환경변수와 폰트 갱신 절차를 추가했습니다. dist/naecha-source.zip을 최신 소스로 다시 생성합니다. 기존 UI·랭킹·공유 방식은 유지합니다.

이 폴더에는 .git이 없어 Git 커밋과 push는 수행하지 않았습니다. 이번 변경은 로컬에서 구현·검증했으며 Vercel의 공개 배포에는 아직 반영하지 않았습니다. 실제 환경변수를 등록한 뒤 변경본을 재배포해야 합니다.
