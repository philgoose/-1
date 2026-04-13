'use strict';

/**
 * 샘플 지식베이스: 업무편람·제품(이글프로) 도움말 형태의 청크.
 * 실제 도입 시 동일 스키마로 CMS/파일에서 적재하면 됩니다.
 */
const CHUNKS = [
  {
    id: 'm-001',
    title: '2026 업무편람',
    section: '제3장 문서보존',
    version: '2026-01',
    product: '공통',
    dept: '전체',
    text: '전자문서는 원본 파일과 메타데이터를 함께 보관합니다. 법정 보존기간이 지난 문서는 기록관리 담당자 승인 후 파기하며, 파기 이력은 별도 대장에 5년간 보존합니다. 임의 삭제는 금지됩니다.'
  },
  {
    id: 'm-002',
    title: '2026 업무편람',
    section: '제5장 재택·원격근무',
    version: '2026-01',
    product: '공통',
    dept: '전체',
    text: '재택근무 신청은 주 1회 이상 부서장 전자결재로 진행합니다. 보안등급 A 이상 자료는 재택 환경에서 열람할 수 없으며, VPN 연결 시에도 다운로드가 차단됩니다. 장애·비상 시에는 즉시 사무실 복귀 지시에 따릅니다.'
  },
  {
    id: 'm-003',
    title: '2026 업무편람',
    section: '별표2 개인정보 취급',
    version: '2026-01',
    product: '공통',
    dept: '전체',
    text: '고객 식별정보는 업무 목적 외 열람·출력·전송을 금지합니다. 마스킹 기준은 주민등록번호 뒤 6자리, 카드번호 중 8자리입니다. 위반 시 징계위원회 회부 및 형사 고발이 가능합니다.'
  },
  {
    id: 'e-101',
    title: '이글프로 온라인 도움말',
    section: '시작하기 · 설치',
    version: 'v4.2',
    product: '이글프로',
    dept: '전체',
    text: '이글프로 클라이언트는 Windows 10 이상에서 지원합니다. 설치 시 관리자 권한이 필요하며, 사내 배포 패키지(MSI)를 사용하면 라이선스 키가 자동 등록됩니다. 오프라인 모드는 캐시된 프로젝트만 열람 가능합니다.'
  },
  {
    id: 'e-102',
    title: '이글프로 온라인 도움말',
    section: '데이터 · 백업',
    version: 'v4.2',
    product: '이글프로',
    dept: '전체',
    text: '프로젝트 백업은 파일 메뉴의 "전체 백업"으로 .egbak 파일을 생성합니다. 백업 파일은 암호화되어 있으며 복원 시 동일 버전 이상의 클라이언트가 필요합니다. 네트워크 드라이브에 직접 저장하는 것은 권장하지 않습니다.'
  },
  {
    id: 'e-103',
    title: '이글프로 온라인 도움말',
    section: '연동 · API',
    version: 'v4.2',
    product: '이글프로',
    dept: '개발',
    text: 'REST API 토큰은 관리자 콘솔에서 발급합니다. 호출 한도는 분당 120회이며, 초과 시 429 응답과 Retry-After 헤더가 반환됩니다. 운영 환경과 개발 환경의 엔드포인트는 다르므로 설정 파일을 혼동하지 마십시오.'
  },
  {
    id: 'e-104',
    title: '이글프로 온라인 도움말',
    section: '오류 코드',
    version: 'v4.2',
    product: '이글프로',
    dept: '전체',
    text: '오류 EG-2048은 라이선스 만료를 의미합니다. IT헬프데스크에 기기명과 사용자 ID를 전달하면 재발급 절차를 안내합니다. 임시로는 읽기 전용 모드로 7일간 사용할 수 있습니다.'
  },
  {
    id: 'm-004',
    title: '2026 업무편람',
    section: '제7장 IT 자산',
    version: '2026-01',
    product: '공통',
    dept: '전체',
    text: '업무용 PC 외 USB 저장매체는 보안 정책에 따라 전사 금지 또는 화이트리스트 방식으로 운영됩니다. 예외 신청은 보안담당자 2인 승인이 필요합니다.'
  }
];

const STOP = new Set([
  '은', '는', '이', '가', '을', '를', '에', '의', '와', '과', '도', '로', '으로', '에서', '에게', '한', '하다', '있다', '없다', '되다', '입니다', '습니다', '하는', '하는지', '무엇', '어떻게', '언제', '어디'
]);

