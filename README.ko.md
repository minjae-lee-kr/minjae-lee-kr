<p align="left"><img src="assets/header.ko.svg" alt="이민재 — 더 큰 가능성을, 믿고 쓸 수 있도록." width="100%"></p>

[English](README.md) · [한국어](README.ko.md)

네이버에서 커머스 경험, GraphQL API 서버, 개발 생산성을 다루는 소프트웨어 엔지니어 민재입니다. 큰 아이디어를 사람들이 믿고 쓰는 제품으로 만드는 데 관심이 있습니다.

[LinkedIn](https://www.linkedin.com/in/minjae-lee-kr/) · [엔지니어링 글](https://www.linkedin.com/pulse/when-findings-isnt-enough-coverage-heartbeats-lee-minjae-vre0c/)

### 대표 엔지니어링 실험

가상 데이터를 사용하는 독립적인 구현입니다. 실제로 마주할 수 있는 질문을 다루고, 증명할 수 있는 범위를 함께 밝힙니다.

| 작업                  | 핵심 질문                                                            | 근거                                                                                                      |
| --------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Intent / Recovery** | 응답이 사라진 뒤에도 같은 사용자의 의도로 결과를 복구할 수 있을까?   | 실제 HTTP 응답 유실, SQLite, 프로세스 종료. [기록된 로컬 실행](docs/evidence/intent/).                    |
| **Verified Change**   | 검토한 코드와 검사 정책이 실제 반영 대상에도 그대로 적용됐을까?      | 불변 Git 후보, 실제 검사 프로세스, 조건부 ref 변경. [기록된 로컬 실행](docs/evidence/change/).            |
| **Cancellation Debt** | 게이트웨이가 대기를 멈춘 뒤 어떤 작업이 여전히 처리 용량을 차지할까? | 요청 취소, 허가, 실제 작업 완료를 비교하는 네 가지 정책. [기록된 로컬 실행](docs/evidence/cancellation/). |

소스 저장소는 공개 준비 중입니다. 보고서는 로컬 실행을 기록한 읽기 전용 자료이며, 실시간 서비스나 실서비스 성과를 나타내지 않습니다. `npm start` 후 `http://127.0.0.1:4173`을 열면 한·영 포트폴리오를 볼 수 있습니다. 위 상대 링크는 GitHub에서 소스 폴더로 열리며, 호스팅된 데모 주소가 아닙니다.

공개된 작은 도구인 [**Empty Check Guards**](https://github.com/minjae-lee-kr/empty-check-guards)는 “발견한 문제가 없음”과 “검사한 것이 없음”을 구분합니다.

[키보다 먼저 사라지는 기록](docs/notes/retention-boundary/), [‘통과’의 의미까지 검증하기](docs/notes/verified-change/), [허가는 반환됐지만, 작업은 남아 있었다](docs/notes/cancellation-debt/)에서는 설계 판단과 원본 근거를 함께 읽을 수 있습니다. 세 글 모두 한·영 전환과 그림을 제공합니다.

Intent의 [관측 기록 탐색기](docs/evidence/history/)에서는 같은 최종 장부에 서로 양립할 수 없는 조회 응답이 연결될 수 있음을 보여줍니다. 실제 HTTP 관측, 의도적으로 바꾼 응답 한 건, 가능한 순차 실행의 설명을 구분합니다.

### 일하는 방식

- 사용자의 의도와 클라이언트 상태, API 계약, 저장된 결과를 하나의 흐름으로 봅니다.
- 그럴듯하지만 실패하는 접근을 재현한 뒤, 같은 상황에서 보호된 경로를 비교합니다.
- 소스 버전과 검증 근거, 확인할 수 없는 범위를 주장 가까이에 둡니다.

React · TypeScript · GraphQL · Apollo Federation · Node.js · 개발 자동화

모든 예제는 독립적인 개인 작업입니다. 회사 코드, 내부 설계, 비공개 데이터 또는 실서비스 성과를 재현하지 않습니다.
