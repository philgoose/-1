'use strict';

/**
 * 샘플: 원장 중심 모놀리식 + 다계열 연동에서 흔한 “영향도 설명” 청크.
 * 실제 도입 시 동일 스키마로 아키텍처 저장소·Confluence·장애 RCA를 적재합니다.
 */
const IMPACT_CHUNKS = [
  {
    id: 'i-001',
    title: '원장-채널 연동 개요',
    section: '계좌 조회 흐름',
    version: '2026-Q1',
    system: '원장',
    riskTags: ['API', '스키마'],
    related: ['채널', '공통'],
    text: '채널 앱의 계좌 목록은 원장 READ API를 호출합니다. 응답 DTO에 계좌번호 마스킹이 포함되며, 마스킹 규칙은 원장 공통 라이브러리와 동일 소스를 사용합니다. 규칙 변경 시 채널 iOS·Android·웹 세 클라이언트의 회귀 테스트가 필요합니다.'
  },
  {
    id: 'i-002',
    title: '원장 스키마 변경 가이드',
    section: '고객·계좌 도메인',
    version: '2026-Q1',
    system: '원장',
    riskTags: ['스키마', '배치'],
    related: ['배치', '통지'],
    text: 'CUST_AGREE_LOG 테이블에 컬럼 추가 시 야간 배치의 증분 추출 SQL이 컬럼 목록을 하드코딩한 경우 실패할 수 있습니다. 통지 서비스는 동의 변경 이벤트를 Kafka 토픽 agree.v1으로 구독하므로, 이벤트 페이로드 스키마 호환성(하위 호환 필드 추가)을 검증해야 합니다.'
  },
  {
    id: 'i-003',
    title: '결제 게이트웨이 SLO',
    section: '타임아웃·재시도',
    version: '2025-12',
    system: '결제',
    riskTags: ['API', '배치'],
    related: ['원장', '채널'],
    text: '결제 취소 API 클라이언트 타임아웃은 기본 8초입니다. 원장 쪽 부분 취소 처리는 행 단위 락을 사용하므로, 타임아웃만 늘리면 채널은 응답을 더 기다리지만 원장 락 경합은 오히려 길어질 수 있습니다. 운영 정책은 “취소 요청 idempotency-key + 비동기 폴링” 병행을 권장합니다.'
  },
  {
    id: 'i-004',
    title: '배치 정산 파이프라인',
    section: 'D-1 마감',
    version: '2026-Q1',
    system: '배치',
    riskTags: ['배치', '스키마'],
    related: ['원장', '결제'],
    text: '일일 정산 배치는 원장 거래원장과 결제사 승인 파일을 조인합니다. 원장 금액 필드 소수점 자리수 변경 시 정산 단위 불일치로 마감 지연이 발생한 사례가 있습니다. 변경 전 샌드박스에서 소액 구간 전수 비교를 필수로 합니다.'
  },
  {
    id: 'i-005',
    title: '통지·알림',
    section: '템플릿 변수',
    version: '2026-Q1',
    system: '통지',
    riskTags: ['API'],
    related: ['원장', '채널'],
    text: 'SMS/LMS 템플릿은 #{maskedAccount} 변수를 사용합니다. 마스킹 규칙이 바뀌면 통지 미리보기와 실발송 결과가 달라질 수 있으므로, 템플릿 QA와 발송 샘플링을 동시에 수행합니다.'
  },
  {
    id: 'i-006',
    title: '공통 인증·API 게이트웨이',
    section: '버전 정책',
    version: '2026-Q1',
    system: '공통',
    riskTags: ['API'],
    related: ['채널', '결제', '원장'],
    text: '외부 노출 API는 /v2 네임스페이스 하에서만 필드 추가를 허용합니다. 하위 호환을 깨는 변경은 신규 버전과 공존 기간(최소 90일)이 필요합니다. 게이트웨이 라우팅 규칙이 경로 기반이므로 채널 앱의 base URL 설정도 점검 대상입니다.'
  },
  {
    id: 'i-007',
    title: '채널 앱 릴리즈 체크리스트',
    section: '원장 의존 기능',
    version: '2026-Q1',
    system: '채널',
    riskTags: ['API'],
    related: ['원장', '공통'],
    text: '송금 화면은 원장 잔액 API와 환율 API를 연달아 호출합니다. 한쪽만 지연되면 UX 상 “잔액 불일치” 오류로 보일 수 있어, 성능 테스트는 체인 단위로 설계합니다.'
  },
  {
    id: 'i-008',
    title: '장애 사례 라이브러리',
    section: 'RCA-2024-18',
    version: '아카이브',
    system: '원장',
    riskTags: ['스키마', '배치'],
    related: ['배치'],
    text: '모놀리식 단일 DB에서 인덱스 재구성 중 배치가 동일 테이블에 장시간 락을 유지하여 서비스 전반이 지연된 사례입니다. 영향도 분석 시 “배치 윈도우와 온라인 트래픽 겹침”을 항상 체크리스트에 포함합니다.'
  },
  {
    id: 'i-009',
    title: '대외 연계 규격',
    section: '금융공동망',
    version: '2025-09',
    system: '결제',
    riskTags: ['API'],
    related: ['원장'],
    text: '입금 이체 결과 코드 매핑은 원장 상태코드와 1:1이 아닌 경우가 있습니다. 매핑 테이블 변경은 대외 규격 문서 개정과 동시에 배포되어야 하며, 롤백 시 양쪽 동시 롤백이 필요합니다.'
  },
  {
    id: 'i-010',
    title: '데이터 마스킹 정책',
    section: '준법 감사',
    version: '2026-Q1',
    system: '원장',
    riskTags: ['API', '스키마'],
    related: ['채널', '통지', '배치'],
    text: '계좌번호 마스킹은 법무·준법 합의된 표준입니다. 완화는 로그 마스킹, 통지 문구, 채널 표시, 배치 출력물 전반에 파급됩니다. 승인 없이 일부 계열만 규칙을 바꾸면 감사 추적 불일치가 발생합니다.'
  }
];

