/* ===== MathLearn — JavaScript Vanilla ===== */
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

/* ---------- Data fungsi: f(x) = a·x + b ---------- */
const FUNCS = {
  f: { a: 1, b: 3, text: "x + 3" },
  g: { a: 4, b: 5, text: "4x + 5" },
  h: { a: 3, b: -9, text: "3x - 9" },
};
const apply = (n, x) => FUNCS[n].a * x + FUNCS[n].b;

/* ---------- Ikon SVG sederhana ---------- */
const ICONS = {
  home: '<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/>',
  line: '<path d="M4 20L20 4"/><circle cx="8" cy="16" r="1.5"/><circle cx="16" cy="8" r="1.5"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  calc: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 6h6M9 11h.01M12 11h.01M15 11h.01M9 15h.01M12 15h.01M15 15h.01"/>',
  pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21h4"/>',
};
$$("i[data-i]").forEach((el) => (el.innerHTML = `<svg viewBox="0 0 24 24">${ICONS[el.dataset.i]}</svg>`));

/* ---------- Penyimpanan progres ---------- */
const state = { materi: ["Dasar Koordinat", "Pengenalan Fungsi", "Input & Output", "Grafik Linear"], latihan: 12, nilai: 87, progress: 65 };
try { Object.assign(state, JSON.parse(localStorage.getItem("mathlearn") || "{}")); } catch (e) {}
const save = () => { try { localStorage.setItem("mathlearn", JSON.stringify(state)); } catch (e) {} };

function renderStats() {
  $("#stMateri").textContent = $("#pMateri").textContent = state.materi.length;
  $("#stLatihan").textContent = $("#pLatihan").textContent = state.latihan;
  $("#stNilai").textContent = $("#pNilai").textContent = state.nilai + "%";
  $("#stProg").textContent = $("#pProg").textContent = state.progress + "%";
  $("#ring").style.setProperty("--p", state.progress);
  setTimeout(() => ($("#pBar").style.width = state.progress + "%"), 100);
  $("#doneList").innerHTML = state.materi.map((m) => `<li>${m}</li>`).join("");
}

/* ---------- Navigasi & sidebar ---------- */
const titles = { dashboard: "Dashboard", grafik: "Materi Grafik", linear: "Fungsi Linear", komposisi: "Komposisi Fungsi", kalkulator: "Kalkulator", latihan: "Latihan Soal", profil: "Profil" };
function go(page) {
  $$(".page").forEach((p) => p.classList.toggle("active", p.id === page));
  $$("#nav button").forEach((b) => b.classList.toggle("active", b.dataset.page === page));
  closeMenu();
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (page === "grafik") drawPlane();
  if (page === "linear") drawLinear();
  if (page === "profil") renderStats();
}
$$("#nav button").forEach((b) => b.addEventListener("click", () => go(b.dataset.page)));
$$("[data-go]").forEach((b) => b.addEventListener("click", () => go(b.dataset.go)));
const openMenu = () => { $("#sidebar").classList.add("open"); $("#scrim").classList.add("open"); };
const closeMenu = () => { $("#sidebar").classList.remove("open"); $("#scrim").classList.remove("open"); };
$("#menuBtn").onclick = openMenu;
$("#scrim").onclick = closeMenu;
$("#search").addEventListener("change", (e) => {
  const key = Object.keys(titles).find((k) => titles[k].toLowerCase() === e.target.value.toLowerCase());
  if (key) { go(key); e.target.value = ""; } else toast("Materi tidak ditemukan");
});
$("#notif").onclick = () => toast("Belum ada notifikasi baru");
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(t.timer); t.timer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- Kanvas koordinat (dipakai Grafik & Linear) ---------- */
const RANGE = 10;
function setup(cv) {
  const ctx = cv.getContext("2d"), S = cv.width, u = S / (RANGE * 2);
  ctx.clearRect(0, 0, S, S);
  ctx.font = "13px Plus Jakarta Sans, sans-serif";
  for (let i = -RANGE; i <= RANGE; i++) {
    const p = S / 2 + i * u;
    ctx.strokeStyle = i === 0 ? "#0f2a5c" : "#e3e8f2";
    ctx.lineWidth = i === 0 ? 2 : 1;
    ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, S); ctx.moveTo(0, p); ctx.lineTo(S, p); ctx.stroke();
    if (i && i % 2 === 0) { ctx.fillStyle = "#5f6b85"; ctx.fillText(i, p - 6, S / 2 + 16); ctx.fillText(-i, S / 2 + 6, p + 4); }
  }
  ctx.fillStyle = "#0f2a5c"; ctx.font = "bold 16px sans-serif";
  ctx.fillText("x", S - 18, S / 2 - 8); ctx.fillText("y", S / 2 + 8, 16);
  return { ctx, S, u, X: (x) => S / 2 + x * u, Y: (y) => S / 2 - y * u };
}
function dot(c, x, y, color, label) {
  c.ctx.fillStyle = color; c.ctx.beginPath(); c.ctx.arc(c.X(x), c.Y(y), 6, 0, 7); c.ctx.fill();
  c.ctx.fillStyle = "#0f2a5c"; c.ctx.font = "bold 13px sans-serif";
  c.ctx.fillText(label, c.X(x) + 9, c.Y(y) - 9);
}
// Animasi: garis tumbuh dari kiri ke kanan
function animateLine(c, fn, color, done) {
  const t0 = performance.now(), dur = 700;
  (function frame(t) {
    const k = Math.min((t - t0) / dur, 1), xEnd = -RANGE + 2 * RANGE * k;
    c.ctx.strokeStyle = color; c.ctx.lineWidth = 3; c.ctx.beginPath();
    c.ctx.moveTo(c.X(-RANGE), c.Y(fn(-RANGE))); c.ctx.lineTo(c.X(xEnd), c.Y(fn(xEnd))); c.ctx.stroke();
    k < 1 ? requestAnimationFrame(frame) : done && done();
  })(t0);
}

