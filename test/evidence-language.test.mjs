import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const displays = {
  intent: ['report.js', 'lang', 'apply'],
  change: ['app.js', 'language', 'render'],
  cancellation: ['debt.js', 'lang', 'translate'],
  history: ['report.js', 'lang', 'safeRender'],
};
const marker = '// Portfolio display language: explicit URL, then shared preference, then browser default.';
const end = '// End portfolio display language integration.';

function environment(href, saved = 'ko') {
  let storage = saved;
  let unavailable = false;
  const listeners = new Map();
  const context = {
    URL,
    URLSearchParams,
    location: new URL(href),
    navigator: { language: 'ko-KR' },
    localStorage: {
      getItem() {
        if (unavailable) throw new Error('Storage denied');
        return storage;
      },
      setItem(_key, value) {
        if (unavailable) throw new Error('Storage denied');
        storage = value;
      },
    },
    history: {
      state: { retained: 7 },
      replaceState(state, _title, url) {
        this.state = state;
        context.location = new URL(url);
      },
    },
    window: {
      addEventListener(name, listener) {
        const list = listeners.get(name) ?? [];
        list.push(listener);
        listeners.set(name, list);
      },
    },
    document: {
      documentElement: { lang: 'ko' },
      querySelectorAll(selector) {
        return selector === '[data-set-lang]' ? buttons : links;
      },
    },
  };
  const links = [
    '../../?view=work#intent',
    '../../notes/verified-change/index.html?details=raw#checks',
    'report.json',
    'recording.json',
    '#local',
    'https://github.com/minjae-lee-kr/',
  ].map((href) => ({
    href,
    getAttribute() { return this.href; },
    setAttribute(_name, value) { this.href = value; },
  }));
  const buttons = ['ko', 'en'].map((language) => ({
    dataset: { setLang: language },
    setAttribute() {},
    addEventListener(_name, listener) { this.click = listener; },
  }));
  return {
    context, links, buttons,
    saved(value) { storage = value; },
    denyStorage() { unavailable = true; },
    dispatch(name) { for (const listener of listeners.get(name) ?? []) listener({ persisted: true }); },
  };
}

for (const [id, [file, variable, render]] of Object.entries(displays)) {
  test(`${id}: bundled URL language wins and unchanged restoration keeps the existing view`, async () => {
    const text = await readFile(new URL(`../docs/evidence/${id}/${file}`, import.meta.url), 'utf8');
    assert.equal(text.split(marker).length, 2);
    assert.equal(text.split(end).length, 2);
    const integration = text.slice(text.indexOf(marker), text.indexOf(end) + end.length);
    const env = environment(`https://minjae-lee-kr.github.io/evidence/${id}/?lang=en&case=second#raw`);
    const retained = { selected: 'second', open: true, focus: {} };
    env.context.view = retained;
    env.context.renders = 0;
    env.context.captures = 0;
    runInNewContext(`
      let ${variable} = 'ko';
      function ${render}() { renders++; }
      function capture() { captures++; }
      ${integration}
      portfolioEvidenceLinks();
      globalThis.readLanguage = () => ${variable};
      globalThis.chooseLanguage = (value) => { ${variable} = value; portfolioEvidenceSelect(); };
    `, env.context);
    assert.equal(env.context.readLanguage(), 'en');
    env.dispatch('pageshow');
    env.dispatch('popstate');
    assert.equal(env.context.renders, 0, 'Restoring the same language must not rebuild focused content');
    assert.equal(env.context.view, retained);
    assert.equal(env.context.captures, 0);
    assert.equal(env.links[0].href, '/?view=work&lang=en#intent');
    assert.equal(env.links[1].href, '/notes/verified-change/index.html?details=raw&lang=en#checks');
    assert.deepEqual(env.links.slice(2).map((link) => link.href), [
      'report.json', 'recording.json', '#local', 'https://github.com/minjae-lee-kr/',
    ]);

    env.denyStorage();
    const oldHistoryState = env.context.history.state;
    env.context.chooseLanguage('ko');
    assert.equal(env.context.location.search, '?lang=ko&case=second');
    assert.equal(env.context.location.hash, '#raw');
    assert.equal(env.context.history.state, oldHistoryState);
    env.dispatch('pageshow');
    assert.equal(env.context.renders, 0);

    // A history entry with an explicit different language must change only the locale.
    env.context.location = new URL(`https://minjae-lee-kr.github.io/evidence/${id}/?lang=en#raw`);
    env.dispatch('popstate');
    assert.equal(env.context.readLanguage(), 'en');
    assert.equal(env.context.renders, 1);
    assert.equal(env.context.captures, id === 'history' ? 1 : 0);
    assert.equal(env.context.view, retained);
  });
}

test('the actual Intent report buttons update URL even without storage, and bare URLs follow saved language', async () => {
  const text = await readFile(new URL('../docs/evidence/intent/report.js', import.meta.url), 'utf8');
  const env = environment('https://minjae-lee-kr.github.io/evidence/intent/?lang=invalid&case=one#proof');
  runInNewContext(text, env.context);
  assert.equal(env.context.document.documentElement.lang, 'ko');
  env.saved('en');
  env.dispatch('pageshow');
  assert.equal(env.context.document.documentElement.lang, 'en');
  env.denyStorage();
  env.buttons[0].click();
  assert.equal(env.context.document.documentElement.lang, 'ko');
  assert.equal(env.context.location.search, '?lang=ko&case=one');
  assert.equal(env.context.location.hash, '#proof');
  env.buttons[1].click();
  assert.equal(env.context.document.documentElement.lang, 'en');
  assert.equal(env.context.location.search, '?lang=en&case=one');
});
