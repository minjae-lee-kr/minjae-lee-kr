[English](README.md) · [한국어](README.ko.md)

# 완료됐다는 말, 어디까지 믿어도 될까요?

7년 이상 예약·주문·결제 서비스를 개발해 온 이민재입니다. React·TypeScript 프론트엔드, Apollo Federation 기반 GraphQL API 서버, AI를 활용한 개발 도구와 업무 자동화를 다룹니다.

[**포트폴리오 둘러보기 · 한국어 / English →**](https://minjae-lee-kr.github.io/) · [LinkedIn](https://www.linkedin.com/in/minjae-lee-kr/)

### 01 / Intent · Recovery

**응답을 못 받은 예약, 다시 요청해도 될까?**

응답이 끊겨도 예약 결과를 다시 확인하고, 이전 요청의 응답이 현재 화면을 덮지 않도록 합니다. 중복 방지 기록이 삭제된 뒤의 재시도도 별도 실험으로 살펴봤습니다.

[복구 UI의 설계 판단](https://github.com/minjae-lee-kr/intent-recovery-lab/blob/main/docs/design.ko.md) · [소스](https://github.com/minjae-lee-kr/intent-recovery-lab)

[기본 복구 실험 기록](https://minjae-lee-kr.github.io/evidence/intent/) · [보존 기간 실험 기록](https://minjae-lee-kr.github.io/notes/retention-boundary/#records)

### 02 / Verified Change

**검사를 통과한 코드, 검사 기준도 바뀌었다면?**

수정 코드가 검사 설정까지 바꿀 수 있다면 통과 결과만으로는 부족합니다. 별도로 정한 기준으로 검증하고, 확인한 커밋과 검사 정책에만 승인이 적용되도록 구성했습니다. LLM을 호출하지 않는 스크립트 실험입니다.

[해설 읽기](https://minjae-lee-kr.github.io/notes/verified-change/) · [소스](https://github.com/minjae-lee-kr/verified-change-lab) · [실행 기록](https://minjae-lee-kr.github.io/evidence/change/)

### 03 / Cancellation Debt

**타임아웃 뒤, 실행 슬롯은 언제 반환해야 할까?**

작업이 끝나기 전에 슬롯을 반환하면 실제 작업 수가 한도를 넘을 수 있습니다. 네 가지 정책으로 취소와 슬롯 반환 시점, 뒤따르는 요청의 거절을 비교했습니다.

[해설 읽기](https://minjae-lee-kr.github.io/notes/cancellation-debt/) · [소스](https://github.com/minjae-lee-kr/federated-catalog-lab) · [실행 기록](https://minjae-lee-kr.github.io/evidence/cancellation/)

같은 실험의 다른 주제: [검사는 통과했지만, 생성 타입은 예전 것이었다](https://minjae-lee-kr.github.io/notes/generated-consumer/)

[**Empty Check Guards**](https://github.com/minjae-lee-kr/empty-check-guards)도 만들었습니다. “발견한 문제가 없음”과 “검사한 것이 없음”을 구분하는 도구입니다.

### 직접 재현하고 살펴보기

각 실험의 재현 방법은 해당 저장소 README에 있습니다. 연결된 보고서는 저장된 로컬 실행을 보여 주며, 실험을 실시간으로 실행하지 않습니다. [포트폴리오 소스](docs/)는 `npm start` 후 `http://127.0.0.1:4173`에서 미리 볼 수 있습니다.

모두 가상 데이터를 사용하는 독립적인 개인 실험입니다. 회사 코드, 내부 설계, 비공개 데이터 또는 실서비스 성과를 재현하지 않습니다.
