const copy = {
  en: {
    title: 'Minjae Lee — Engineering Labs',
    description:
      'Independent engineering experiments in commerce recovery, evidence-bound changes and GraphQL cancellation.',
    skip: 'Skip to selected work',
    home: 'Minjae Lee portfolio home',
    mainNav: 'Main navigation',
    language: 'Language',
    navWork: 'Selected work',
    navApproach: 'Approach',
    heroFirst: 'Ambitious products.',
    heroSecond: 'Dependable decisions.',
    heroLead:
      'Commerce experiences, GraphQL APIs and developer automation. Independent experiments that make difficult failure modes inspectable.',
    explore: 'Explore the work',
    domainProduct: '01 / Product',
    domainContracts: '02 / Contracts',
    domainEvidence: '03 / Evidence',
    workEyebrow: 'SELECTED WORK',
    workTitle: 'Start with the difficult case.',
    workLead: 'Real local I/O. Reproducible counterexamples. The limits are part of the result.',
    publication:
      'Source repositories are pending publication. The linked reports are read-only recordings of local runs.',
    smallTool: 'A SMALL PUBLIC TOOL',
    guardsDescription:
      'Distinguish “nothing found” from “nothing checked.” A compact companion to the larger experiments.',
    guardsLink: 'View the public code',
    approachEyebrow: 'A WAY OF WORKING',
    approachTitle: 'Make the ambition tangible.',
    bio: 'I’m a software engineer at NAVER. My work spans commerce experiences, GraphQL API servers and developer productivity.',
    principleOne: 'Follow the whole journey.',
    principleOneBody:
      'Connect what a person intends to do with the client state, API contract and durable result.',
    principleTwo: 'Test the uncomfortable assumption.',
    principleTwoBody:
      'Reproduce the plausible approach that fails, then compare the protected path under the same fault.',
    principleThree: 'Keep the claim inspectable.',
    principleThreeBody:
      'Show the recorded evidence, the source revision and what the experiment cannot prove.',
    disclosure:
      'Independent personal projects using synthetic data. No employer code, internal architecture or production results are reproduced.',
    article: 'Read the engineering note',
    footer: 'Built to be explored, questioned and improved.',
    report: 'Read the recorded run',
    caseNote: 'Read the engineering note',
    historyNote: 'Explore the observed history',
    recorded: 'Recorded local run',
    pendingReport: 'Recorded report being prepared',
    revision: 'Recorded run source',
    projects: {
      intent: {
        category: 'Commerce systems',
        status: 'Recorded execution',
        question: 'The response disappeared. The reservation didn’t.',
        description:
          'A recovery state machine, durable decision journal and bounded API-history checker. Lost responses and late commits expose what retries must preserve—and what the screen still cannot know.',
        labels: ['Intent', 'Committed', 'No response'],
        visualLabel: 'INTENT / RESULT / RECOVERY',
        visualNote: 'Recover by identity, not by guessing the outcome.',
        tags: ['HTTP + SQLite', 'Process crashes', 'Durable intent'],
      },
      change: {
        category: 'Developer automation',
        status: 'Real Git experiment',
        question: 'A check passed. Did we select the code it checked?',
        description:
          'An approval harness binds immutable Git candidates to independently defined checks. A deliberate TypeScript control shows why the checked code and the policy behind “passed” must stay together.',
        labels: ['Candidate', 'Evidence', 'Git ref'],
        visualLabel: 'ARTIFACT / POLICY / APPROVAL',
        visualNote: 'Bind the artifact and the meaning of its evidence.',
        tags: ['Git CAS', 'Checker processes', 'Policy boundaries'],
      },
      cancellation: {
        category: 'GraphQL experiment',
        status: 'Four policies compared',
        question: 'The permit was returned. The work was still running.',
        description:
          'Request-scoped cancellation and permits held until work settles. Four policies expose how a healthy-looking limiter can hide excess work, and the tradeoff between rejecting new requests and cancelling cooperative work.',
        labels: ['Client leaves', 'Gateway stops waiting', 'Work remains?'],
        visualLabel: 'CANCELLATION / CAPACITY / COMPLETION',
        visualNote: 'Track physical work beyond the caller’s wait.',
        tags: ['Apollo Federation', 'AbortSignal', 'Admission control'],
      },
    },
  },
  ko: {
    title: 'Minjae Lee — 엔지니어링 실험',
    description:
      '커머스 복구, 검증 근거에 연결한 변경, GraphQL 취소를 다루는 독립 엔지니어링 실험입니다.',
    skip: '대표 작업으로 이동',
    home: 'Minjae Lee 포트폴리오 홈',
    mainNav: '주요 메뉴',
    language: '언어 선택',
    navWork: '대표 작업',
    navApproach: '일하는 방식',
    heroFirst: '더 큰 가능성을,',
    heroSecond: '믿고 쓸 수 있도록.',
    heroLead:
      '커머스 경험, GraphQL API, 개발 자동화. 복잡한 실패 상황을 직접 실행하고 설명하는 독립적인 개인 실험입니다.',
    explore: '작업 살펴보기',
    domainProduct: '01 / 제품 경험',
    domainContracts: '02 / API 계약',
    domainEvidence: '03 / 검증 근거',
    workEyebrow: '대표 작업',
    workTitle: '어려운 상황에서 시작합니다.',
    workLead: '실제 로컬 I/O와 재현 가능한 반례. 증명할 수 있는 범위까지 함께 보여줍니다.',
    publication:
      '소스 저장소는 공개 준비 중입니다. 연결된 보고서는 로컬 실행을 기록한 읽기 전용 자료입니다.',
    smallTool: '공개된 작은 도구',
    guardsDescription:
      '“발견한 문제가 없음”과 “검사한 것이 없음”을 구분합니다. 더 큰 실험의 출발점이 된 작은 도구입니다.',
    guardsLink: '공개 코드 보기',
    approachEyebrow: '일하는 방식',
    approachTitle: '큰 목표를 구체적인 결과로.',
    bio: '네이버에서 커머스 경험, GraphQL API 서버, 개발 생산성을 다루는 소프트웨어 엔지니어입니다.',
    principleOne: '사용자의 의도부터 결과까지.',
    principleOneBody:
      '사람이 하려는 일과 클라이언트 상태, API 계약, 저장된 결과를 하나의 흐름으로 봅니다.',
    principleTwo: '당연하게 여긴 가정을 시험합니다.',
    principleTwoBody:
      '그럴듯하지만 실패하는 접근을 먼저 재현하고, 같은 상황에서 보호된 경로와 비교합니다.',
    principleThree: '주장을 직접 확인할 수 있도록.',
    principleThreeBody:
      '실행 근거와 소스 버전, 그리고 이 실험으로 증명할 수 없는 범위를 함께 남깁니다.',
    disclosure:
      '가상 데이터를 사용하는 독립적인 개인 프로젝트입니다. 회사 코드, 내부 설계 또는 실서비스 성과를 재현하지 않습니다.',
    article: '엔지니어링 글 읽기',
    footer: '살펴보고, 질문하고, 더 나아질 수 있도록.',
    report: '실행 기록 읽어보기',
    caseNote: '설계 판단 읽어보기',
    historyNote: '관측 순서 살펴보기',
    recorded: '기록된 로컬 실행',
    pendingReport: '실행 기록 보고서 준비 중',
    revision: '기록 당시 소스 버전',
    projects: {
      intent: {
        category: '커머스 시스템',
        status: '실행 기록 제공',
        question: '응답은 사라졌지만, 예약은 남았다.',
        description:
          '복구 상태 모델, 영속 결정 기록, API 관측 순서 검사기를 구현했습니다. 응답 유실과 지연 커밋을 통해 재시도에서 지킬 식별자와 화면이 아직 알 수 없는 결과를 구분합니다.',
        labels: ['사용자의 의도', '커밋 완료', '응답 유실'],
        visualLabel: '의도 / 결과 / 복구',
        visualNote: '결과를 추측하지 않고, 같은 의도로 다시 확인합니다.',
        tags: ['HTTP + SQLite', '프로세스 종료', '재시도 식별자'],
      },
      change: {
        category: '개발 자동화',
        status: '실제 Git 실험',
        question: '검사는 통과했다. 반영할 코드는 같은가?',
        description:
          '불변 Git 후보와 독립된 검사 정책에 승인을 연결하는 실행 도구입니다. 의도적으로 검사 설정을 약화한 TypeScript 대조군으로, 검토한 코드와 ‘통과’의 의미를 함께 보존해야 하는 이유를 보여줍니다.',
        labels: ['변경 후보', '검증 근거', 'Git ref'],
        visualLabel: '산출물 / 정책 / 승인',
        visualNote: '산출물뿐 아니라, 검증 근거의 의미까지 연결합니다.',
        tags: ['Git CAS', '검사 프로세스', '정책 경계'],
      },
      cancellation: {
        category: 'GraphQL 실행 실험',
        status: '네 가지 정책 비교',
        question: '허가는 돌아왔는데, 작업은 끝나지 않았다.',
        description:
          '요청별 취소 신호를 전달하고 실제 작업 종료까지 실행 허가를 유지합니다. 네 가지 정책으로 정상처럼 보이는 제한기 뒤의 초과 작업과, 추가 요청 거절·협력적 취소의 차이를 드러냅니다.',
        labels: ['클라이언트 이탈', '게이트웨이 대기 종료', '실제 작업은?'],
        visualLabel: '취소 / 처리 용량 / 완료',
        visualNote: '호출자의 대기 이후에도 남은 작업을 추적합니다.',
        tags: ['Apollo Federation', 'AbortSignal', '진입 제어'],
      },
    },
  },
};
const projects = [
  {
    id: 'intent',
    title: 'Intent / Recovery',
    revision: 'e081192',
    url: 'evidence/intent/',
    note: 'evidence/history/',
    noteLabel: 'historyNote',
  },
  {
    id: 'change',
    title: 'Verified Change',
    revision: '5eb3fe8',
    url: 'evidence/change/',
    note: 'notes/verified-change/',
  },
  {
    id: 'cancellation',
    title: 'Cancellation Debt',
    revision: 'ff47d27',
    url: 'evidence/cancellation/',
    note: 'notes/cancellation-debt/',
  },
];
const key = 'minjae.portfolio.language';
let language = navigator.language.toLowerCase().startsWith('ko') ? 'ko' : 'en';
try {
  const saved = localStorage.getItem(key);
  if (saved === 'ko' || saved === 'en') language = saved;
} catch {
  /* Browser preference remains available without storage. */
}
const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
function renderProjects(t) {
  document.querySelector('#projects').replaceChildren(
    ...projects.map((project) => {
      const text = t.projects[project.id];
      const card = element(
        'article',
        project.id === 'cancellation' ? 'project secondary' : 'project',
      );
      card.id = project.id;
      const visual = element('div', 'project-visual');
      visual.setAttribute('aria-hidden', 'true');
      visual.append(element('span', 'visual-label', text.visualLabel));
      const flow = element('div', 'flow');
      text.labels.forEach((label, index) => {
        const box = element('div', index === 1 ? 'flow-node emphasized' : 'flow-node', label);
        flow.append(box);
        if (index < 2) flow.append(element('span', 'flow-arrow', '→'));
      });
      visual.append(flow, element('p', 'diagram-note', text.visualNote));
      const body = element('div', 'project-copy');
      const meta = element('div', 'project-meta');
      meta.append(element('span', '', text.category), element('span', 'status', text.status));
      const heading = element('h3', '', project.title);
      heading.id = project.id + '-title';
      card.setAttribute('aria-labelledby', heading.id);
      const tags = element('div', 'tags');
      for (const tag of text.tags) tags.append(element('span', 'tag', tag));
      const links = element('div', 'project-links');
      if (project.note) {
        const label = t[project.noteLabel ?? 'caseNote'];
        const noteLink = element('a', '', label + ' →');
        noteLink.href = project.note;
        noteLink.setAttribute('aria-label', project.title + ' — ' + label);
        links.append(noteLink);
      }
      if (project.url) {
        const link = element('a', '', t.report + ' ↗');
        link.href = project.url;
        link.setAttribute('aria-label', project.title + ' — ' + t.report);
        links.append(link);
      } else links.append(element('span', 'pending', t.pendingReport));
      const revision = element('p', 'source-revision', t.revision + ' ' + project.revision);
      body.append(
        meta,
        heading,
        element('p', 'question', text.question),
        element('p', 'description', text.description),
        tags,
        links,
        revision,
      );
      card.append(visual, body);
      return card;
    }),
  );
}
function render() {
  const t = copy[language];
  document.documentElement.lang = language;
  document.title = t.title;
  document.querySelector('meta[name=description]').content = t.description;
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    node.textContent = t[node.dataset.i18n];
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((node) => {
    node.setAttribute('aria-label', t[node.dataset.i18nAria]);
  });
  document.querySelectorAll('[data-language]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  });
  renderProjects(t);
}
document.querySelectorAll('[data-language]').forEach((button) =>
  button.addEventListener('click', () => {
    language = button.dataset.language;
    try {
      localStorage.setItem(key, language);
    } catch {
      /* Language switching works even when storage is blocked. */
    }
    render();
  }),
);
render();
// A report can change the shared preference before browser Back restores this page.
window.addEventListener('pageshow', () => {
  try {
    const saved = localStorage.getItem(key);
    if ((saved === 'ko' || saved === 'en') && saved !== language) {
      language = saved;
      render();
    }
  } catch {
    /* Keep the current view when browser storage is unavailable. */
  }
});