const STOP = new Set([
  '은', '는', '이', '가', '을', '를', '에', '의', '와', '과', '도', '로', '으로', '에서', '에게', '한', '하다', '있다', '없다', '되다', '입니다', '습니다', '하는', '하는지', '무엇', '어떻게', '언제', '어디', '하나요', '되나요'
]);

function normalize(s) {
  return (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

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
    const toks = tokenize(
      `${c.title} ${c.section} ${c.text} ${c.system} ${(c.related || []).join(' ')} ${(c.riskTags || []).join(' ')}`
    );
    for (const t of toks) bag.set(t, (bag.get(t) || 0) + 1);
    tfList.push(bag);
    const seen = new Set(bag.keys());
    for (const t of seen) df.set(t, (df.get(t) || 0) + 1);
  }

  return { N, df, tfList };
}

const IMPACT_INDEX = buildIndex(IMPACT_CHUNKS);

function idf(term) {
  const d = IMPACT_INDEX.df.get(term) || 0;
  return Math.log((IMPACT_INDEX.N - d + 0.5) / (d + 0.5) + 1);
}

function scoreChunk(tf, queryTerms) {
  let s = 0;
  for (const t of queryTerms) {
    const f = tf.get(t);
    if (f) s += (1 + Math.log(f)) * idf(t);
  }
  return s;
}

