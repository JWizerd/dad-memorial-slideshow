function createGridItems() {
  const grid = document.createElement('div');
  grid.id = 'gallery';

  for (const slide of window.SLIDE_DATA) {
    const galleryItem = document.createElement('a');
    galleryItem.className = 'gallery-item';
    galleryItem.href = slide.url;
    galleryItem.dataset.pswpWidth = slide.width;
    galleryItem.dataset.pswpHeight = slide.height;

    const img = document.createElement('img');
    img.className = 'gallery-img';
    img.src = slide.url;
    galleryItem.appendChild(img);

    grid.appendChild(galleryItem);
  }

  document.getElementById('gallery-wrapper').appendChild(grid);
}

function init() {
  createGridItems();
  var lightbox = new PhotoSwipeLightbox({
    gallery: '#gallery',
    children: 'a',
    // dynamic import is not supported in UMD version
    pswpModule: PhotoSwipe
  });
  lightbox.init();
}

document.addEventListener('DOMContentLoaded', init);