import assert from 'node:assert/strict';

// Adapt the frozen export's presentation, never its report or recorded data.
// Exact anchors deliberately fail if the upstream display is replaced.
function replaceOnce(text, before, after) {
  assert.equal(text.split(before).length, 2, 'Cancellation display anchor changed: ' + before);
  return text.replace(before, after);
}

export function adaptCancellationDisplay(file, text) {
  if (file === 'index.html') {
    return replaceOnce(
      text,
      '<div id="chart"></div>',
      '<p id="chart-hint" class="muted" data-i18n="chartHint"></p>' +
        '<div id="chart" tabindex="0" role="region" aria-labelledby="trace-title" aria-describedby="chart-hint"></div>',
    );
  }
  if (file === 'debt.css') {
    // Keep both the legend key and its series readable against the white plot.
    for (const [before, after] of [['#7aa5ff', '#4478e4'], ['#dd9a45', '#a86a15'], ['#b7c2d3', '#7b879b']]) {
      assert.equal(text.split(before).length, 3, 'Cancellation color anchors changed: ' + before);
      text = text.replaceAll(before, after);
    }
    return text + '\n/* Keep the frozen 880-unit plot readable on narrow screens. */\n' +
      '#chart{overflow:auto}#chart svg{min-width:880px}' +
      '#chart:focus-visible{outline:3px solid #4478e4;outline-offset:4px}\n';
  }
  if (file !== 'debt.js') return text;
  text = replaceOnce(
    text,
    "scrollHint:'On narrow screens, focus the table and scroll horizontally to see every column.',",
    "scrollHint:'On narrow screens, focus the table and scroll horizontally to see every column.',\n" +
      "    chartHint:'On narrow screens, scroll the chart horizontally. With a keyboard, focus the chart and use the left and right arrow keys.',",
  );
  text = replaceOnce(
    text,
    "scrollHint:'좁은 화면에서는 표에 초점을 맞춘 뒤 가로로 스크롤하면 모든 열을 볼 수 있습니다.',",
    "scrollHint:'좁은 화면에서는 표에 초점을 맞춘 뒤 가로로 스크롤하면 모든 열을 볼 수 있습니다.',\n" +
      "    chartHint:'좁은 화면에서는 그래프를 좌우로 스크롤하세요. 키보드로는 그래프에 초점을 맞춘 뒤 좌우 방향키로 이동할 수 있습니다.',",
  );
  // These Korean words occur only in authored UI strings, not evidence keys.
  text = text
    .replaceAll('허가는', '슬롯은')
    .replaceAll('허가가', '슬롯이')
    .replaceAll('허가를', '슬롯을')
    .replaceAll('허가', '슬롯');
  text = replaceOnce(text, '동시 실행 슬롯은 2개입니다.', '동시 실행 슬롯(permit)은 2개입니다.');
  text = replaceOnce(text, "permits:'보유 중인 슬롯'", "permits:'점유한 실행 슬롯'");
  text = replaceOnce(
    text,
    "lesson:'실행 슬롯은 기다리는 사람이 아니라 작업에 속합니다.'",
    "lesson:'기다림이 끝나도 작업은 계속될 수 있습니다.'",
  );
  text = replaceOnce(
    text,
    '실제 작업이 끝날 때까지 실행 슬롯을 유지해야 합니다.',
    '실행 슬롯은 실제 작업이 끝난 뒤에 반환해야 합니다.',
  );
  return text;
}