/* ---------- Materi Grafik ---------- */
let points = [{ x: 3, y: 2 }];
function drawPlane() {
  const c = setup($("#cvGrafik"));
  points.forEach((p) => dot(c, p.x, p.y, "#7c5cf0", `(${p.x}, ${p.y})`));
  $("#plist").innerHTML = points.map((p) => `<li>(${p.x}, ${p.y})</li>`).join("");
}
$("#addPoint").onclick = () => {
  const x = parseFloat($("#px").value), y = parseFloat($("#py").value);
  if (isNaN(x) || isNaN(y)) return toast("Isi X dan Y dengan angka");
  if (Math.abs(x) > RANGE || Math.abs(y) > RANGE) return toast("Nilai harus antara -10 dan 10");
  points.push({ x, y }); drawPlane();
  if (!state.materi.includes("Titik Koordinat")) { state.materi.push("Titik Koordinat"); save(); renderStats(); }
};
$("#clearPoints").onclick = () => { points = []; drawPlane(); };

/* ---------- Chip helper ---------- */
function chips(box, items, onPick, firstOn = 0) {
  box.innerHTML = items.map((it, i) => `<button class="chip ${i === firstOn ? "on" : ""}" data-v="${it.v}">${it.t}</button>`).join("");
  box.querySelectorAll(".chip").forEach((b) => b.addEventListener("click", () => {
    box.querySelectorAll(".chip").forEach((x) => x.classList.remove("on")); b.classList.add("on"); onPick(b.dataset.v);
  }));
}
const showSteps = (el, rows, tag = "div") => {
  el.innerHTML = rows.map((r, i) => `<${tag} class="${i === rows.length - 1 ? "final" : ""}" style="animation-delay:${i * 0.5}s">${r}</${tag}>`).join("");
};

