const KG_TO_LB = 2.2046226218;

const CARDS = {
  weight: {
    a: { name: 'Kilograms', unit: 'kg' },
    b: { name: 'Pounds', unit: 'lb' },
    toB: kg => kg * KG_TO_LB,
    toA: lb => lb / KG_TO_LB
  },
  temp: {
    a: { name: 'Celsius', unit: '°C' },
    b: { name: 'Fahrenheit', unit: '°F' },
    toB: c => c * 9 / 5 + 32,
    toA: f => (f - 32) * 5 / 9
  }
};

function format(n) {
  const r = Math.round(n * 100) / 100;
  return String(Object.is(r, -0) ? 0 : r);
}

function parse(text) {
  const s = text.trim().replace(',', '.');
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function setup(el, cfg) {
  const input = el.querySelector('.in');
  const out = el.querySelector('.result');
  const swap = el.querySelector('.swap');
  let reversed = false;

  function update() {
    const n = parse(input.value);
    const fn = reversed ? cfg.toA : cfg.toB;
    const text = n === null ? '—' : format(fn(n));
    if (out.textContent !== text) {
      out.textContent = text;
      out.classList.remove('pop');
      void out.offsetWidth;
      out.classList.add('pop');
    }
  }

  function render() {
    const from = reversed ? cfg.b : cfg.a;
    const to = reversed ? cfg.a : cfg.b;
    el.querySelector('.from-name').textContent = from.name;
    el.querySelector('.to-name').textContent = to.name;
    el.querySelector('.in-unit').textContent = from.unit;
    el.querySelector('.out-unit').textContent = to.unit;
    input.setAttribute('aria-label', from.name);
    out.setAttribute('aria-label', to.name + ' (tap to copy)');
  }

  input.addEventListener('input', update);
  swap.addEventListener('click', () => {
    const shown = out.textContent;
    reversed = !reversed;
    input.value = shown === '—' ? '' : shown;
    swap.classList.toggle('flip');
    render();
    update();
  });
}

document.querySelectorAll('.card').forEach(el => setup(el, CARDS[el.dataset.card]));

const toast = document.getElementById('toast');
let toastTimer;
function copy(out) {
  const text = out.textContent;
  if (text === '—') return;
  const done = () => {
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1200);
  };
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, () => {});
}
document.querySelectorAll('.result').forEach(out => {
  out.addEventListener('click', () => copy(out));
  out.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copy(out); }
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}
