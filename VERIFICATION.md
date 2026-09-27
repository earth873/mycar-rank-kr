# V1.1 운영 준비 검증 기록

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