function retrieveImpact(query, opts) {
  const qTerms = tokenize(query);
  if (qTerms.length === 0) return [];

  const { system = '전체', risk = '전체' } = opts || {};
  const scored = IMPACT_CHUNKS.map((c, i) => {
    if (system !== '전체' && c.system !== system) {
      const touches = c.system === system || (c.related || []).includes(system);
      if (!touches) return null;
    }
    if (risk !== '전체') {
      const tags = c.riskTags || [];
      if (!tags.includes(risk)) return null;
    }
    const sc = scoreChunk(IMPACT_INDEX.tfList[i], qTerms);
    return { chunk: c, score: sc, idx: i };
  }).filter(Boolean);

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

function maxScore(list) {
  return list.length ? list[0].score : 0;
}

function synthesizeImpact(query, hits, topN) {
  const top = hits.slice(0, topN).filter(h => h.score > 0);
  if (top.length === 0) {
    return {
      paragraphs: [
        '질문과 직접 맞닿은 영향도 설명을 찾지 못했습니다. 변경 대상 시스템 이름, 테이블, API 이름을 구체적으로 넣거나 필터를 조정해 보세요.',
        '실서비스에서는 코드 의존성·배포 토폴로지·최근 장애 태그를 추가 색인으로 붙이면 같은 UI로 확장됩니다.'
      ],
      bullets: [],
      systems: []
    };
  }

  const systemsSet = new Set();
  for (const h of top) {
    systemsSet.add(h.chunk.system);
    (h.chunk.related || []).forEach(r => systemsSet.add(r));
  }
  const systems = [...systemsSet];

  const bullets = top.map((h, rank) => {
    const { chunk } = h;
    const excerpt = excerptAroundTerms(chunk.text, tokenize(query), 100);
    return { rank: rank + 1, text: excerpt, refId: chunk.id, chunk };
  });

  const intro = `아래는 “${query.slice(0, 80)}${query.length > 80 ? '…' : ''}”와 통계적으로 연관도가 높은 영향도 설명 ${top.length}건을 바탕으로 한 탐색 결과입니다. 체크리스트 작성 시 출처 청크와 함께 아키텍처 담당자에게 검증을 요청하세요.`;

  return { paragraphs: [intro], bullets, systems };
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

function safeDomIdPart(s) {
  const t = String(s || '');
  if (/^[a-zA-Z0-9_-]+$/.test(t)) return t;
  return t.replace(/[^a-zA-Z0-9_-]+/g, '_');
}

function renderImpactSources(hits, el) {
  if (!hits.length) {
    el.innerHTML =
      '<p class="qa-sources-empty" role="status">질문에서 검색할 단어를 찾지 못했습니다.</p>';
    return;
  }
  const ranked = hits.filter(h => h.score > 0).slice(0, 8);
  if (ranked.length === 0) {
    el.innerHTML =
      '<p class="qa-sources-empty" role="status">필터 조건에 맞는 청크는 있으나 질문과의 유사도가 0입니다.</p>';
    return;
  }
  el.innerHTML = ranked
    .map(h => {
      const c = h.chunk;
      const tags = (c.riskTags || []).map(t => `<span class="imp-tag">${escapeHtml(t)}</span>`).join('');
      return `
    <article class="src-card imp-src" id="ichunk-${safeDomIdPart(c.id)}" data-chunk-id="${escapeAttr(c.id)}">
      <header class="src-head">
        <span class="src-score">${h.score.toFixed(2)}</span>
        <span class="src-meta">${escapeHtml(c.title)} · ${escapeHtml(c.section)}</span>
      </header>
      <p class="imp-sysline"><span class="imp-pill imp-pill-main">${escapeHtml(c.system)}</span>
        ${(c.related || []).map(r => `<span class="imp-pill">${escapeHtml(r)}</span>`).join('')}
      </p>
      <p class="src-body">${escapeHtml(c.text)}</p>
      <footer class="src-foot">
        <span>버전 ${escapeHtml(c.version)}</span>
        <span class="imp-tags">${tags}</span>
      </footer>
    </article>`;
    })
    .join('');
}

function renderImpactAnswer(ans, el, confidence) {
  const low = confidence === 'low';
  const sysLine =
    ans.systems && ans.systems.length
      ? `<p class="imp-sys-overview"><strong>교차 후보 시스템:</strong> ${ans.systems.map(s => `<span class="imp-pill">${escapeHtml(s)}</span>`).join(' ')}</p>`
      : '';

  el.innerHTML = `
    <div class="ans-confidence ${low ? 'is-low' : ''}" role="status">
      ${
        low
          ? '<strong>낮은 확신:</strong> 색인 문서와 질문의 통계적 연결이 약합니다. 담당 계열 아키텍트 리뷰를 권장합니다.'
          : '<strong>탐색 기준:</strong> 상위 청크와 질의 토큰이 잘 맞습니다. (데모: TF-IDF)'
      }
    </div>
    ${ans.paragraphs.map(p => `<p class="ans-p">${escapeHtml(p)}</p>`).join('')}
    ${sysLine}
    ${
      ans.bullets.length
        ? `<ol class="ans-list imp-ans-list">
        ${ans.bullets
          .map(
            b => `<li id="iref-${safeDomIdPart(b.refId)}">
              <span class="ans-li-text">${escapeHtml(b.text)}</span>
              <a class="ans-cite" href="#ichunk-${safeDomIdPart(b.refId)}">[${escapeHtml(b.refId)}]</a>
            </li>`
          )
          .join('')}
      </ol>`
        : ''
    }
  `;
}

function renderGraph(systems, el) {
  if (!systems || systems.length < 2) {
    el.hidden = true;
    el.innerHTML = '';
    return;
  }
  el.hidden = false;
  const nodes = systems.slice(0, 8);
  el.innerHTML = `
    <h3 class="imp-graph-title">관련 시스템 스케치 (데모)</h3>
    <p class="imp-graph-hint">실제 도입 시에는 서비스 메시·저장소 그래프를 자동 생성해 동일 영역에 표시합니다.</p>
    <div class="imp-graph-row" role="img" aria-label="시스템 간 관련 후보">
      ${nodes
        .map(
          (name, i) =>
            `${i > 0 ? '<span class="imp-graph-arrow" aria-hidden="true">↔</span>' : ''}
         <span class="imp-graph-node">${escapeHtml(name)}</span>`
        )
        .join('')}
    </div>
  `;
}

function setupImpact() {
  if (window.__impactQaBound) return;

  const form = document.getElementById('impForm');
  const input = document.getElementById('impInput');
  const sysSel = document.getElementById('impSystem');
  const riskSel = document.getElementById('impRisk');
  const answerEl = document.getElementById('impAnswer');
  const sourcesEl = document.getElementById('impSources');
  const feedbackEl = document.getElementById('impFeedback');
  const emptyEl = document.getElementById('impEmpty');
  const graphEl = document.getElementById('impGraph');

  if (!form || !input || !sysSel || !riskSel || !answerEl || !sourcesEl || !feedbackEl || !emptyEl || !graphEl) {
    return;
  }

  window.__impactQaBound = true;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) {
      emptyEl.hidden = false;
      graphEl.hidden = true;
      graphEl.innerHTML = '';
      feedbackEl.hidden = true;
      answerEl.innerHTML = '<p class="ans-p" role="alert">질문을 입력한 뒤 다시 시도해 주세요.</p>';
      sourcesEl.innerHTML = '';
      return;
    }
    input.value = q;
    const hits = retrieveImpact(q, { system: sysSel.value, risk: riskSel.value });
    const top = hits.slice(0, 10);
    const ms = maxScore(top);
    const confidence = ms < 0.32 ? 'low' : 'ok';

    emptyEl.hidden = true;
    const ans = synthesizeImpact(q, top, 5);
    renderImpactAnswer(ans, answerEl, confidence);
    renderImpactSources(top, sourcesEl);
    renderGraph(ans.systems, graphEl);

    feedbackEl.hidden = false;
    const note = feedbackEl.querySelector('.imp-fb-note');
    if (note) note.textContent = '';
  });

  const thumbUp = document.getElementById('impThumbUp');
  const thumbDown = document.getElementById('impThumbDown');
  if (thumbUp) thumbUp.addEventListener('click', () => saveImpFeedback('up'));
  if (thumbDown) thumbDown.addEventListener('click', () => saveImpFeedback('down'));

  function saveImpFeedback(dir) {
    try {
      const raw = localStorage.getItem('impactQaFb') || '[]';
      const arr = JSON.parse(raw);
      arr.push({ dir, at: new Date().toISOString(), q: input.value.slice(0, 200) });
      localStorage.setItem('impactQaFb', JSON.stringify(arr.slice(-50)));
    } catch {
      /* ignore */
    }
    const note = feedbackEl.querySelector('.imp-fb-note');
    if (note) {
      note.textContent = dir === 'up' ? '피드백 저장됨(로컬).' : '개선 메모가 기록되었습니다(로컬).';
    }
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('#impMain a.ans-cite');
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

  document.querySelectorAll('.imp-sample').forEach(btn => {
    btn.addEventListener('click', () => {
      input.value = btn.getAttribute('data-q') || '';
      if (typeof form.requestSubmit === 'function') form.requestSubmit();
      else form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupImpact);
} else {
  setupImpact();
}
