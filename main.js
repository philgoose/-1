/* =====================================================
   FeelSoGood - Main JavaScript
   www.feelsogood.shop
   ===================================================== */

'use strict';

// ── Lecture Data ──
const lectureData = [
  {
    emoji: '🤖',
    bg: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    level: '입문~중급',
    levelColor: '#2563eb',
    title: '생성형 AI 완전정복',
    desc: 'ChatGPT, Gemini, Claude 등 주요 AI 도구를 업무에 즉시 적용하는 실전 중심 교육. 기획·문서작성·마케팅 활용 포함.',
    duration: '4~8시간',
    target: '전 직장인'
  },
  {
    emoji: '📊',
    bg: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
    level: '중급',
    levelColor: '#7c3aed',
    title: 'Power BI 데이터 시각화',
    desc: '데이터 연결부터 대시보드 제작까지. 비즈니스 의사결정을 돕는 실무형 Power BI 교육으로 현장에서 바로 활용 가능.',
    duration: '6~16시간',
    target: '실무자·관리자'
  },
  {
    emoji: '🔍',
    bg: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    level: '중급',
    levelColor: '#059669',
    title: 'Google Analytics 4',
    desc: 'GA4 설치·설정부터 데이터 해석과 마케팅 인사이트 도출까지. 디지털 마케팅 성과를 수치로 증명하는 방법.',
    duration: '4~8시간',
    target: '마케터·운영자'
  },
  {
    emoji: '🐍',
    bg: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    level: '입문~중급',
    levelColor: '#d97706',
    title: 'Python 데이터 분석',
    desc: '파이썬 기초부터 판다스·시각화까지. 실제 데이터셋으로 실습하며 데이터 기반 의사결정 역량을 키우는 과정.',
    duration: '8~24시간',
    target: '직장인·취업준비생'
  },
  {
    emoji: '🌿',
    bg: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
    level: '중급~고급',
    levelColor: '#16a34a',
    title: 'ESG 경영 전략',
    desc: 'ESG 경영컨설턴트 2급 자격 보유자의 실전 ESG 교육. 보고서 작성, 지속가능경영 전략, 공시 대응까지 완벽 지원.',
    duration: '4~12시간',
    target: '경영진·담당자'
  },
  {
    emoji: '🛡️',
    bg: 'linear-gradient(135deg, #fee2e2, #fecaca)',
    level: '입문~중급',
    levelColor: '#dc2626',
    title: 'AI 시대 보안 전략',
    desc: '군 정보·작전 경험 기반의 실전 보안 교육. AI 취약점, 정보보호 체계 구축, 사이버 위협 대응 방법 습득.',
    duration: '4~8시간',
    target: '임직원·관리자'
  }
];

// ── Client History Data ──
const clientData = [
  { year: '2026', name: '국립강릉원주대학교', topic: '중장년층 대상 AI 교육', type: 'univ', icon: '🎓', iconBg: '#dbeafe', iconColor: '#2563eb', tagColor: '#dbeafe', tagText: '#1d4ed8' },
  { year: '2025', name: '인천 대한상공회의소', topic: 'Power BI 강의', type: 'gov', icon: '🏛️', iconBg: '#ede9fe', iconColor: '#7c3aed', tagColor: '#ede9fe', tagText: '#6d28d9' },
  { year: '2025', name: '고용노동부', topic: 'AI 영업전략 교육 (일·미래·내일)', type: 'gov', icon: '🏢', iconBg: '#dcfce7', iconColor: '#059669', tagColor: '#dcfce7', tagText: '#065f46' },
  { year: '2025', name: '해양경찰청', topic: '적극행정 교육', type: 'gov', icon: '⚓', iconBg: '#dbeafe', iconColor: '#1d4ed8', tagColor: '#dbeafe', tagText: '#1e40af' },
  { year: '2025', name: '한국환경공단', topic: 'AI 인프라 구축 교육', type: 'gov', icon: '🌱', iconBg: '#dcfce7', iconColor: '#16a34a', tagColor: '#dcfce7', tagText: '#14532d' },
  { year: '2025', name: '(주)유신', topic: '보안 컨설팅', type: 'biz', icon: '🔒', iconBg: '#fee2e2', iconColor: '#dc2626', tagColor: '#fee2e2', tagText: '#b91c1c' },
  { year: '2025', name: '도로교통공사', topic: '블록체인과 재테크 전략', type: 'gov', icon: '🚦', iconBg: '#fef3c7', iconColor: '#d97706', tagColor: '#fef3c7', tagText: '#92400e' },
  { year: '2024', name: '강릉영동대학교', topic: 'PPT/엑셀 데이터 분석/AI 활용 교육', type: 'univ', icon: '🎓', iconBg: '#dbeafe', iconColor: '#2563eb', tagColor: '#dbeafe', tagText: '#1d4ed8' },
  { year: '2024', name: '강릉관동대학교', topic: 'Google Analytics 4 강의', type: 'univ', icon: '🎓', iconBg: '#ede9fe', iconColor: '#7c3aed', tagColor: '#ede9fe', tagText: '#6d28d9' },
  { year: '2024', name: '경남 진주 바이오 기업', topic: '보안 컨설팅', type: 'biz', icon: '🔬', iconBg: '#fee2e2', iconColor: '#dc2626', tagColor: '#fee2e2', tagText: '#b91c1c' },
  { year: '2023', name: '부산 소상공인진흥센터', topic: '브랜드 컨설팅', type: 'gov', icon: '🏪', iconBg: '#fef3c7', iconColor: '#d97706', tagColor: '#fef3c7', tagText: '#92400e' }
];

