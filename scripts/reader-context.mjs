// Editorial context around historical captures. Never changes observations or verdicts.
import assert from 'node:assert/strict';

const contexts = {
  intent: {
    ko: ['예약 버튼을 눌렀는데 응답이 끊겼습니다. 서버에는 이미 예약이 저장됐을 수 있습니다. 여기서 새 요청을 만들면 어떤 일이 생길까요?', '실제 HTTP와 SQLite를 쓰는 개인 실험입니다. 같은 예약 시도를 식별하는 키를 유지한 경우와 새 키로 보낸 경우를 비교합니다. 아래의 예약 건수부터 보고, 각 사례를 펼치면 요청·응답을 확인할 수 있습니다.', '복구 UI와 설계 판단', 'https://github.com/minjae-lee-kr/intent-recovery-lab/blob/main/docs/design.ko.md'],
    en: ['A reservation response disappears. The server may already have saved the reservation. What happens if the retry creates a new request?', 'This independent HTTP/SQLite experiment compares keeping the key that identifies one reservation attempt with sending a fresh key. Start with the reservation counts below; expand a case to inspect its requests and responses.', 'Recovery UI and design decisions', 'https://github.com/minjae-lee-kr/intent-recovery-lab/blob/main/docs/design.md'],
  },
  change: {
    ko: ['자동화가 수정한 코드는 검사를 통과했습니다. 그런데 그 수정에 검사 설정까지 들어 있다면, 무엇을 믿고 적용해야 할까요?', 'Git과 TypeScript로 만든 개인 실험입니다. 고정된 검사 기준과 정확히 그 검사를 받은 커밋을 연결합니다. 아래에서 변경 후 재검증 누락, 빈 검사, 오래된 승인, 동시 갱신, 응답 유실을 차례로 볼 수 있습니다. 후보와 승인은 스크립트로 만들며 LLM은 호출하지 않습니다.', '문제와 설계 선택부터 읽기', '../../notes/verified-change/'],
    en: ['An automated patch passes its checks. But the patch also edits the checking rules. What evidence should authorize the change?', 'This independent Git/TypeScript experiment binds a fixed verification policy to the exact checked commit. Explore workspace drift, empty checks, stale approval, competing updates and lost acknowledgements below. Candidates and approvals are scripted; no LLM is called.', 'Read the problem and design choices', '../../notes/verified-change/'],
  },
  cancellation: {
    ko: ['상품 조회가 타임아웃돼 다시 요청했습니다. 첫 요청의 재고 작업이 아직 실행 중이라면, 재시도로 작업이 더 늘어날 수 있습니다.', 'Apollo Federation은 여러 GraphQL 서버를 하나의 API로 연결합니다. 이 개인 실험은 실제 HTTP 호출에 가상 재고 작업을 연결합니다. 실행 슬롯(permit)은 동시에 허용하는 작업의 자리입니다. 아래에서 슬롯 수와 실제 작업 수가 언제 달라지는지 비교해 보세요.', '취소와 실행 제한의 설계 선택', '../../notes/cancellation-debt/'],
    en: ['A product lookup times out, so the caller retries. If the first inventory job is still running, the retry can add another job.', 'Apollo Federation connects several GraphQL servers behind one API. This independent experiment connects real HTTP calls to synthetic inventory work. A permit is one place in the concurrent-work limit. Compare when the permit count diverges from the actual job count below.', 'Cancellation and capacity design choices', '../../notes/cancellation-debt/'],
  },
  history: {
    ko: ['예약 완료 응답을 받은 뒤 조회했는데 “없음”이라고 나옵니다. 마지막 장부에 예약이 남아 있다는 사실만으로 이 응답을 설명할 수 있을까요?', '이 개인 실험은 두 서버 프로세스와 SQLite에서 수집한 요청·응답 순서를 검사합니다. “장부”는 저장된 예약 상태입니다. 대조군은 실제 관측 중 조회 응답 한 건만 의도적으로 바꾼 기록이며, 실제 서버 장애를 재현한 결과가 아닙니다.', '관측 순서를 검사하는 방법', 'https://github.com/minjae-lee-kr/intent-recovery-lab/blob/main/docs/history-check.ko.md'],
    en: ['A reservation is confirmed, but a later lookup says it is absent. Can a correct final ledger explain what the caller saw?', 'This independent experiment checks request/response histories captured from two server processes and SQLite. The ledger is the stored reservation state. The control deliberately changes one recorded lookup response; it is not a reproduced server fault.', 'How the history check works', 'https://github.com/minjae-lee-kr/intent-recovery-lab/blob/main/docs/history-check.md'],
  },
};

const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
export function withReaderContext(html, id) {
  assert.ok(contexts[id], 'Unknown report context');
  const start = html.indexOf('<section class="hero">');
  assert.ok(start >= 0 && !html.includes('class="reader-context"'), 'Unexpected report layout');
  const end = html.indexOf('</section>', start) + '</section>'.length;
  assert.ok(end > start, 'Missing hero boundary');
  const content = ['ko', 'en'].map(lang => {
    const [scenario, explanation, label, href] = contexts[id][lang];
    return `<div class="reader-${lang}" lang="${lang}"><p class="reader-label">${lang === 'ko' ? '이 기록을 읽기 전에' : 'Before reading the capture'}</p><p><strong>${escape(scenario)}</strong></p><p>${escape(explanation)}</p><a href="${escape(href)}">${escape(label)} →</a></div>`;
  }).join('');
  return html.slice(0, end) + `\n<section class="reader-context" aria-label="Context / 실험 안내">${content}</section>\n` + html.slice(end);
}

export const readerContextCss = `
.reader-context{margin:0 0 32px;padding:22px 26px;background:#f0f5fc;border:1px solid #cfdaea;border-radius:14px;color:#263b54;font:15px/1.8 system-ui,sans-serif}
.reader-context p{max-width:80ch;margin:0 0 10px;line-height:1.8}.reader-context strong{font-weight:600}.reader-context .reader-label{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#435a78}.reader-context a{color:#244c91;font-size:13px;font-weight:650;text-underline-offset:4px}.reader-context a:focus-visible{outline:2px solid #2456ad;outline-offset:5px}
html[lang=ko] .reader-en,html:not([lang=ko]) .reader-ko{display:none}
@media(max-width:600px){.reader-context{padding:18px;font-size:14px}}
`;