function normalize(s) {
  return (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/** 한글·영숫자 토큰 + (선택) 2-gram으로 질의 확장 */
function tokenize(text) {
  const n = normalize(text);
  const out = [];
  const re = /[\uac00-\ud7a3]{2,}|[a-z0-9]{2,}/g;
  let m;
  while ((m = re.exec(n)) !== null) {
    const w = m[0];
    if (w.length >= 2 && !STOP.has(w)) out.push(w);
    if (w.length >= 4 && /[\uac00-\ud7a3]/.test(w)) {
      for (let i = 0; i <= w.length - 2; i++) out.push(w.slice(i, i + 2));
    }
  }
  return out;
}

function buildIndex(chunks) {
  const N = chunks.length;
  const df = new Map();
  const tfList = [];

  for (const c of chunks) {
    const bag = new Map();
    const toks = tokenize(`${c.title} ${c.section} ${c.text} ${c.product}`);
    for (const t of toks) bag.set(t, (bag.get(t) || 0) + 1);
    tfList.push(bag);
    const seen = new Set(bag.keys());
    for (const t of seen) df.set(t, (df.get(t) || 0) + 1);
  }

  return { N, df, tfList };
}

const INDEX = buildIndex(CHUNKS);

function idf(term) {
  const d = INDEX.df.get(term) || 0;
  return Math.log((INDEX.N - d + 0.5) / (d + 0.5) + 1);
}

function scoreChunk(tf, queryTerms) {
  let s = 0;
  for (const t of queryTerms) {
    const f = tf.get(t);
    if (f) s += (1 + Math.log(f)) * idf(t);
  }
  return s;
}

function retrieve(query, opts) {
  const qTerms = tokenize(query);
  if (qTerms.length === 0) return [];

  const { product = '전체', dept = '전체' } = opts || {};
  const scored = CHUNKS.map((c, i) => {
    if (product !== '전체' && c.product !== '전체' && c.product !== product) return null;
    if (dept !== '전체' && c.dept !== '전체' && c.dept !== dept) return null;
    const sc = scoreChunk(INDEX.tfList[i], qTerms);
    return { chunk: c, score: sc, idx: i };
  }).filter(Boolean);

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

function maxScore(list) {
  return list.length ? list[0].score : 0;
}

/** 검색 상위 청크만 바탕으로 근거 중심 요약(규칙 기반, LLM 없음) */
function synthesizeAnswer(query, hits, topN) {
  const top = hits.slice(0, topN).filter(h => h.score > 0);
  if (top.length === 0) {
    return {
      paragraphs: [
        '질문과 직접 연결된 문서 구간을 찾지 못했습니다. 다른 표현으로 물어보거나, 제품·부서 필터를 조정해 보세요.',
        '실제 서비스에서는 임베딩 검색과 LLM 생성 단계가 이어져 답변 품질이 올라갑니다.'
      ],
      bullets: []
    };
  }

  const bullets = top.map((h, rank) => {
    const { chunk } = h;
    const excerpt = excerptAroundTerms(chunk.text, tokenize(query), 90);
    return {
      rank: rank + 1,
      text: excerpt,
      refId: chunk.id
    };
  });

  const intro = `아래는 색인된 매뉴얼·도움말에서 질문과 가장 관련 높은 상위 ${top.length}개 구간을 바탕으로 정리한 안내입니다. 각 항목은 출처 청크와 연결되어 있습니다.`;

  return {
    paragraphs: [intro],
    bullets
  };
}

function excerptAroundTerms(text, terms, maxLen) {
  const t = text.replace(/\s+/g, ' ');
  let pos = -1;
  let bestLen = 0;
  for (const term of terms) {
    if (!term || term.length < 2) continue;
    const i = t.toLowerCase().indexOf(term.toLowerCase());
    if (i >= 0 && term.length >= bestLen) {
      bestLen = term.length;
      pos = i;
    }
  }
  if (pos < 0) {
    const slice = t.slice(0, maxLen);
    return t.length > maxLen ? slice + '…' : slice;
  }
  const half = Math.floor(maxLen / 2);
  let start = Math.max(0, pos - half);
  let end = Math.min(t.length, start + maxLen);
  if (end - start < maxLen) start = Math.max(0, end - maxLen);
  let slice = t.slice(start, end);
  if (start > 0) slice = '…' + slice;
  if (end < t.length) slice = slice + '…';
  return slice;
}

function renderSources(hits, el) {
  if (!hits.length) {
    el.innerHTML =
      '<p class="qa-sources-empty" role="status">질문에서 검색할 단어를 찾지 못했습니다. 구체적인 키워드를 포함해 입력해 주세요.</p>';
    return;
  }
  const ranked = hits.filter(h => h.score > 0).slice(0, 6);
  if (ranked.length === 0) {
    el.innerHTML =
      '<p class="qa-sources-empty" role="status">청크는 있으나 질문과의 유사도 점수가 0입니다. 다른 표현으로 질문해 보세요.</p>';
    return;
  }
  el.innerHTML = ranked
    .map(
      h => `
    <article class="src-card" id="chunk-${safeDomIdPart(h.chunk.id)}" data-chunk-id="${escapeAttr(h.chunk.id)}">
      <header class="src-head">
        <span class="src-score">${h.score.toFixed(2)}</span>
        <span class="src-meta">${escapeHtml(h.chunk.title)} · ${escapeHtml(h.chunk.section)}</span>
      </header>
      <p class="src-body">${escapeHtml(h.chunk.text)}</p>
      <footer class="src-foot">
        <span>버전 ${escapeHtml(h.chunk.version)}</span>
        <span>${escapeHtml(h.chunk.product)}</span>
        <span>${h.chunk.dept === '전체' ? '열람: 전체' : '열람: ' + escapeHtml(h.chunk.dept)}</span>
      </footer>
    </article>`
    )
    .join('');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/'/g, '&#39;');
}

/** id·href(#fragment)용 — HTML 엔티티 없이 안전한 문자만 허용 */
function safeDomIdPart(s) {
  const t = String(s || '');
  if (/^[a-zA-Z0-9_-]+$/.test(t)) return t;
  return t.replace(/[^a-zA-Z0-9_-]+/g, '_');
}

function renderAnswer(ans, el, confidence) {
  const low = confidence === 'low';
  el.innerHTML = `
    <div class="ans-confidence ${low ? 'is-low' : ''}" role="status">
      ${low
        ? '<strong>낮은 확신:</strong> 검색 점수가 낮습니다. 공식 문서를 직접 확인하거나 담당자에게 문의하세요.'
        : '<strong>검색 기준:</strong> 상위 청크와 질의 토큰이 통계적으로 잘 맞습니다. (데모: TF-IDF)'}
    </div>
    ${ans.paragraphs.map(p => `<p class="ans-p">${escapeHtml(p)}</p>`).join('')}
    ${ans.bullets.length
      ? `<ol class="ans-list">
        ${ans.bullets
          .map(
            b => `<li id="ref-${safeDomIdPart(b.refId)}">
              <span class="ans-li-text">${escapeHtml(b.text)}</span>
              <a class="ans-cite" href="#chunk-${safeDomIdPart(b.refId)}">[${escapeHtml(b.refId)}]</a>
            </li>`
          )
          .join('')}
      </ol>`
      : ''}
  `;
}

function setup() {
  if (window.__manualQaBound) return;

  const form = document.getElementById('qaForm');
  const input = document.getElementById('qaInput');
  const product = document.getElementById('filterProduct');
  const dept = document.getElementById('filterDept');
  const answerEl = document.getElementById('qaAnswer');
  const sourcesEl = document.getElementById('qaSources');
  const feedbackEl = document.getElementById('qaFeedback');
  const emptyEl = document.getElementById('qaEmpty');

  if (!form || !input || !product || !dept || !answerEl || !sourcesEl || !feedbackEl || !emptyEl) {
    return;
  }

  window.__manualQaBound = true;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) {
      emptyEl.hidden = false;
      feedbackEl.hidden = true;
      answerEl.innerHTML =
        '<p class="ans-p" role="alert">질문을 입력한 뒤 다시 시도해 주세요.</p>';
      sourcesEl.innerHTML = '';
      return;
    }
    input.value = q;
    const hits = retrieve(q, { product: product.value, dept: dept.value });
    const top = hits.slice(0, 8);
    const ms = maxScore(top);
    const confidence = ms < 0.35 ? 'low' : 'ok';

    emptyEl.hidden = true;
    const ans = synthesizeAnswer(q, top, 4);
    renderAnswer(ans, answerEl, confidence);
    renderSources(top, sourcesEl);

    feedbackEl.hidden = false;
    const note = feedbackEl.querySelector('.fb-note');
    if (note) note.textContent = '';
  });

  const thumbUp = document.getElementById('qaThumbUp');
  const thumbDown = document.getElementById('qaThumbDown');
  if (thumbUp) thumbUp.addEventListener('click', () => saveFeedback('up'));
  if (thumbDown) thumbDown.addEventListener('click', () => saveFeedback('down'));

  document.addEventListener('click', e => {
    const a = e.target.closest('a.ans-cite');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.charAt(0) !== '#') return;
    const id = href.slice(1);
    const card = document.getElementById(id);
    if (card) {
      e.preventDefault();
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      card.classList.add('is-flash');
      setTimeout(() => card.classList.remove('is-flash'), 1200);
    }
  });

  function saveFeedback(dir) {
    try {
      const raw = localStorage.getItem('manualQaFb') || '[]';
      const arr = JSON.parse(raw);
      arr.push({ dir, at: new Date().toISOString(), q: input.value.slice(0, 200) });
      localStorage.setItem('manualQaFb', JSON.stringify(arr.slice(-50)));
    } catch {
      /* ignore */
    }
    const note = feedbackEl.querySelector('.fb-note');
    if (note) {
      note.textContent =
        dir === 'up' ? '피드백 저장됨(로컬). 감사합니다.' : '개선 요청이 기록되었습니다(로컬).';
    }
  }

  document.querySelectorAll('.qa-sample').forEach(btn => {
    btn.addEventListener('click', () => {
      input.value = btn.getAttribute('data-q') || '';
      if (typeof form.requestSubmit === 'function') {
        form.requestSubmit();
      } else {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup);
} else {
  setup();
}