/* ---------- Fungsi Linear ---------- */
let linFn = "f";
chips($("#linChips"), Object.keys(FUNCS).map((n) => ({ v: n, t: `${n}(x) = ${FUNCS[n].text}` })), (v) => { linFn = v; drawLinear(); $("#linOut").innerHTML = '<p class="hint">Tekan “Hitung”.</p>'; });
function drawLinear(x) {
  const c = setup($("#cvLinear")), n = linFn;
  animateLine(c, (t) => apply(n, t), "#1b3f86", () => {
    if (x !== undefined && Math.abs(x) <= RANGE && Math.abs(apply(n, x)) <= RANGE) dot(c, x, apply(n, x), "#7c5cf0", `(${x}, ${apply(n, x)})`);
  });
}
$("#linCalc").onclick = () => {
  const x = parseFloat($("#linX").value);
  if (isNaN(x)) return toast("Masukkan nilai x berupa angka");
  const { a, b } = FUNCS[linFn], n = linFn, hasil = apply(n, x);
  const ax = a === 1 ? `${x}` : `${a} × ${x}`, bb = b < 0 ? `- ${-b}` : `+ ${b}`;
  showSteps($("#linOut"), [
    `Input: x = ${x}`,
    `Fungsi: ${n}(x) = ${FUNCS[n].text}`,
    `${n}(${x}) = ${ax} ${bb}`,
    `Hasil = ${hasil}`,
  ]);
  drawLinear(x);
  if (!state.materi.includes("Fungsi Linear")) { state.materi.push("Fungsi Linear"); save(); renderStats(); }
};

/* ---------- Komposisi Fungsi ---------- */
const PAIRS = ["fg", "gf", "fh", "hf", "gh", "hg"];
let pair = "fg";
chips($("#compChips"), PAIRS.map((p) => ({ v: p, t: `${p[0]} ∘ ${p[1]}` })), (v) => (pair = v));
$("#compCalc").onclick = () => {
  const x = parseFloat($("#compX").value);
  if (isNaN(x)) return toast("Masukkan nilai x berupa angka");
  const [o, i] = pair, inner = apply(i, x), out = apply(o, inner);
  const sym = (n, v) => `${n}(${v})`;
  showSteps($("#compOut"), [
    `Soal: (${o} ∘ ${i})(x) = ${o}(${i}(x)), untuk x = ${x}`,
    `Kerjakan fungsi dalam dulu → ${i}(x) = ${FUNCS[i].text}`,
    `${sym(i, x)} = ${inner}`,
    `Lalu masukkan ke ${o}(x) = ${FUNCS[o].text}`,
    `${o}(${i}(${x})) = ${sym(o, inner)} = ${out}`,
    `Hasil = ${out}`,
  ], "li");
  if (!state.materi.includes("Komposisi Fungsi")) { state.materi.push("Komposisi Fungsi"); save(); renderStats(); }
};

/* ---------- Kalkulator ---------- */
chips($("#presetChips"), Object.keys(FUNCS).map((n) => ({ v: n, t: `${n}(x) = ${FUNCS[n].text}` })), (v) => { $("#calFn").value = FUNCS[v].text; }, -1);
function evalExpr(expr, x) {
  const clean = expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace(/\^/g, "**").replace(/\s+/g, "");
  if (!/^[0-9x+\-*/().]+$/.test(clean)) throw new Error("Gunakan hanya x, angka, + - * / dan tanda kurung.");
  const sub = (v) => clean.replace(/(\d|\))x/g, "$1*x").replace(/x/g, `(${v})`);
  const r = Function(`"use strict";return (${sub(x)})`)();
  if (!isFinite(r)) throw new Error("Hasil tidak terdefinisi.");
  return { r: Math.round(r * 1e6) / 1e6, subbed: sub(x).replace(/\*\*/g, "^") };
}
$("#calGo").onclick = () => {
  const fn = $("#calFn").value.trim(), x = parseFloat($("#calX").value);
  if (!fn || isNaN(x)) return toast("Isi fungsi dan nilai x");
  try {
    const { r, subbed } = evalExpr(fn, x);
    showSteps($("#calOut"), [`Fungsi: f(x) = ${fn}`, `Ganti x dengan ${x}: f(${x}) = ${subbed}`, `Hasil = ${r}`]);
  } catch (e) { $("#calOut").innerHTML = `<div style="opacity:1;color:#dc2626">${e.message === "Hasil tidak terdefinisi." ? e.message : "Fungsi tidak valid. Contoh: 2x + 1"}</div>`; }
};

