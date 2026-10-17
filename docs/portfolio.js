import { mountWorkbench } from "./workbench.js";

const copy = {
  en: {
    title: "Minjae Lee — It works. I have questions.",
    description:
      "Interactive engineering notes on commerce recovery, automation approval and GraphQL cancellation. Independent experiments by Minjae Lee.",
    skip: "Skip to selected work",
    home: "Minjae Lee portfolio home",
    role: "Software engineer at NAVER",
    mainNav: "Main navigation",
    language: "Language",
    navWork: "Field notes",
    navApproach: "The human",
    eyebrow: "SOFTWARE, WITH A SECOND LOOK.",
    heroFirst: "It works.",
    heroSecond: "I have questions.",
    starLabel: "Explore the questions",
    heroLead:
      "Hi, I’m Minjae. I build interfaces people can rely on, and think through what happens after the click.",
    specialties:
      "7+ years in booking, ordering & payments. Now building AI-assisted developer tools.",
    explore: "Let’s poke at it",
    playTitle: "A little curiosity goes a long way.",
    playAside: "Please touch the exhibits.",
    workEyebrow: "THE LONGER VERSION",
    workTitle: "Good questions deserve working code.",
    workLead:
      "Three independent labs. The decisions, the counterexamples, and the receipts.",
    smallTool: "ALSO IN THE TOOLBOX",
    guardsDescription:
      "“Nothing found” is doing a lot of work when nothing was checked.",
    guardsLink: "Open the toolbox",
    approachEyebrow: "THE PERSON BEHIND THE QUESTIONS",
    approachTitle: "Serious about the work. Still curious about everything.",
    bio: "I’m a software engineer at NAVER, with 7+ years across booking, ordering, payments and merchant tools. I work with React, TypeScript and GraphQL API servers built with Apollo Federation.",
    bioTwo:
      "Lately, I’ve been building AI-assisted tools and QA/release automation. I’m interested in how a small team can attempt bigger things without losing its grip on the details.",
    contact: "Continue the conversation",
    article: "More on verification →",
    footer: "Made with care. And a few more questions.",
    disclosure:
      "Independent personal experiments with synthetic data. No employer code, internal architecture or production results.",
    source: "Source",
    report: "Recorded run",
    historyNote: "Observed history",
    evidence: "Show the receipts",
    revision: "Recording source",
    projects: {
      intent: {
        category: "COMMERCE / RECOVERY",
        question: "The reservation is saved. The screen missed the news.",
        description:
          "A lost HTTP response leaves the screen uncertain. Follow the same intent across recovery, then see what changes when another system forgets the retry key.",
        cta: "Follow the missing response",
        tags: ["React + TypeScript", "HTTP + SQLite", "Crash recovery"],
      },
      change: {
        category: "AI / DEVELOPER AUTOMATION",
        question: "The patch passed. It also changed the rules.",
        description:
          "A scripted candidate makes its compiler check green by changing the check. Compare that result with a fixed policy, then bind approval to the exact Git candidate.",
        cta: "Look behind the green check",
        tags: ["Git CAS", "Verification policy", "Approval boundaries"],
      },
      cancellation: {
        category: "GRAPHQL / EXECUTION",
        question: "The request left. The work stayed late.",
        description:
          "The gateway stops waiting. Four policies reveal what happens to the work—and the capacity it still occupies.",
        cta: "Follow the unfinished work",
        tags: ["Apollo Federation", "AbortSignal", "Admission control"],
      },
    },
  },
  ko: {
    title: "Minjae Lee — 잘됩니다. 질문이 좀 있습니다.",
    description:
      "커머스 복구, 자동화 승인, GraphQL 취소. 직접 만져보며 읽는 민재의 독립 엔지니어링 실험 노트.",
    skip: "대표 작업으로 이동",
    home: "Minjae Lee 포트폴리오 홈",
    role: "네이버 소프트웨어 엔지니어",
    mainNav: "주요 메뉴",
    language: "언어 선택",
    navWork: "실험 노트",
    navApproach: "만드는 사람",
    eyebrow: "한 번 더 들여다보는 소프트웨어.",
    heroFirst: "잘됩니다.",
    heroSecond: "질문이 좀 있습니다.",
    starLabel: "어떤 질문인지 살펴보기",
    heroLead:
      "안녕하세요, 민재입니다. 사람들이 믿고 누를 수 있는 화면을 만들고, 그다음에 일어나는 일까지 설계합니다.",
    specialties: "예약·주문·결제 7년+ · AI·개발 자동화로 확장 중",
    explore: "한번 건드려 볼까요",
    playTitle: "궁금한 건, 눌러봐야죠.",
    playAside: "전시물을 만져 주세요.",
    workEyebrow: "조금 더 깊이 들어가면",
    workTitle: "좋은 질문은 코드로 이어집니다.",
    workLead:
      "세 가지 독립 실험. 선택한 설계와 반례, 직접 확인할 수 있는 근거까지.",
    smallTool: "도구함에는 이런 것도",
    guardsDescription:
      "아무것도 검사하지 않았는데, “문제없음”이라면 곤란하니까요.",
    guardsLink: "도구함 열어보기",
    approachEyebrow: "질문 뒤에 있는 사람",
    approachTitle: "일에는 진지하게. 호기심은 잃지 않게.",
    bio: "네이버에서 7년 이상 예약·주문·결제와 사업자 도구를 개발해 왔습니다. React·TypeScript 프론트엔드와 Apollo Federation 기반 GraphQL API 서버를 다룹니다.",
    bioTwo:
      "최근에는 AI 개발 도구와 QA·릴리스 자동화를 만들고 있습니다. 작은 팀도 더 큰 일을 시도할 수 있게 하면서, 중요한 디테일을 놓치지 않는 방법에 관심이 많습니다.",
    contact: "이야기 이어가기",
    article: "검증에 관한 글 더 읽기 →",
    footer: "꼼꼼하게 만들었습니다. 질문은 조금 남겨두었고요.",
    disclosure:
      "가상 데이터를 쓰는 독립적인 개인 실험입니다. 회사 코드·내부 설계·실서비스 성과를 재현하지 않습니다.",
    source: "소스 코드",
    report: "실행 기록",
    historyNote: "관측 기록 탐색",
    evidence: "근거도 궁금하다면",
    revision: "기록 당시 소스",
    projects: {
      intent: {
        category: "커머스 / 복구",
        question: "예약은 됐는데, 화면만 모릅니다.",
        description:
          "HTTP 응답을 놓친 화면은 결과를 확신할 수 없습니다. 같은 의도로 복구하는 과정부터, 상대 시스템이 재시도 키를 잊은 뒤의 한계까지 살펴봅니다.",
        cta: "사라진 응답 따라가기",
        tags: ["React + TypeScript", "HTTP + SQLite", "프로세스 종료 후 복구"],
      },
      change: {
        category: "AI / 개발 자동화",
        question: "패치는 통과했습니다. 검사 기준도 바꿨더군요.",
        description:
          "검사 설정을 바꿔 초록 결과를 만드는 후보를 스크립트로 재현했습니다. 고정된 정책의 결과와 비교하고, 승인을 정확한 Git 후보에 연결합니다.",
        cta: "초록 체크 뒤 들여다보기",
        tags: ["Git CAS", "검사 정책", "자동화 승인 경계"],
      },
      cancellation: {
        category: "GRAPHQL / 실행 제어",
        question: "요청은 퇴근했는데, 작업은 아직입니다.",
        description:
          "게이트웨이가 대기를 끝낸 뒤에도 작업은 남을 수 있습니다. 네 가지 취소 정책으로, 그 작업과 아직 차지하고 있는 처리 용량을 비교합니다.",
        cta: "남은 작업 따라가기",
        tags: ["Apollo Federation", "AbortSignal", "진입 제어"],
      },
    },
  },
};
const projects = [
  {
    id: "intent",
    title: "Intent / Recovery",
    source: "https://github.com/minjae-lee-kr/intent-recovery-lab",
    revision: "e081192",
    url: "evidence/intent/",
    note: "notes/retention-boundary/",
    history: "evidence/history/",
  },
  {
    id: "change",
    title: "Verified Change",
    source: "https://github.com/minjae-lee-kr/verified-change-lab",
    revision: "5eb3fe8",
    url: "evidence/change/",
    note: "notes/verified-change/",
  },
  {
    id: "cancellation",
    title: "Cancellation Debt",
    source: "https://github.com/minjae-lee-kr/federated-catalog-lab",
    revision: "ff47d27",
    url: "evidence/cancellation/",
    note: "notes/cancellation-debt/",
  },
];
const key = "minjae.portfolio.language";
let language = navigator.language.toLowerCase().startsWith("ko") ? "ko" : "en";
try {
  const saved = localStorage.getItem(key);
  if (saved === "ko" || saved === "en") language = saved;
} catch {
  /* Browser preference also works without storage. */
}
const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
function renderProjects(t) {
  const focused = document.activeElement;
  const cardId = focused?.closest("#projects article")?.id;
  const focusedHref = cardId ? focused.getAttribute("href") : null;
  const focusedSummary = cardId && focused.tagName === "SUMMARY";
  const opened = new Set(
    [...document.querySelectorAll("#projects details[open]")].map(
      (node) => node.closest("article").id,
    ),
  );
  document.querySelector("#projects").replaceChildren(
    ...projects.map((project, index) => {
      const text = t.projects[project.id];
      const card = element("article", "project");
      card.id = project.id;
      const indexColumn = element("div", "project-index");
      indexColumn.append(
        element("span", "project-number", String(index + 1).padStart(2, "0")),
        element("span", "project-name", project.title),
      );
      const body = element("div", "project-copy");
      const heading = element("h3", "", text.question);
      heading.id = project.id + "-title";
      card.setAttribute("aria-labelledby", heading.id);
      const tags = element("p", "project-tech", text.tags.join(" / "));
      const links = element("div", "project-links");
      const note = element("a", "text-link", text.cta);
      note.href = project.note;
      note.append(element("span", "link-arrow", "↗"));
      note.setAttribute("aria-label", project.title + " — " + text.cta);
      const source = element("a", "source-link", t.source + " ↗");
      source.href = project.source;
      source.rel = "noreferrer";
      source.setAttribute("aria-label", project.title + " — " + t.source);
      links.append(note, source);
      const details = element("details", "evidence-details");
      details.open = opened.has(project.id);
      const summary = element("summary", "", t.evidence);
      summary.setAttribute("aria-label", project.title + " — " + t.evidence);
      const evidenceLinks = element("div", "evidence-links");
      const report = element("a", "", t.report + " →");
      report.href = project.url;
      report.setAttribute("aria-label", project.title + " — " + t.report);
      evidenceLinks.append(report);
      if (project.history) {
        const history = element("a", "", t.historyNote + " →");
        history.href = project.history;
        evidenceLinks.append(history);
      }
      evidenceLinks.append(
        element(
          "span",
          "source-revision",
          t.revision + " · " + project.revision,
        ),
      );
      details.append(summary, evidenceLinks);
      body.append(
        element("p", "eyebrow", text.category),
        heading,
        element("p", "description", text.description),
        tags,
        links,
        details,
      );
      card.append(indexColumn, body);
      return card;
    }),
  );
  if (cardId) {
    const replacement = focusedSummary
      ? document.querySelector("#" + cardId + " summary")
      : [...document.querySelectorAll("#projects article a")].find(
          (link) =>
            link.closest("article").id === cardId &&
            link.getAttribute("href") === focusedHref,
        );
    replacement?.focus({ preventScroll: true });
  }
}
let workbench;
function render() {
  const t = copy[language];
  document.documentElement.lang = language;
  document.title = t.title;
  document.querySelector("meta[name=description]").content = t.description;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t[node.dataset.i18n];
  });
  document
    .querySelectorAll("[data-i18n-aria]")
    .forEach((node) =>
      node.setAttribute("aria-label", t[node.dataset.i18nAria]),
    );
  document
    .querySelectorAll("[data-language]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.language === language),
      ),
    );
  renderProjects(t);
  workbench?.setLanguage(language);
}
document.querySelectorAll("[data-language]").forEach((button) =>
  button.addEventListener("click", () => {
    language = button.dataset.language;
    try {
      localStorage.setItem(key, language);
    } catch {
      /* Switching works without storage. */
    }
    render();
  }),
);
render();
workbench = mountWorkbench(document.querySelector("#workbench"), { language });
window.addEventListener("pageshow", () => {
  try {
    const saved = localStorage.getItem(key);
    if ((saved === "ko" || saved === "en") && saved !== language) {
      language = saved;
      render();
    }
  } catch {
    /* Keep the current view. */
  }
  // A history traversal may restore native input values after pageshow. Keep
  // the slider, its accessible text and the illustration on the same state.
  requestAnimationFrame(() => workbench.setLanguage(language));
});
