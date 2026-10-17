import assert from 'node:assert/strict';

// Display integration for fixed legacy renderers. Their recorded data stays untouched.
// Inline the helper because the original reports use both classic and module scripts.
function integration(variable, render, capture = '') {
  return `
// Portfolio display language: explicit URL, then shared preference, then browser default.
function portfolioEvidenceLanguage() {
  const linked = new URLSearchParams(location.search).get('lang');
  if (linked === 'ko' || linked === 'en') return linked;
  try {
    const saved = localStorage.getItem('minjae.portfolio.language');
    if (saved === 'ko' || saved === 'en') return saved;
  } catch { /* Storage is optional. */ }
  return ${variable};
}
function portfolioEvidenceLinks() {
  for (const link of document.querySelectorAll('a[href]:not([download])')) {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) continue;
    const url = new URL(href, location.href);
    if (url.origin !== location.origin || !(url.pathname.endsWith('/') || url.pathname.endsWith('.html'))) continue;
    url.searchParams.set('lang', ${variable});
    link.setAttribute('href', url.pathname + url.search + url.hash);
  }
}
function portfolioEvidenceSelect() {
  const url = new URL(location.href);
  url.searchParams.set('lang', ${variable});
  history.replaceState(history.state, '', url);
  portfolioEvidenceLinks();
}
function portfolioEvidenceRestore() {
  const next = portfolioEvidenceLanguage();
  if (next === ${variable}) return;
${capture ? '  ' + capture + '\n' : ''}  ${variable} = next;
  ${render}();
  portfolioEvidenceLinks();
}
window.addEventListener('pageshow', portfolioEvidenceRestore);
window.addEventListener('popstate', portfolioEvidenceRestore);
${variable} = portfolioEvidenceLanguage();
// End portfolio display language integration.
`;
}

function replaceOnce(text, before, after, label) {
  assert.equal(text.split(before).length, 2, `${label}: frozen language scope changed`);
  return text.replace(before, after);
}

export function adaptEvidenceLanguage(text, id) {
  if (id === 'intent') {
    text = replaceOnce(
      text,
      '      apply();\n    }),',
      '      apply();\n      portfolioEvidenceSelect();\n    }),',
      id,
    );
    return replaceOnce(
      text,
      '  apply();\n})();',
      integration('lang', 'apply') + '  apply();\n  portfolioEvidenceLinks();\n})();',
      id,
    );
  }
  if (id === 'change') {
    text = replaceOnce(
      text,
      '    render();\n  });\n\nfunction render() {',
      '    render();\n    portfolioEvidenceSelect();\n  });\n\nfunction render() {',
      id,
    );
    return replaceOnce(
      text,
      '\nrender();\ntry {',
      integration('language', 'render') + 'render();\nportfolioEvidenceLinks();\ntry {',
      id,
    );
  }
  if (id === 'cancellation') {
    text = replaceOnce(
      text,
      'catch{}translate();});',
      'catch{}translate();portfolioEvidenceSelect();});',
      id,
    );
    return replaceOnce(
      text,
      '\ntranslate();\n',
      integration('lang', 'translate') + 'translate();\nportfolioEvidenceLinks();\n',
      id,
    );
  }
  assert.equal(id, 'history', 'Unknown frozen display');
  text = replaceOnce(
    text,
    "      } catch {}\n      safeRender();\n    }),\n  );\n  document.querySelectorAll('[data-view]')",
    "      } catch {}\n      safeRender();\n      portfolioEvidenceSelect();\n    }),\n  );\n  document.querySelectorAll('[data-view]')",
    id,
  );
  const oldRestore = `  window.addEventListener('pageshow', () => {
    try {
      const saved = localStorage.getItem(localeKey);
      if ((saved === 'ko' || saved === 'en') && saved !== lang) {
        capture();
        lang = saved;
        safeRender();
      }
    } catch {}
  });
  safeRender();
})();`;
  return replaceOnce(
    text,
    oldRestore,
    integration('lang', 'safeRender', 'capture();') +
      '  safeRender();\n  portfolioEvidenceLinks();\n})();',
    id,
  );
}