/* ---------- Latihan Soal (10 soal) ---------- */
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
function makeQuestions() {
  const qs = [{ q: "Jika f(x) = x + 3 dan x = 5, tentukan f(x).", ans: 8, ex: "f(5) = 5 + 3 = 8" }];
  const kinds = ["linear", "linear", "linear", "comp", "comp", "comp", "linear", "comp", "linear"];
  kinds.forEach((k) => {
    const x = rnd(1, 6), names = ["f", "g", "h"];
    if (k === "linear") {
      const n = names[rnd(0, 2)];
      qs.push({ q: `Jika ${n}(x) = ${FUNCS[n].text}, tentukan ${n}(${x}).`, ans: apply(n, x), ex: `${n}(${x}) = ${FUNCS[n].a}×${x} ${FUNCS[n].b < 0 ? "-" : "+"} ${Math.abs(FUNCS[n].b)} = ${apply(n, x)}` });
    } else {
      const p = PAIRS[rnd(0, 5)], [o, i] = p, inner = apply(i, x);
      qs.push({ q: `Jika f(x) = x + 3, g(x) = 4x + 5, h(x) = 3x − 9, tentukan (${o} ∘ ${i})(${x}).`, ans: apply(o, inner), ex: `${i}(${x}) = ${inner}, lalu ${o}(${inner}) = ${apply(o, inner)}` });
    }
  });
  return qs.map((q) => {
    const set = new Set([q.ans]);
    while (set.size < 4) set.add(q.ans + rnd(-4, 4) || q.ans + 5);
    const opts = [...set].sort(() => Math.random() - 0.5);
    return { ...q, opts, correct: opts.indexOf(q.ans) };
  });
}
let Q = [], qi = 0, score = 0, locked = false;
function startQuiz() { Q = makeQuestions(); qi = 0; score = 0; showQ(); }
function showQ() {
  const q = Q[qi]; locked = false;
  $("#qNo").textContent = `Soal ${qi + 1} dari ${Q.length}`;
  $("#qScore").textContent = `Skor: ${score}`;
  $("#qBar").style.width = (qi / Q.length) * 100 + "%";
  $("#qText").textContent = q.q;
  $("#qFb").innerHTML = ""; $("#qNext").hidden = true;
  $("#qOpts").innerHTML = q.opts.map((o, i) => `<button class="opt" data-i="${i}">${"ABCD"[i]}. ${o}</button>`).join("");
  $$(".opt").forEach((b) => b.addEventListener("click", () => answer(+b.dataset.i)));
}
function answer(i) {
  if (locked) return; locked = true;
  const q = Q[qi], ok = i === q.correct, btns = $$(".opt");
  btns.forEach((b) => (b.disabled = true));
  btns[q.correct].classList.add("right");
  if (!ok) btns[i].classList.add("wrong"); else score++;
  $("#qScore").textContent = `Skor: ${score}`;
  $("#qFb").innerHTML = `<b class="${ok ? "ok" : "no"}">${ok ? "Benar! 🎉" : "Kurang tepat."}</b> Pembahasan: ${q.ex}`;
  $("#qNext").textContent = qi === Q.length - 1 ? "Lihat hasil" : "Soal berikutnya";
  $("#qNext").hidden = false;
}
$("#qNext").onclick = () => {
  if (qi < Q.length - 1) { qi++; showQ(); return; }
  const pct = Math.round((score / Q.length) * 100);
  $("#qBar").style.width = "100%";
  $("#qText").textContent = `Latihan selesai! Skor kamu ${score}/${Q.length} (${pct}%).`;
  $("#qOpts").innerHTML = ""; $("#qFb").textContent = pct >= 80 ? "Hebat, pertahankan!" : "Ulangi materi lalu coba lagi.";
  $("#qNext").textContent = "Ulangi latihan"; $("#qNext").onclick = () => { $("#qNext").onclick = nextHandler; startQuiz(); };
  state.nilai = Math.round((state.nilai + pct) / 2); state.latihan += Q.length;
  state.progress = Math.min(100, state.progress + 5); save(); renderStats();
};
const nextHandler = $("#qNext").onclick;

/* ---------- Mulai ---------- */
renderStats();
startQuiz();
