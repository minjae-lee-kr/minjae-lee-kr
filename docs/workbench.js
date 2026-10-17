const words = {
  en: {
    disclosure: "Fixed illustrations, not live experiments.",
    tabs: ["Lost response", "Green check", "Caller stopped"],
    tabLabel: "Explore an engineering question",
    recorded: "Inspect the real recorded run",
    receipt: {
      project: "INTENT / RECOVERY",
      title: "The reply vanished. Where is the reservation?",
      body: "In this example, the reservation committed before the reply was lost. The client still needs evidence of that outcome.",
      action: "Look up the same intent",
      reset: "Reset the illustration",
      boundary:
        "The original outcome is retained here. An absent lookup would leave the result unknown.",
      client: "Client",
      journal: "Journal",
      lost: "Reply lost",
      paper: "RESERVATION RECEIPT",
      unknown: "Not yet observed",
      confirmed: "Confirmed.",
      before: "The missing reply cannot tell you what was committed.",
      after:
        "The lookup returns the original receipt. No new reservation was requested.",
      identity: "Intent",
      identityValue: "The original one",
      result: "Client knowledge",
      uncertain: "Unknown",
      recovered: "Outcome recovered",
      stamp: "SAME INTENT",
      announcement:
        "The original receipt was recovered. The reservation is confirmed.",
    },
    check: {
      project: "VERIFIED CHANGE",
      title: "Who decided what “passed” means?",
      body: "Same code, different verdict. The result depends on who gets to choose the checking rules.",
      action: "Use independent compiler options",
      reset: "Show candidate-controlled options",
      boundary:
        "This closes the configuration route shown here. Source-level suppression remains a separate policy boundary.",
      excerpt: "SAME PARAMETER EXCERPT",
      candidate: "Candidate-controlled options",
      independent: "Independent options",
      candidateOptions: "strict: true · noCheck: true",
      independentOptions: "strict: true · noCheck omitted",
      empty: "0 reported type errors",
      errors: "2 implicit-any errors",
      emptyDetail: "Type checking was skipped as configured.",
      errorDetail:
        "method and status need explicit types. Approval is refused.",
      caption:
        "Illustrates the recorded TypeScript control; no compiler runs here.",
    },
    cancellation: {
      project: "CANCELLATION DEBT",
      title: "The caller stopped. Is the capacity free?",
      body: "This work ignores cancellation. Ending the caller’s wait leaves the underlying operation running.",
      boundary:
        "The protected policy keeps its permit until the work settles. Cooperative cancellation is a separate behavior in the recorded comparison.",
      slider: "Move through the sequence",
      wait: "Caller’s wait",
      work: "Physical work",
      permit: "Permit",
      held: "Held",
      released: "Released",
      starts: "Start",
      waitEnds: "Wait ends",
      settles: "Work settles",
      caption:
        "Positions show sequence, not elapsed time or measured performance.",
      phases: [
        "The work starts. Its permit is held.",
        "The caller stops waiting. The work is still running.",
        "The caller has left. The work still holds its permit.",
        "The work settles. Its permit can now be released.",
      ],
    },
  },
  ko: {
    disclosure: "고정된 설명 예제입니다. 실제 실험을 실행하지 않습니다.",
    tabs: ["응답 유실", "검사 통과", "대기 종료"],
    tabLabel: "살펴볼 설계 질문",
    recorded: "실제 실행 기록 살펴보기",
    receipt: {
      project: "INTENT / RECOVERY",
      title: "응답은 사라졌습니다. 예약은 어디에 있을까요?",
      body: "이 예제에서는 예약이 커밋된 뒤 응답이 유실됐습니다. 화면은 그 결과를 확인할 근거가 필요합니다.",
      action: "같은 의도로 결과 조회",
      reset: "설명 장면 다시 보기",
      boundary:
        "여기서는 원래 결과가 보존돼 있습니다. 조회 결과가 없다면 여전히 미확정입니다.",
      client: "클라이언트",
      journal: "저장된 기록",
      lost: "응답 유실",
      paper: "예약 확인서",
      unknown: "아직 확인하지 못한 결과",
      confirmed: "예약 확정.",
      before: "응답이 없다는 사실만으로 커밋 결과를 알 수 없습니다.",
      after:
        "조회로 원래 확인서를 찾았습니다. 새로운 예약을 요청하지 않았습니다.",
      identity: "요청의 의도",
      identityValue: "처음 요청한 그대로",
      result: "화면이 아는 결과",
      uncertain: "미확정",
      recovered: "결과 확인 완료",
      stamp: "같은 의도",
      announcement:
        "원래 확인서를 찾았습니다. 예약이 확정된 것을 확인했습니다.",
    },
    check: {
      project: "VERIFIED CHANGE",
      title: "누가 ‘통과’의 기준을 정했을까요?",
      body: "같은 코드도, 누가 정한 검사 설정을 쓰느냐에 따라 결과가 달라집니다.",
      action: "독립된 컴파일러 설정으로 비교",
      reset: "후보가 정한 설정으로 돌아가기",
      boundary:
        "이 설정 변경 경로를 차단하는 예제입니다. 소스 내부의 검사 생략 지시문은 별도 정책의 경계로 남습니다.",
      excerpt: "같은 매개변수 부분 발췌",
      candidate: "후보가 정한 검사 설정",
      independent: "독립적으로 정한 검사 설정",
      candidateOptions: "strict: true · noCheck: true",
      independentOptions: "strict: true · noCheck 생략",
      empty: "보고된 타입 오류 0개",
      errors: "암묵적 any 오류 2개",
      emptyDetail: "설정에 따라 타입 검사를 생략했습니다.",
      errorDetail: "method와 status에 타입이 필요합니다. 승인은 거절됩니다.",
      caption:
        "기록된 TypeScript 대조군을 설명합니다. 컴파일러를 실행하지 않습니다.",
    },
    cancellation: {
      project: "CANCELLATION DEBT",
      title: "대기는 끝났습니다. 처리 용량도 비었을까요?",
      body: "이 작업은 취소 신호를 무시합니다. 호출자가 기다리기를 멈춰도 실제 작업은 계속됩니다.",
      boundary:
        "보호된 정책은 작업 종료까지 허가를 유지합니다. 협력적 취소는 실제 기록에서 별도로 비교합니다.",
      slider: "진행 순서 살펴보기",
      wait: "호출자의 대기",
      work: "실제 작업",
      permit: "실행 허가",
      held: "유지",
      released: "반환",
      starts: "시작",
      waitEnds: "대기 종료",
      settles: "작업 종료",
      caption: "진행 순서를 표시합니다. 경과 시간이나 측정된 성능이 아닙니다.",
      phases: [
        "작업이 시작됩니다. 실행 허가를 유지합니다.",
        "호출자는 대기를 멈췄지만 작업은 계속됩니다.",
        "호출자가 떠난 뒤에도 작업이 실행 허가를 점유합니다.",
        "작업이 종료됐습니다. 이제 실행 허가를 반환합니다.",
      ],
    },
  },
};

