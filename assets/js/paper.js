/* Paper pages: BibTeX copy button and the small explanatory animations.
 * Each animation is a <figure class="anim" data-anim="name"> whose frame(t) is
 * driven by one shared loop. Animations pause off-screen and, under
 * prefers-reduced-motion, render a single static frame instead. */
(function () {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var C = {
    acc: '#5b9bd5',       // accuracy player / real data
    fair: '#e4794f',      // fairness player / fair data
    dim: '#2c2c2c',
    text: '#d0d0d0',
    muted: '#8a8a8a',
    grid: '#222'
  };

  function el(name, attrs, parent) {
    var n = document.createElementNS(SVGNS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function text(parent, x, y, str, attrs) {
    var t = el('text', Object.assign({ x: x, y: y, fill: C.text, 'font-size': 13 }, attrs || {}), parent);
    t.textContent = str;
    return t;
  }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function ease(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
  function lerp(a, b, k) { return a + (b - a) * k; }

  /* ---------- BibTeX copy ---------- */
  document.querySelectorAll('.paper__copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pre = document.getElementById(btn.getAttribute('data-copy-target'));
      if (!pre || !navigator.clipboard) return;
      navigator.clipboard.writeText(pre.textContent).then(function () {
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
      });
    });
  });

  /* ---------- FairBiNN: leader / follower alternation (schematic) ---------- */
  function fairbinn(root) {
    var svg = root.querySelector('svg');
    var cols = [40, 140, 230, 340, 430, 540, 630, 720];
    var ys = [95, 125, 155, 185, 215];
    var fairGap = 3; // edges between cols[3] and cols[4] belong to the fairness player

    // player regions
    el('rect', { x: 100, y: 52, width: 570, height: 222, rx: 18, fill: 'rgba(91,155,213,0.07)', stroke: 'rgba(91,155,213,0.35)' }, svg);
    var fairBox = el('rect', { x: 305, y: 66, width: 160, height: 192, rx: 14, fill: 'rgba(228,121,79,0.09)', stroke: 'rgba(228,121,79,0.45)' }, svg);
    text(svg, 385, 246, 'Fairness player (θ', { 'text-anchor': 'middle', 'font-size': 12, fill: C.fair }).innerHTML = 'Fairness player (θ<tspan baseline-shift="sub" font-size="9">f</tspan>)';
    text(svg, 385, 293, '', { 'text-anchor': 'middle', 'font-size': 12, fill: C.acc }).innerHTML = 'Accuracy player (θ<tspan baseline-shift="sub" font-size="9">a</tspan>)';
    text(svg, cols[0], 262, 'input', { 'text-anchor': 'middle', 'font-size': 11, fill: C.muted });
    text(svg, cols[7], 262, 'output', { 'text-anchor': 'middle', 'font-size': 11, fill: C.muted });

    var edges = [];
    for (var g = 0; g < cols.length - 1; g++) {
      var from = g === 0 ? ys : ys, to = g === cols.length - 2 ? [155] : ys;
      for (var i = 0; i < from.length; i++) for (var j = 0; j < to.length; j++) {
        edges.push({ gap: g, node: el('line', { x1: cols[g], y1: from[i], x2: cols[g + 1], y2: to[j], 'stroke-width': 1 }, svg) });
      }
    }
    var nodes = [];
    cols.forEach(function (x, ci) {
      (ci === cols.length - 1 ? [155] : ys).forEach(function (y) {
        nodes.push({ col: ci, node: el('circle', { cx: x, cy: y, r: 7, fill: '#141414', 'stroke-width': 1.5 }, svg) });
      });
    });

    // header + equations
    var phase = text(svg, 380, 26, '', { 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 600 });
    var eqL = text(svg, 380, 324, '', { 'text-anchor': 'middle', 'font-size': 13 });
    eqL.innerHTML = 'Leader:  min<tspan baseline-shift="sub" font-size="9">θa</tspan>  L<tspan baseline-shift="sub" font-size="9">acc</tspan>(θ<tspan baseline-shift="sub" font-size="9">a</tspan>, θ<tspan baseline-shift="sub" font-size="9">f</tspan>*)';
    var eqF = text(svg, 380, 346, '', { 'text-anchor': 'middle', 'font-size': 13 });
    eqF.innerHTML = 'Follower:  θ<tspan baseline-shift="sub" font-size="9">f</tspan>* ∈ argmin<tspan baseline-shift="sub" font-size="9">θf</tspan>  L<tspan baseline-shift="sub" font-size="9">fair</tspan>(θ<tspan baseline-shift="sub" font-size="9">a</tspan>, θ<tspan baseline-shift="sub" font-size="9">f</tspan>)';

    var half = 4.5;
    return function frame(t) {
      var leader = t < half;
      var p = (t % half) / half;                 // progress within the step
      // gradient wave travels backwards (output -> input) like backprop
      var wave = lerp(cols.length - 1.5, -0.5, ease(p * 1.15));
      edges.forEach(function (e) {
        var own = (e.gap === fairGap) !== leader; // edge owned by the active player
        var near = Math.max(0, 1 - Math.abs(e.gap - wave) / 1.2);
        if (own) {
          e.node.setAttribute('stroke', leader ? C.acc : C.fair);
          e.node.setAttribute('stroke-opacity', (0.35 + 0.65 * near).toFixed(2));
          e.node.setAttribute('stroke-width', (1 + 1.2 * near).toFixed(2));
        } else {
          e.node.setAttribute('stroke', '#555');
          e.node.setAttribute('stroke-opacity', '0.18');
          e.node.setAttribute('stroke-width', '1');
        }
      });
      nodes.forEach(function (n) {
        var inFair = n.col === 3 || n.col === 4;
        n.node.setAttribute('stroke', inFair ? C.fair : (n.col === 0 || n.col === 7 ? '#777' : C.acc));
      });
      fairBox.setAttribute('stroke-opacity', leader ? 0.35 : 1);
      phase.textContent = leader
        ? 'Step 1 · Leader: the accuracy player updates its layers on BCE loss'
        : 'Step 2 · Follower: the fairness player updates its layers on the DP loss';
      phase.setAttribute('fill', leader ? C.acc : C.fair);
      eqL.setAttribute('fill', leader ? C.text : '#555');
      eqF.setAttribute('fill', leader ? '#555' : C.text);
    };
  }

  /* ---------- TabFairGAN: real data vs fair synthetic data (paper's numbers) ---------- */
  function tabfairgan(root) {
    var svg = root.querySelector('svg');
    var data = [ // [dataset, DS real, DS TabFairGAN, Acc real, Acc TabFairGAN]
      ['Adult', 0.195, 0.009, 0.816, 0.773],
      ['Bank', 0.126, 0.001, 0.879, 0.854],
      ['COMPAS', 0.258, 0.009, 0.903, 0.860],
      ['Law School', 0.302, 0.024, 0.854, 0.847]
    ];
    var top = 70, h = 190, base = top + h;
    var panels = [
      { x: 60, w: 300, max: 0.35, ticks: [0, 0.1, 0.2, 0.3], title: 'Discrimination score in the data  (lower = fairer)', i: 1 },
      { x: 440, w: 300, max: 1, ticks: [0, 0.25, 0.5, 0.75, 1], title: 'Accuracy on the real test set  (higher = better)', i: 3 }
    ];
    var state = text(svg, 380, 24, '', { 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 600 });
    var bars = [];
    panels.forEach(function (P) {
      text(svg, P.x, 52, P.title, { 'font-size': 12, fill: C.muted });
      P.ticks.forEach(function (v) {
        var y = base - v / P.max * h;
        el('line', { x1: P.x, x2: P.x + P.w, y1: y, y2: y, stroke: C.grid }, svg);
        text(svg, P.x - 6, y + 4, String(v), { 'text-anchor': 'end', 'font-size': 10, fill: C.muted });
      });
      var bw = 44, step = P.w / data.length;
      data.forEach(function (d, k) {
        var x = P.x + step * k + (step - bw) / 2;
        var ghost = el('rect', { x: x, width: bw, fill: 'none', stroke: C.acc, 'stroke-dasharray': '3 3', 'stroke-opacity': 0 }, svg);
        var r = el('rect', { x: x, width: bw, rx: 2 }, svg);
        var lab = text(svg, x + bw / 2, 0, '', { 'text-anchor': 'middle', 'font-size': 11 });
        text(svg, x + bw / 2, base + 18, d[0], { 'text-anchor': 'middle', 'font-size': 11, fill: C.muted });
        bars.push({ P: P, d: d, r: r, ghost: ghost, lab: lab });
      });
    });
    var legend = el('g', {}, svg);
    el('rect', { x: 250, y: 302, width: 11, height: 11, fill: C.acc, rx: 2 }, legend);
    text(legend, 266, 312, 'Real data', { 'font-size': 12 });
    el('rect', { x: 360, y: 302, width: 11, height: 11, fill: C.fair, rx: 2 }, legend);
    text(legend, 376, 312, 'TabFairGAN synthetic data', { 'font-size': 12 });

    return function frame(t) {
      // hold real (0-1.5) → morph (1.5-3.5) → hold fair (3.5-8) → morph back (8-10)
      var k = t < 1.5 ? 0 : t < 3.5 ? ease((t - 1.5) / 2) : t < 8 ? 1 : 1 - ease((t - 8) / 2);
      bars.forEach(function (b) {
        var real = b.d[b.P.i], fair = b.d[b.P.i + 1], v = lerp(real, fair, k);
        var bh = v / b.P.max * h;
        b.r.setAttribute('y', base - bh);
        b.r.setAttribute('height', Math.max(bh, 0.5));
        b.r.setAttribute('fill', k < 0.5 ? C.acc : C.fair);
        b.r.setAttribute('fill-opacity', (0.55 + 0.45 * Math.abs(k - 0.5) * 2).toFixed(2));
        var gh = real / b.P.max * h;
        b.ghost.setAttribute('y', base - gh);
        b.ghost.setAttribute('height', gh);
        b.ghost.setAttribute('stroke-opacity', k > 0.05 ? 0.6 : 0);
        b.lab.setAttribute('y', base - bh - 6);
        b.lab.textContent = v.toFixed(3);
      });
      state.textContent = k < 0.5 ? 'Real data' : 'TabFairGAN synthetic data (after the fairness phase)';
      state.setAttribute('fill', k < 0.5 ? C.acc : C.fair);
    };
  }

  /* ---------- Image comparisons ---------- */
  function compare(root) {
    var box = root.querySelector('.compare');
    var ctl = { manual: false };
    function set(p) { box.style.setProperty('--split', (p * 100).toFixed(2) + '%'); }
    function fromEvent(e) {
      var r = box.getBoundingClientRect();
      set(clamp((e.clientX - r.left) / r.width, 0, 1));
    }
    box.addEventListener('pointerdown', function (e) { ctl.manual = true; ctl.pause(); fromEvent(e); box.setPointerCapture(e.pointerId); });
    box.addEventListener('pointermove', function (e) { if (box.hasPointerCapture(e.pointerId)) fromEvent(e); });
    var frame = function (t, dur) { set(0.5 - 0.38 * Math.cos(2 * Math.PI * t / dur)); };
    frame.ctl = ctl;
    frame.staticT = 0.4;
    return frame;
  }

  var builders = { fairbinn: fairbinn, tabfairgan: tabfairgan, compare: compare };

  /* ---------- shared player ---------- */
  document.querySelectorAll('.anim[data-anim]').forEach(function (root) {
    var build = builders[root.getAttribute('data-anim')];
    if (!build) return;
    var frame = build(root);
    var dur = parseFloat(root.getAttribute('data-duration')) || 8;
    var btn = root.querySelector('.anim__toggle');
    var t = 0, last = null, playing = !reduced, visible = false;

    function icon() {
      if (!btn) return;
      btn.innerHTML = playing ? '<i class="fas fa-pause" aria-hidden="true"></i>' : '<i class="fas fa-play" aria-hidden="true"></i>';
      btn.setAttribute('aria-label', playing ? 'Pause animation' : 'Play animation');
    }
    function tick(now) {
      if (playing && visible) {
        if (last !== null) t = (t + Math.min(now - last, 100) / 1000) % dur;
        frame(t, dur);
      }
      last = now;
      requestAnimationFrame(tick);
    }
    if (frame.ctl) frame.ctl.pause = function () { playing = false; icon(); };

    if (btn) btn.addEventListener('click', function () { playing = !playing; last = null; icon(); });

    // static frame: for reduced motion, and so the figure is never blank
    var staticT = (frame.staticT !== undefined ? frame.staticT : 0.75) * dur;
    t = reduced ? staticT : 0;
    frame(reduced ? staticT : 0, dur);
    icon();

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }).observe(root);
    } else {
      visible = true;
    }
    requestAnimationFrame(tick);
  });
})();
