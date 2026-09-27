# 배포 안정화 검증 기록

2026-09-27 · Windows · Next.js 16.3.6 프로덕션 빌드

## 이번 작업에서 실행한 검사

| 검사 | 결과 |
| --- | --- |
| npm install | PASS, 취약점 0건 |
| npm run validate | PASS |
| npm run typecheck | PASS |
| npm run lint | PASS, 오류·경고 없음 |
| npm test | PASS, 9개 테스트 |
| npm run build | PASS |
| npm run test:smoke | PASS |
| npm run package:source | PASS |

## 데이터 및 정적 생성

- 차량: 117개 / 브랜드: 6개
- 정적 차량 상세: 117개 / 정적 브랜드 페이지: 6개
- slug 중복: 0 / overall_rank 중복: 0
- 전체 순위: 1부터 현재 차량 수까지 연속
- 검색 인덱스: 차량과 같은 개수, 양방향 slug 대응 확인
- 기존 두 운영 JSON의 SHA-256: 작업 전후 동일
- 차량·브랜드 dynamicParams=false, 빌드 manifest의 fallback=false 확인
- 정상 차량·브랜드 전체 HTTP 200
- /car/not-existing: HTTP 404
- /brand/not-existing: HTTP 404
- 사이트맵: 기본 3 + 브랜드 6 + 차량 117 = 126개, 전체 URL 집합 일치
- 홈·랭킹·About·브랜드·차량 canonical 주소 확인
- 홈 WebSite, 모든 차량 BreadcrumbList JSON-LD 파싱 및 주소 확인
- robots의 sitemap 주소 확인

위 숫자는 이번 검증 시점의 기록이며, 코드와 테스트 기대값은 현재 JSON에서 계산합니다.

## 회귀 및 확장성

- 검색어 싼타페 / Santa Fe / 현대 싼타페 / 그랜저 / 레이 / 스파크의 첫 결과 확인
- 현재 모든 차량 검색 테스트 통과
- 원본·인코딩된 한글 경로 처리 테스트 통과
- 1·150·200·300개 테스트 전용 메모리 데이터셋 검증 통과
- 중복 slug/rank, 순위 공백, 필수 필드 누락, 음수·비숫자 판매량, 검색 누락·중복·미등록 slug 거부 확인
- URL 우선순위: 명시 주소 → Vercel 프로덕션 주소 → Vercel 배포 주소 → 로컬 주소
- 잘못된 URL·프로토콜·경로·자격증명 거부 확인
- 실제 브라우저에서 필수 검색어 6종, 방향키·Enter로 싼타페 상세 이동 확인
- 이번 브라우저 검사에서 오류·hydration 경고 없음
- 검색 IME 코드, 공유 코드, 화면 스타일은 변경하지 않음. 실제 기기 IME·카카오 전송은 이번 패치에서 재검증하지 않음

## 소스 배포

`dist/naecha-source.zip`은 소스·운영 데이터·테스트·설정·잠금 파일·문서를 포함합니다. `node_modules`, `.next`, `.env`, `.env.local`, 기타 환경변수 파일, `*.tsbuildinfo`, 과거 Build Pack, 기존 ZIP은 제외하며 `.env.example`은 포함합니다. ZIP 엔트리와 원본 파일의 SHA-256 일치 여부를 확인했습니다.

원본 자료 전체의 영구 삭제는 자동 승인 검토에서 CSV·문서 손실 위험으로 거부되어, 복구 가능한 `dist/reference-build-pack`으로 이동했습니다. 해당 자료는 Git과 소스 ZIP에서 제외되며, 빌드·검증은 이 폴더를 읽지 않습니다.

## 실제 배포 전 설정

실제 도메인으로 `NEXT_PUBLIC_SITE_URL`을 설정합니다. 카카오 공유를 사용하는 경우에만 키와 웹 도메인을 등록하고 실기기 전송을 확인합니다. 이번 작업은 로컬 배포 준비이며 외부 서비스에 게시하지 않았습니다.
