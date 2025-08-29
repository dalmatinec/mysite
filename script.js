// Год в футере
document.getElementById('year').textContent = new Date().getFullYear();

// Появление секций при скролле
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('show');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

// Печатающий эффект
(function typingEffect() {
  const el = document.querySelector('.typing');
  if (!el) return;
  const full = el.textContent.trim();
  el.setAttribute('aria-label', full);
  el.textContent = "";
  let i = 0;
  const step = () => {
    el.textContent = full.slice(0, i++);
    if (i <= full.length) requestAnimationFrame(step);
  };
  step();
})();

// Отзывы
const form = document.getElementById('review-form');
const nameInput = document.getElementById('rev-name');
const textInput = document.getElementById('rev-text');
const starsCtl = document.querySelectorAll('.stars button');
let currentRating = 5;

starsCtl.forEach(btn => {
  btn.addEventListener('click', () => {
    currentRating = Number(btn.dataset.star);
    starsCtl.forEach(b => b.classList.toggle('active', Number(b.dataset.star) <= currentRating));
  });
});

const reviews = [
  { name: "Ирина", text: "Сайт собран быстро, правки вносились моментально. Рекомендую!", rating: 5 },
  { name: "Дамир", text: "Подключил домен и всё развернул на VPS. Без лишних слов — работает.", rating: 5 },
];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const text = textInput.value.trim();
  if (!name || !text) return;
  reviews.unshift({ name, text, rating: currentRating });
  nameInput.value = "";
  textInput.value = "";
  currentRating = 5;
  starsCtl.forEach(b => b.classList.toggle('active', Number(b.dataset.star) <= currentRating));
  renderReviews();
});

// Слайдер
const track = document.getElementById('reviews-track');
const prevBtn = document.querySelector('.slider .prev');
const nextBtn = document.querySelector('.slider .next');
let index = 0;

function renderReviews() {
  track.innerHTML = "";
  reviews.forEach(({ name, text, rating }) => {
    const card = document.createElement('div');
    card.className = 'review';
    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
    card.innerHTML = `<div class="who"><span class="name">${escapeHTML(name)}</span> <span class="rating">${stars}</span></div><div class="text">${escapeHTML(text)}</div>`;
    track.appendChild(card);
  });
  index = 0;
  updateSlider();
}

function escapeHTML(s) {
  return s.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]);
}

function updateSlider() {
  const cards = track.children;
  if (!cards.length) return;
  const viewport = track.parentElement.getBoundingClientRect().width;
  const cardW = cards[0].getBoundingClientRect().width + 14;
  const visible = Math.max(1, Math.floor(viewport / cardW));
  const maxIndex = Math.max(0, reviews.length - visible);
  index = Math.min(index, maxIndex);
  const offset = -(index * cardW);
  track.style.transform = `translateX(${offset}px)`;
  prevBtn.disabled = index <= 0;
  nextBtn.disabled = index >= maxIndex;
}

prevBtn.addEventListener('click', () => { index = Math.max(0, index - 1); updateSlider(); });
nextBtn.addEventListener('click', () => { index = index + 1; updateSlider(); });
window.addEventListener('resize', updateReviews);

function updateReviews() {
  renderReviews();
  updateSlider();
}
renderReviews();

// Бургер-меню
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Кнопка "Наверх"
const backToTop = document.querySelector('.back-to-top');

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}