let instance = 0;

/** A fixed explanatory model. It performs no requests or experiment execution. */
export function mountWorkbench(root, { language = "en" } = {}) {
  if (!root?.ownerDocument)
    throw new TypeError("A workbench mount element is required.");
  const doc = root.ownerDocument;
  const id = `wb-${++instance}`;
  let locale = language === "ko" ? "ko" : "en";
  let active = 0;
  let revealed = false;
  let independent = false;
  let phase = 1;
  let destroyed = false;
  const bindings = [];
  const cleanups = [];
  const el = (tag, className, text) => {
    const node = doc.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const bind = (node, text) => {
    bindings.push(() => {
      node.textContent = text(words[locale]);
    });
    return node;
  };
  const on = (node, event, listener) => {
    node.addEventListener(event, listener);
    cleanups.push(() => node.removeEventListener(event, listener));
  };
  const shell = el("div", "wb");
  const toolbar = el("div", "wb-toolbar");
  const tablist = el("div", "wb-tabs");
  tablist.setAttribute("role", "tablist");
  const tabs = [];
  const panels = [];
  const panelBodies = [];
  const kinds = ["receipt", "check", "cancellation"];
  const destinations = [
    "evidence/intent/",
    "evidence/change/",
    "evidence/cancellation/",
  ];
  for (const [index, kind] of kinds.entries()) {
    const tab = el("button", "wb-tab");
    tab.type = "button";
    tab.id = `${id}-tab-${kind}`;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", `${id}-panel-${kind}`);
    const number = el("span", "wb-tab-number", `0${index + 1}`);
    number.setAttribute("aria-hidden", "true");
    tab.append(
      number,
      bind(el("span"), (t) => t.tabs[index]),
    );
    on(tab, "click", () => {
      active = index;
      announce.textContent = "";
      render();
    });
    on(tab, "keydown", (event) => {
      const next =
        event.key === "ArrowRight"
          ? (index + 1) % 3
          : event.key === "ArrowLeft"
            ? (index + 2) % 3
            : event.key === "Home"
              ? 0
              : event.key === "End"
                ? 2
                : null;
      if (next === null) return;
      event.preventDefault();
      active = next;
      announce.textContent = "";
      render();
      tabs[next].focus();
    });
    tabs.push(tab);
    tablist.append(tab);
    const panel = el("div", `wb-panel wb-panel-${kind}`);
    panel.id = `${id}-panel-${kind}`;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tab.id);
    panel.tabIndex = 0;
    const copy = el("div", "wb-copy");
    copy.append(
      bind(el("p", "wb-project"), (t) => t[kind].project),
      bind(el("h3"), (t) => t[kind].title),
      bind(el("p", "wb-body"), (t) => t[kind].body),
    );
    const actionSlot = el("div", "wb-action-slot");
    const link = bind(el("a", "wb-record-link"), (t) => `${t.recorded} ↗`);
    link.href = destinations[index];
    copy.append(actionSlot);
    const footer = el("div", "wb-panel-footer");
    footer.append(
      bind(el("p", "wb-boundary"), (t) => t[kind].boundary),
      link,
    );
    const visual = el("div", "wb-visual");
    panel.append(copy, visual, footer);
    panels.push(panel);
    panelBodies.push({ visual, actionSlot });
  }

  const announce = el("p", "wb-sr");
  announce.setAttribute("role", "status");
  announce.setAttribute("aria-atomic", "true");
  const receiptButton = bind(el("button", "wb-action"), (t) =>
    revealed ? t.receipt.reset : t.receipt.action,
  );
  receiptButton.type = "button";
  receiptButton.setAttribute("aria-controls", `${id}-receipt`);
  on(receiptButton, "click", () => {
    revealed = !revealed;
    render();
    announce.textContent = revealed
      ? words[locale].receipt.announcement
      : words[locale].receipt.before;
  });
  panelBodies[0].actionSlot.append(receiptButton);
  const route = el("div", "wb-route");
  route.append(
    bind(el("span"), (t) => t.receipt.client),
    bind(el("span", "wb-lost"), (t) => `×  ${t.receipt.lost}`),
    bind(el("span"), (t) => t.receipt.journal),
  );
  const receipt = el("div", "wb-receipt");
  receipt.id = `${id}-receipt`;
  const receiptTitle = bind(el("strong", "wb-receipt-title"), (t) =>
    revealed ? t.receipt.confirmed : t.receipt.unknown,
  );
  const receiptDetail = bind(el("p", "wb-receipt-detail"), (t) =>
    revealed ? t.receipt.after : t.receipt.before,
  );
  const ledger = el("dl", "wb-receipt-lines");
  ledger.append(
    bind(el("dt"), (t) => t.receipt.identity),
    bind(el("dd"), (t) => t.receipt.identityValue),
    bind(el("dt"), (t) => t.receipt.result),
    bind(el("dd"), (t) =>
      revealed ? t.receipt.recovered : t.receipt.uncertain,
    ),
  );
  receipt.append(
    bind(el("p", "wb-paper-label"), (t) => t.receipt.paper),
    receiptTitle,
    receiptDetail,
    ledger,
    bind(el("span", "wb-stamp"), (t) => t.receipt.stamp),
  );
  receipt.querySelector(".wb-stamp").setAttribute("aria-hidden", "true");
  panelBodies[0].visual.append(route, receipt);

  const checkButton = bind(el("button", "wb-action"), (t) =>
    independent ? t.check.reset : t.check.action,
  );
  checkButton.type = "button";
  on(checkButton, "click", () => {
    independent = !independent;
    render();
    announce.textContent = independent
      ? words[locale].check.errorDetail
      : words[locale].check.emptyDetail;
  });
  panelBodies[1].actionSlot.append(checkButton);
  const code = el("div", "wb-code-sheet");
  code.id = `${id}-policy`;
  checkButton.setAttribute("aria-controls", code.id);
  code.append(bind(el("p", "wb-paper-label"), (t) => t.check.excerpt));
  const excerpt = el("pre", "wb-code");
  const codeText = el("code");
  codeText.append(
    doc.createTextNode("export function mayRetry(\n  "),
    el("span", "wb-parameter", "method"),
    doc.createTextNode(", "),
    el("span", "wb-parameter", "status"),
    doc.createTextNode("\n) { /* … */ }"),
  );
  excerpt.append(codeText);
  const policy = el("div", "wb-policy");
  policy.append(
    bind(el("span", "wb-policy-label"), (t) =>
      independent ? t.check.independent : t.check.candidate,
    ),
    bind(el("code", "wb-options"), (t) =>
      independent ? t.check.independentOptions : t.check.candidateOptions,
    ),
  );
  const verdict = el("div", "wb-check-verdict");
  verdict.append(
    bind(el("strong"), (t) => (independent ? t.check.errors : t.check.empty)),
    bind(el("p"), (t) =>
      independent ? t.check.errorDetail : t.check.emptyDetail,
    ),
  );
  code.append(excerpt, policy, verdict);
  panelBodies[1].visual.append(
    code,
    bind(el("p", "wb-caption"), (t) => t.check.caption),
  );

  const timeline = el("div", "wb-timeline");
  const lane = (key, className) => {
    const row = el("div", "wb-lane");
    const track = el("div", `wb-track ${className}`);
    track.setAttribute("aria-hidden", "true");
    track.append(el("span", "wb-bar"), el("span", "wb-cursor"));
    row.append(
      bind(el("span", "wb-lane-label"), (t) => t.cancellation[key]),
      track,
    );
    return row;
  };
  const axis = el("div", "wb-axis");
  axis.setAttribute("aria-hidden", "true");
  for (const key of ["starts", "waitEnds", "settles"])
    axis.append(bind(el("span"), (t) => t.cancellation[key]));
  const permit = el("div", "wb-permit");
  permit.append(
    bind(el("span"), (t) => t.cancellation.permit),
    bind(el("strong"), (t) =>
      phase < 3 ? t.cancellation.held : t.cancellation.released,
    ),
  );
  timeline.append(
    axis,
    lane("wait", "wb-wait-track"),
    lane("work", "wb-work-track"),
    permit,
  );
  const rangeLabel = bind(
    el("label", "wb-range-label"),
    (t) => t.cancellation.slider,
  );
  rangeLabel.htmlFor = `${id}-sequence`;
  const range = el("input", "wb-range");
  range.type = "range";
  range.id = `${id}-sequence`;
  range.min = "0";
  range.max = "3";
  range.step = "1";
  range.value = String(phase);
  range.setAttribute("aria-describedby", `${id}-time-note`);
  on(range, "input", () => {
    phase = Math.max(0, Math.min(3, Math.round(Number(range.value))));
    render();
  });
  const phaseText = bind(
    el("p", "wb-phase"),
    (t) => t.cancellation.phases[phase],
  );
  const timeNote = bind(el("p", "wb-caption"), (t) => t.cancellation.caption);
  timeNote.id = `${id}-time-note`;
  panelBodies[2].visual.append(
    timeline,
    rangeLabel,
    range,
    phaseText,
    timeNote,
  );
  // The native slider is the action in this scene, keeping its label beside it.
  panelBodies[2].actionSlot.remove();

  function render() {
    if (destroyed) return;
    shell.lang = locale;
    bindings.forEach((apply) => apply());
    tablist.setAttribute("aria-label", words[locale].tabLabel);
    tabs.forEach((tab, index) => {
      tab.setAttribute("aria-selected", String(index === active));
      tab.tabIndex = index === active ? 0 : -1;
      panels[index].hidden = index !== active;
    });
    receipt.dataset.revealed = String(revealed);
    code.dataset.independent = String(independent);
    timeline.style.setProperty("--wb-progress", `${(phase / 3) * 100}%`);
    timeline.dataset.settled = String(phase === 3);
    // History restoration can change a native control without an input event.
    range.value = String(phase);
    range.setAttribute(
      "aria-valuetext",
      words[locale].cancellation.phases[phase],
    );
  }
  toolbar.append(
    tablist,
    bind(el("p", "wb-disclosure"), (t) => t.disclosure),
  );
  shell.append(toolbar, ...panels, announce);
  root.append(shell);
  render();
  return {
    setLanguage(next) {
      if (destroyed || (next !== "ko" && next !== "en")) return;
      locale = next;
      announce.textContent = "";
      render();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      cleanups.forEach((cleanup) => cleanup());
      shell.remove();
    },
  };
}
