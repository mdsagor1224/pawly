import './styles/main.scss';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Preloader ---------- */
function preloader() {
  const pre = $('#preloader'), pct = $('#pct'), bar = $('.bar i', pre), paws = $$('.ptrail svg', pre);
  const state = { v: 0 }; let loaded = document.readyState === 'complete';
  if (!loaded) addEventListener('load', () => (loaded = true), { once: true });
  setTimeout(() => (loaded = true), 3500); // never block users
  const done = () => {
    gsap.timeline({ onComplete: () => { pre.remove(); document.body.classList.remove('loading'); ScrollTrigger.refresh(); } })
      .to('.pl', { scale: 1.08, autoAlpha: 0, duration: .45, ease: 'power2.in' })
      .to(pre, { yPercent: -100, duration: .8, ease: 'expo.inOut' }, '-=.1')
      .add(heroIntro, '-=.55');
  };
  if (reduce) { gsap.set(pct, { textContent: 100 }); loaded ? done() : addEventListener('load', done, { once: true }); return; }
  gsap.from('.pl .logo', { scale: .8, autoAlpha: 0, duration: .7, ease: 'back.out(1.6)' });
  paws.forEach((p, i) => gsap.fromTo(p, { x: i * 34 - 20, y: i % 2 ? 14 : 0, opacity: 0, rotate: i % 2 ? 20 : -20 }, { opacity: 1, duration: .35, delay: .25 + i * .22, yoyo: true, repeat: 1 }));
  gsap.to(bar, { scaleX: 1, duration: 1.4, ease: 'power1.inOut' });
  gsap.to(state, { v: 90, duration: 1.4, ease: 'power1.inOut', onUpdate: () => (pct.textContent = Math.round(state.v)),
    onComplete: function wait() {
      if (!loaded) return setTimeout(wait, 80);
      gsap.to(state, { v: 100, duration: .3, onUpdate: () => (pct.textContent = Math.round(state.v)), onComplete: done });
    } });
}

/* ---------- Hero ---------- */
function heroIntro() {
  if (reduce) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.hero h1 i', { yPercent: 110, duration: 1.1, stagger: .12 })
    .from('.hero .eyebrow,.hero .lead,.hero .ctas', { y: 30, autoAlpha: 0, duration: .9, stagger: .1 }, '-=.8')
    .from('.hero .main', { clipPath: 'inset(100% 0 0 0)', scale: 1.15, duration: 1.4 }, 0)
    .from('.hero .float', { scale: .6, autoAlpha: 0, duration: .8, stagger: .15, ease: 'back.out(1.7)' }, '-=.6');
  $$('.hero .float').forEach((f, i) => gsap.to(f, { y: i % 2 ? 12 : -12, duration: 2.4 + i * .4, repeat: -1, yoyo: true, ease: 'sine.inOut' }));
}

/* ---------- Nav ---------- */
function nav() {
  const n = $('#nav'), b = $('#burger'), m = $('#menu');
  const onScroll = () => n.classList.toggle('scrolled', scrollY > 30);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });
  const set = (o) => { m.classList.toggle('open', o); b.setAttribute('aria-expanded', o); document.body.style.overflow = o ? 'hidden' : ''; };
  b.addEventListener('click', () => set(!m.classList.contains('open')));
  $$('a', m).forEach((a) => a.addEventListener('click', () => set(false)));
  addEventListener('keydown', (e) => e.key === 'Escape' && set(false));
}

/* ---------- Scroll animations ---------- */
function scrollFx() {
  if (reduce) return;
  $$('.reveal').forEach((el) => gsap.from(el, { y: 50, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
  $$('.ing-item').forEach((el, i) => {
    gsap.from(el, { xPercent: 30, autoAlpha: 0, duration: 1.1, delay: i * .08, ease: 'expo.out', scrollTrigger: { trigger: '.ing-track', start: 'top 80%', once: true } });
    gsap.from($('img', el), { clipPath: 'inset(0 100% 0 0)', duration: 1.2, delay: i * .08, ease: 'expo.out', scrollTrigger: { trigger: '.ing-track', start: 'top 80%', once: true } });
  });
  gsap.from('.steps .line', { scaleX: 0, duration: 1.4, ease: 'power2.out', scrollTrigger: { trigger: '.steps', start: 'top 75%', once: true } });
  gsap.from('.final h2 span', { yPercent: 40, autoAlpha: 0, stagger: .15, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.final', start: 'top 60%', once: true } });
  $$('.final .paws svg').forEach((p, i) => gsap.to(p, { y: -40 - i * 8, rotate: i % 2 ? 25 : -25, duration: 3 + i * .5, repeat: -1, yoyo: true, ease: 'sine.inOut' }));
  $$('[data-parallax]').forEach((el) => gsap.to(el, { y: +el.dataset.parallax, ease: 'none', scrollTrigger: { trigger: el, scrub: .6, start: 'top bottom', end: 'bottom top' } }));
}

/* ---------- Counters ---------- */
function counters() {
  $$('[data-count]').forEach((el) => {
    const end = +el.dataset.count, dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || '', o = { v: 0 };
    const fmt = (v) => v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
    if (reduce) return;
    el.textContent = fmt(0);
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: end, duration: 1.8, ease: 'power2.out', onUpdate: () => (el.textContent = fmt(o.v)) }) });
  });
}

/* ---------- FAQ accordion ---------- */
function faq() {
  $$('.faq-q').forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      $$('.faq-q[aria-expanded=true]').forEach((o) => o !== btn && toggle(o, false));
      toggle(btn, !open);
    });
    function toggle(b, o) {
      const p = document.getElementById(b.getAttribute('aria-controls'));
      b.setAttribute('aria-expanded', o);
      gsap.to(p, { height: o ? 'auto' : 0, duration: reduce ? 0 : .45, ease: 'power3.inOut' });
    }
  });
}

/* ---------- Cursor (desktop only) ---------- */
function cursor() {
  if (reduce || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const c = $('.cursor'), x = gsap.quickTo(c, 'x', { duration: .35 }), y = gsap.quickTo(c, 'y', { duration: .35 });
  addEventListener('mousemove', (e) => { c.style.opacity = 1; x(e.clientX - 17); y(e.clientY - 17); });
  $$('a,button').forEach((el) => { el.addEventListener('mouseenter', () => c.classList.add('hov')); el.addEventListener('mouseleave', () => c.classList.remove('hov')); });
}

/* ---------- Newsletter + image fallback ---------- */
function misc() {
  $('#news').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = $('#em').value.trim(), m = $('#msg');
    m.textContent = /^\S+@\S+\.\S+$/.test(v) ? 'Thanks! Check your inbox for a welcome offer. 🐾' : 'Please enter a valid email address.';
    if (/^\S+@\S+\.\S+$/.test(v)) e.target.reset();
  });
  $$('img').forEach((i) => i.addEventListener('error', () => (i.style.visibility = 'hidden'), { once: true }));
}

nav(); faq(); counters(); scrollFx(); cursor(); misc(); preloader();
