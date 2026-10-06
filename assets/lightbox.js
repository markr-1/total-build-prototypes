/* Lightbox: click any photo inside a [data-gallery] to see it full screen,
   then flip through that gallery with the arrows, arrow keys, or a swipe.
   Self-contained: needs only the .lb styles in site.css. */
(function () {
  var galleries = document.querySelectorAll('[data-gallery]');
  if (!galleries.length) { return; }

  var box = document.createElement('div');
  box.className = 'lb';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Photo viewer');
  box.innerHTML =
    '<img class="lb__img" alt="">' +
    '<button class="lb__close" type="button" aria-label="Close">&times;</button>' +
    '<button class="lb__prev" type="button" aria-label="Previous photo">&#8249;</button>' +
    '<button class="lb__next" type="button" aria-label="Next photo">&#8250;</button>' +
    '<p class="lb__count" aria-live="polite"></p>';
  document.body.appendChild(box);

  var img = box.querySelector('.lb__img');
  var count = box.querySelector('.lb__count');
  var list = [], index = 0, opener = null;

  function show() {
    var src = list[index];
    img.src = src.currentSrc || src.src;
    img.alt = src.alt;
    count.textContent = (index + 1) + ' / ' + list.length;
  }
  function open(gallery, photo) {
    list = Array.prototype.slice.call(gallery.querySelectorAll('img'));
    index = list.indexOf(photo);
    opener = photo;
    show();
    box.classList.add('is-open');
    document.body.classList.add('lb-lock');
    box.querySelector('.lb__close').focus();
  }
  function close() {
    box.classList.remove('is-open');
    document.body.classList.remove('lb-lock');
    if (opener) { opener.focus(); }
  }
  function step(d) { index = (index + d + list.length) % list.length; show(); }

  Array.prototype.forEach.call(galleries, function (gallery) {
    Array.prototype.forEach.call(gallery.querySelectorAll('img'), function (photo) {
      photo.tabIndex = 0;
      photo.setAttribute('role', 'button');
      photo.addEventListener('click', function () { open(gallery, photo); });
      photo.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(gallery, photo); }
      });
    });
  });

  box.querySelector('.lb__close').addEventListener('click', close);
  box.querySelector('.lb__prev').addEventListener('click', function () { step(-1); });
  box.querySelector('.lb__next').addEventListener('click', function () { step(1); });
  box.addEventListener('click', function (e) { if (e.target === box) { close(); } });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('is-open')) { return; }
    if (e.key === 'Escape') { close(); }
    else if (e.key === 'ArrowLeft') { step(-1); }
    else if (e.key === 'ArrowRight') { step(1); }
  });

  var startX = null;
  box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (startX === null) { return; }
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { step(dx < 0 ? 1 : -1); }
    startX = null;
  });
})();
