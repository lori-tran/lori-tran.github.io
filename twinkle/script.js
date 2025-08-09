let currentSpread = 0;
const totalSpreads = 8; // Update with the actual number of spreads
const book = document.getElementById('book');
const pageNumberElement = document.getElementById('page-number');

document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
document.getElementById('next-page').addEventListener('click', () => changePage(1));

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    changePage(-1);
  } else if (event.key === 'ArrowRight') {
    changePage(1);
  }
});

var preventTurning = false;
var preventTurningForwards = false;
var preventTurningBackwards = false;
function changePage(step) {
  if ((currentSpread === 0 && step === -1) ||
      (currentSpread === totalSpreads && step === 1) ||
      preventTurning ||
      (preventTurningForwards && step === 1) ||
      (preventTurningBackwards && step === -1)) {
    return;
  }
  preventTurning = true;
  
  if (step === 1) {
    preventTurningBackwards = true;
    let leftPage = document.getElementById(`page-${currentSpread * 2}`);
    let rightPage = document.getElementById(`page-${currentSpread * 2 + 1}`);
    let nextLeftPage = document.getElementById(`page-${currentSpread * 2 + 2}`);
    rightPage.style.animationName = 'flip-right';
    rightPage.style.transformOrigin = 'left';
    nextLeftPage.style.animationName = 'flip-left';
    nextLeftPage.style.transformOrigin = 'right';
    setTimeout(() => {
      rightPage.style.zIndex *= -1;
      nextLeftPage.style.zIndex = parseInt(nextLeftPage.style.zIndex) + 100;
      preventTurning = false;
    }, 1000);
    setTimeout(() => {
      leftPage.style.zIndex *= -1;
      nextLeftPage.style.zIndex -= 100;
      if (!preventTurning) {
        preventTurningBackwards = false;
      }
    }, 2000);
  } else if (step === -1) {
    preventTurningForwards = true;
    let leftPage = document.getElementById(`page-${currentSpread * 2}`);
    let prevRightPage = document.getElementById(`page-${currentSpread * 2 - 1}`);
    let prevLeftPage = document.getElementById(`page-${currentSpread * 2 - 2}`);
    leftPage.style.animationName = 'flip-left-back';
    leftPage.style.transformOrigin = 'right';
    prevRightPage.style.animationName = 'flip-right-back';
    prevRightPage.style.transformOrigin = 'left';
    leftPage.style.zIndex = parseInt(leftPage.style.zIndex) + 100;
    prevLeftPage.style.zIndex *= -1;
    setTimeout(() => {
      leftPage.style.zIndex -= 100;
      prevRightPage.style.zIndex *= -1;
      preventTurning = false;
    }, 1000);
    setTimeout(() => {
      if (!preventTurning) {
        preventTurningForwards = false;
      }
    }, 2000);
  }

  currentSpread += step;

  pageNumberElement.textContent = `Page ${currentSpread + 1}`;
  
  if (currentSpread === 0) {
    document.getElementById('prev-page').style.visibility = 'hidden';
  } else {
    document.getElementById('prev-page').style.visibility = 'visible';
  }
  if (currentSpread === totalSpreads) {
    document.getElementById('next-page').style.visibility = 'hidden';
  } else {
    document.getElementById('next-page').style.visibility = 'visible';
  }
}


window.addEventListener('resize', adjustZoom);

function adjustZoom() {
  const minWidth = 1116;
  const minHeight = 850;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  let zoomLevel = 1;

  if (windowWidth < minWidth || windowHeight < minHeight) {
    const widthRatio = windowWidth / minWidth;
    const heightRatio = windowHeight / minHeight;

    zoomLevel = Math.min(widthRatio, heightRatio);
  }

  document.body.style.zoom = zoomLevel;
}

adjustZoom();