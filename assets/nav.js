/* =========================================================================
   Total Build — shared behaviour for every page.

   Ported unchanged in substance from a-gallery.html's inline script, so the
   whole site behaves like the prototype Joe has been reviewing.

   Progressive enhancement only. With JavaScript off the page is fully
   legible: the `.js` class is what hides `.reveal` elements in the first
   place, so if this file never runs, nothing is ever hidden.
   ========================================================================= */
document.documentElement.classList.add('js');

/* Scroll reveals ---------------------------------------------------------- */
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(els, function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  Array.prototype.forEach.call(els, function (el) { io.observe(el); });
})();

/* Sticky header -----------------------------------------------------------
   Two jobs: publish the header's real height so a full-bleed hero can tuck
   underneath it, and flip `.scrolled` once the page has moved.

   On a `hero-overlay` page the bar starts transparent over the photograph, so
   it needs a larger threshold than the plain ambient-shadow case; at 10px it
   would flick solid on the first nudge of the wheel. */
(function () {
  var h = document.getElementById('siteHeader');
  if (!h) return;

  var publishHeight = function () {
    document.documentElement.style.setProperty('--header-h', h.offsetHeight + 'px');
  };
  publishHeight();
  window.addEventListener('resize', publishHeight, { passive: true });

  var trigger = document.body.classList.contains('hero-overlay') ? 64 : 10;
  var onScroll = function () { h.classList.toggle('scrolled', window.scrollY > trigger); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* Mobile nav -------------------------------------------------------------- */
(function () {
  var btn = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');
  if (!btn || !nav) return;
  var header = document.getElementById('siteHeader');
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    /* an open menu over a transparent header would stack links on the photo */
    if (header) header.classList.toggle('nav-open', open);
  });
})();
