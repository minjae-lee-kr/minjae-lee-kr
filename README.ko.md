[English](README.md) · [한국어](README.ko.md)

# 완료됐다는 말, 어디까지 믿어도 될까요?

7년 이상 예약·주문·결제 서비스를 개발해 온 이민재입니다. React·TypeScript 프론트엔드, Apollo Federation 기반 GraphQL API 서버, AI를 활용한 개발 도구와 업무 자동화를 다룹니다.

[**포트폴리오 둘러보기 · 한국어 / English →**](https://minjae-lee-kr.github.io/) · [LinkedIn](https://www.linkedin.com/in/minjae-lee-kr/)

### 01 / Intent · Recovery

**응답을 못 받은 예약, 다시 요청해도 될까?**

재시도·새로고침 때도 같은 예약 키와 요청 내용을 유지하고, 이전 화면 요청의 늦은 응답은 무시합니다. 별도 보존 기간 실험에서는 기록이 없다는 응답만으로 재시도를 결정할 수 없는 조건을 확인합니다.

[복구 UI의 설계 판단](https://github.com/minjae-lee-kr/intent-recovery-lab/blob/main/docs/design.ko.md) · [소스](https://github.com/minjae-lee-kr/intent-recovery-lab)

[기본 복구 실험 기록](https://minjae-lee-kr.github.io/evidence/intent/) · [보존 기간 실험 기록](https://minjae-lee-kr.github.io/notes/retention-boundary/#records)

[로컬 기록은 같지만 실제 결과는 다른 두 실행 비교하기 →](https://minjae-lee-kr.github.io/research/what-the-client-knows/)

### 02 / Verified Change

**검사를 통과한 코드, 검사 기준도 바뀌었다면?**

타입 오류가 남아 있어도 검사를 끄면 컴파일러는 오류 없이 끝납니다. 검사 옵션을 고정하고, 승인·적용 대상을 검사한 커밋과 정책에 묶었습니다. LLM을 호출하지 않는 스크립트 실험입니다.

[해설 읽기](https://minjae-lee-kr.github.io/notes/verified-change/) · [소스](https://github.com/minjae-lee-kr/verified-change-lab) · [실행 기록](https://minjae-lee-kr.github.io/evidence/change/)

후속 실험: [코드를 되돌리면, 승인도 다시 쓸 수 있을까?](https://minjae-lee-kr.github.io/research/approval-memory/) 코드 선택과 승인 사용 기록을 한 상태에 묶고, 되돌릴 때 남는 것을 비교합니다.

### 03 / Cancellation Debt

**타임아웃 뒤, 실행 슬롯은 언제 반환해야 할까?**

타임아웃 때 슬롯을 반환하면 작업이 끝나기 전에 새 작업을 받을 수 있습니다. 네 정책을 비교해, 작업이 끝날 때까지 슬롯을 유지하면 한도를 지키는 대신 뒤의 요청을 거절할 수 있음을 확인했습니다.

[해설 읽기](https://minjae-lee-kr.github.io/notes/cancellation-debt/) · [소스](https://github.com/minjae-lee-kr/federated-catalog-lab) · [실행 기록](https://minjae-lee-kr.github.io/evidence/cancellation/)

같은 실험의 다른 주제: [검사는 통과했지만, 생성 타입은 예전 것이었다](https://minjae-lee-kr.github.io/notes/generated-consumer/)

[재고 조회 하나가 실패했는데, 상품까지 사라졌습니다.](https://minjae-lee-kr.github.io/research/partial-data/) 배치 오류 처리와 null 허용 여부를 바꾼 세 조건의 실제 응답을 비교합니다.

[다음 조회에는 왜 오류가 없을까?](https://minjae-lee-kr.github.io/research/client-cache/) 같은 부분 응답을 Apollo Client에서 조회합니다. 받은 데이터를 남길지, 이전 값을 유지할지, HTTP 요청을 다시 보낼지에 따라 감수할 비용이 달라집니다.

[오류는 사라졌는데, 재확인은 실패했습니다.](https://minjae-lee-kr.github.io/research/react-recheck/?lang=ko) React 화면에 남은 값과 재확인 결과를 실제 DOM·HTTP로 구분합니다.

[요청 상태를 보호하면 캐시도 안전할까요?](https://minjae-lee-kr.github.io/research/react-attempts/?lang=ko) 실제 React 컴포넌트에서 응답 순서를 제어하며, 자동 캐시 쓰기와 현재 조회에만 허용한 쓰기를 비교합니다.

[**Empty Check Guards**](https://github.com/minjae-lee-kr/empty-check-guards)도 만들었습니다. “발견한 문제가 없음”과 “검사한 것이 없음”을 구분하는 도구입니다.

### 직접 재현하고 살펴보기

각 실험의 재현 방법은 해당 저장소 README에 있습니다. 연결된 보고서는 저장된 로컬 실행을 보여 주며, 실험을 실시간으로 실행하지 않습니다. [포트폴리오 소스](docs/)는 `npm start` 후 `http://127.0.0.1:4173`에서 미리 볼 수 있습니다.

모두 가상 데이터를 사용하는 독립적인 개인 실험입니다. 회사 코드, 내부 설계, 비공개 데이터 또는 실서비스 성과를 재현하지 않습니다.
