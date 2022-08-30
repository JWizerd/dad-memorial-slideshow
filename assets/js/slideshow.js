function calculateTotalAudio () {
  let total = 0;
  for (song of document.getElementsByClassName('song')) {
    total += song.duration;
  }

  return total;
}

const IMG_COUNT = window.SLIDE_DATA.length;

const headline = document.getElementById('headline');
const initialHeadlineText = headline.innerText;
const songOne = document.getElementById('song-1');
const songTwo = document.getElementById('song-2');
const finalHeadlineText = "Finally at peace..."
const sliderOptions = {
  container: "#slider",
  items: 1,
  slideBy: 1,
  speed: 300,
  loop: false,
  nav: false,
  swipeAngle: false,
  arrowKeys: true,
  controlsPosition: 'bottom',
  controlsText: [
    '<i class="fa fa-chevron-left"></i>',
    '<i class="fa fa-chevron-right"></i>'
  ],
  onInit: () => {
    document.getElementById('slider').classList.remove('hidden');
  }
}

function appendImages(slideImages) {
  const slider = document.createElement('div');
  slider.classList.add('hidden');
  slider.id = 'slider';

  for (const slide of slideImages) {
    const slideItem = document.createElement('div');
    slideItem.className = 'item';

    const img = document.createElement('img');
    img.className = 'slide';
    img.src = slide.url;
    slideItem.appendChild(img);

    slider.appendChild(slideItem);
  }

  document.getElementById('slider-wrapper').appendChild(slider);
}

function showArrowBtns() {
  const arrowBtns = document.querySelectorAll('.tns-controls button');
  arrowBtns.forEach(btn => btn.classList.remove('hidden'));
}

function hideArrowBtns() {
  const arrowBtns = document.querySelectorAll('.tns-controls button');
  arrowBtns.forEach(btn => btn.classList.add('hidden'));
}

function hideButtons() {
  hideButton('slideshow');
  hideButton('loop');
  hideButton('sidenav-trigger')
  showButton('restart');
  hideArrowBtns();
}

function loopSlideshow(slider) {
  const LOOP_SLIDE_DURATION = 15 * 1000;
  slider.goTo(0);
  let idx = 1;

  setInterval(() => {
    slider.goTo(idx);
    idx++;

    if (idx === IMG_COUNT) {
      slider.goTo(0);
      idx = 1;
    }
  }, LOOP_SLIDE_DURATION);

  hideButtons();
}

function playSlideshow(slider) {
  const audio = document.getElementById("song-1");
  const TOTAL_AUDIO_DURATION = calculateTotalAudio();
  const SLIDE_DURATION = Math.floor(((TOTAL_AUDIO_DURATION / IMG_COUNT) * 1000));
  audio.play();
  slider.goTo(0);
  let idx = 1;
  const autoplay = setInterval(() => {
    slider.goTo(idx);
    idx++;

    // this check allows the last image to run for 2x DURATION
    // which allows for the final text to display longer
    if (idx === IMG_COUNT) clearInterval(autoplay)
  }, SLIDE_DURATION);

  hideButtons();
}

function restart() {
  location.reload();
}

function hideButton(id) {
  document.getElementById(id).classList.add('hide');
}

function showButton(id) {
  document.getElementById(id).classList.remove('hide');
}

function init(){
  let SLIDESHOW_STARTED = false;
  appendImages(window.SLIDE_DATA);
  const slider = tns(sliderOptions);
  document.getElementById('slideshow').addEventListener('click', () => playSlideshow(slider));
  document.getElementById('restart').addEventListener('click', restart);
  document.getElementById('loop').addEventListener('click', () => loopSlideshow(slider));
  document.querySelectorAll('.tns-controls button').forEach(btn => btn.addEventListener('click', () => {
    hideButton('slideshow');
    hideButton('loop');
    showButton('restart');
  }));
  document.body.addEventListener("keyup", function(e) {
    if (e.key == " " ||
        e.code == "Space"
    ) {
      if (SLIDESHOW_STARTED) {
        restart();
      } else {
        playSlideshow(slider);
        SLIDESHOW_STARTED = true;
      }
    }
  });

  songOne.onended = function() {
    songTwo.play();
  }

  songTwo.onended = function() {
    headline.innerText = finalHeadlineText;

    setTimeout(() => {
      restart();
    }, 10 * 1000);
  }
}

document.addEventListener('DOMContentLoaded', init);