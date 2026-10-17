[English](README.md) · [한국어](README.ko.md)

# 잘됩니다. 질문이 좀 있습니다.

네이버에서 커머스 인터페이스, GraphQL API 서버, 개발 자동화를 다루는 소프트웨어 엔지니어 민재입니다.

[**포트폴리오 둘러보기 · 한국어 / English →**](https://minjae-lee-engineering-labs.crisp-cream-0381.chatgpt.site/) · [LinkedIn](https://www.linkedin.com/in/minjae-lee-kr/)

### 01 / Intent · Recovery

**예약은 됐는데, 화면만 모릅니다.**

HTTP 응답이 사라진 예약을 복구합니다. 이어서 상대의 중복 방지 기록이 만료된 뒤에도 같은 키만으로 충분한지 확인합니다.

[해설 읽기](https://minjae-lee-engineering-labs.crisp-cream-0381.chatgpt.site/notes/retention-boundary/) · [소스](https://github.com/minjae-lee-kr/intent-recovery-lab) · [실행 기록](https://minjae-lee-engineering-labs.crisp-cream-0381.chatgpt.site/evidence/intent/)

### 02 / Verified Change

**통과한 걸까요, 통과 기준이 바뀐 걸까요?**

같은 코드를 두 검사 정책으로 비교하고, 승인을 검사한 후보와 정책에 연결합니다. 무엇을 실행했는지 들여다봐도 설명할 수 있는 ‘통과’를 다룹니다.

[해설 읽기](https://minjae-lee-engineering-labs.crisp-cream-0381.chatgpt.site/notes/verified-change/) · [소스](https://github.com/minjae-lee-kr/verified-change-lab) · [실행 기록](https://minjae-lee-engineering-labs.crisp-cream-0381.chatgpt.site/evidence/change/)

### 03 / Cancellation Debt

**요청은 퇴근했는데, 작업은 아직입니다.**

GraphQL 게이트웨이가 대기를 끝낸 뒤에도 남는 작업을 추적합니다. 네 가지 취소 정책으로 실행 허가의 반환과 실제 처리 용량의 회복 사이를 비교합니다.

[해설 읽기](https://minjae-lee-engineering-labs.crisp-cream-0381.chatgpt.site/notes/cancellation-debt/) · [소스](https://github.com/minjae-lee-kr/federated-catalog-lab) · [실행 기록](https://minjae-lee-engineering-labs.crisp-cream-0381.chatgpt.site/evidence/cancellation/)

[**Empty Check Guards**](https://github.com/minjae-lee-kr/empty-check-guards)도 만들었습니다. “발견한 문제가 없음”과 “검사한 것이 없음”을 구분하는 도구입니다.

### 직접 재현하고 살펴보기

각 실험의 재현 방법은 해당 저장소 README에 있습니다. 연결된 보고서는 저장된 로컬 실행을 보여 주며, 실험을 실시간으로 실행하지 않습니다. [포트폴리오 소스](docs/)는 `npm start` 후 `http://127.0.0.1:4173`에서 미리 볼 수 있습니다.

모두 가상 데이터를 사용하는 독립적인 개인 실험입니다. 회사 코드, 내부 설계, 비공개 데이터 또는 실서비스 성과를 재현하지 않습니다.