const typeLabel = { all: '전체', gov: '공공기관', univ: '대학교', biz: '기업/기타' };

// ──────────────────────────────────────────
// DOM Ready
// ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHero();
  initScrollAnimations();
  renderLectures();
  renderClients('all');
  initFilterTabs();
  initContactForm();
  initBackToTop();
  initCounters();
  initSmoothScroll();
});

// ── Header ──
function initHeader() {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  // Close nav on link click
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  }, { passive: true });
}

// ── Hero scroll indicator hide ──
function initHero() {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (!scrollIndicator) return;
  window.addEventListener('scroll', () => {
    scrollIndicator.style.opacity = window.scrollY > 80 ? '0' : '1';
  }, { passive: true });
}

// ── Scroll Animations (Intersection Observer) ──
function initScrollAnimations() {
  const elements = document.querySelectorAll(
    '.animate-fade-up, .animate-from-left, .animate-from-right'
  );
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ── Counter Animation ──
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

function animateCounter(el, target) {
  let current = 0;
  const duration = 1400;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    current = Math.round(ease * target);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ── Render Lectures ──
function renderLectures() {
  const grid = document.getElementById('lecturesGrid');
  if (!grid) return;

  grid.innerHTML = lectureData.map(l => `
    <div class="lecture-card animate-fade-up">
      <div class="lecture-thumb" style="background:${l.bg};">
        ${l.emoji}
      </div>
      <div class="lecture-body">
        <p class="lecture-level" style="color:${l.levelColor}">${l.level}</p>
        <h3 class="lecture-title">${l.title}</h3>
        <p class="lecture-desc">${l.desc}</p>
        <div class="lecture-footer">
          <span class="lecture-duration">
            <i class="fas fa-clock"></i> ${l.duration}
          </span>
          <span class="lecture-price">
            <i class="fas fa-users" style="font-size:0.75rem;margin-right:4px;"></i>${l.target}
          </span>
        </div>
      </div>
    </div>
  `).join('');

  // Re-observe newly added cards
  const newCards = grid.querySelectorAll('.animate-fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  newCards.forEach(card => observer.observe(card));
}

// ── Render Clients ──
function renderClients(filter) {
  const grid = document.getElementById('clientsGrid');
  if (!grid) return;

  const filtered = filter === 'all'
    ? clientData
    : clientData.filter(c => c.type === filter);

  grid.innerHTML = filtered.map(c => `
    <div class="client-card">
      <div class="client-icon" style="background:${c.iconBg}; color:${c.iconColor}; font-size:1.3rem;">
        ${c.icon}
      </div>
      <div class="client-info">
        <p class="client-year">${c.year}</p>
        <p class="client-name">${c.name}</p>
        <p class="client-topic">${c.topic}</p>
      </div>
      <span class="client-tag" style="background:${c.tagColor}; color:${c.tagText};">
        ${typeLabel[c.type]}
      </span>
    </div>
  `).join('');
}

// ── Filter Tabs ──
function initFilterTabs() {
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      const grid = document.getElementById('clientsGrid');
      grid.style.opacity = '0';
      grid.style.transform = 'translateY(10px)';
      setTimeout(() => {
        renderClients(filter);
        grid.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
      }, 200);
    });
  });
}

// ── Contact Form ──
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 전송 중...';
    btn.disabled = true;

    const data = {
      name: form.name.value,
      org: form.org.value,
      email: form.email.value,
      phone: form.phone.value,
      type: form.type.value,
      message: form.message.value,
      submitted_at: new Date().toISOString()
    };

    try {
      const res = await fetch('tables/contact_inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok || res.status === 201) {
        form.style.display = 'none';
        success.style.display = 'block';
      } else {
        throw new Error('서버 오류');
      }
    } catch {
      // Fallback: show success anyway (demo mode)
      form.style.display = 'none';
      success.style.display = 'block';
    }
  });
}

// ── Back to Top ──
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Smooth Scroll for anchor links ──
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--header-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}
