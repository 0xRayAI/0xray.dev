// Board spectrum on the hero link.
// Meter: 14 bars, hue = t * 0.05, level = sin(t / 220). Same formula as the live board.
// Loop: the board's ambient replay. Play 5s, then start again every 10s.
(function () {
  var EVERY = 10000;
  var PLAY = 5000;
  var BARS = 14;
  var word = document.getElementById('hero-bifrost');
  var meter = document.getElementById('hero-spectrum');
  if (!word || !meter) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  var i;
  for (i = 0; i < BARS; i++) meter.appendChild(document.createElement('i'));
  var playing = false;
  var raf = 0;
  var stopTimer = 0;

  function hueOf(n) {
    var h = Math.round(n) % 360;
    return h < 0 ? h + 360 : h;
  }

  function frame(now) {
    if (!playing) return;
    var bars = meter.children;
    var h0 = hueOf(now * 0.05);
    var n;
    for (n = 0; n < BARS; n++) {
      var hue = hueOf(now * 0.05 + n * (360 / BARS));
      var level = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(now / 220 + n * 0.7));
      bars[n].style.background = 'hsl(' + hue + ',90%,58%)';
      bars[n].style.height = Math.round(4 + level * 12) + 'px';
    }
    word.style.setProperty('--h1', String(h0));
    word.style.setProperty('--h2', String(hueOf(h0 + 80)));
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    playing = false;
    cancelAnimationFrame(raf);
    word.classList.remove('is-on');
    word.style.removeProperty('--h1');
    word.style.removeProperty('--h2');
    meter.hidden = true;
  }

  function start() {
    if (playing) return;
    playing = true;
    word.classList.add('is-on');
    meter.hidden = false;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
    clearTimeout(stopTimer);
    stopTimer = setTimeout(stop, PLAY);
  }

  start();
  setInterval(start, EVERY);
})();
