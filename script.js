let currentPage = 0;
const totalPages = 2; // Update with the actual number of pages
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

function changePage(step) {
  currentPage += step;
  
  if (currentPage < 0) {
    currentPage = 0;
    return;
  }
  
  if (currentPage > totalPages) {
    currentPage = totalPages;
    return;
  }
  
  if (step === 1) {
    let rightPage = document.getElementById(`page-${currentPage * 2 - 1}`);
    let leftPage = document.getElementById(`page-${currentPage * 2}`);
    rightPage.style.animationTimingFunction = 'ease-in-out';
    rightPage.style.animationDuration = '2s';
    rightPage.style.animationName = 'flip-right';
    rightPage.style.transformOrigin = 'left';
    leftPage.style.animationTimingFunction = 'ease-in-out';
    leftPage.style.animationDuration = '2s';
    leftPage.style.animationName = 'flip-left';
    leftPage.style.transformOrigin = 'right';
    setTimeout(() => {
      rightPage.style.zIndex = 1;
      leftPage.style.zIndex = 2;
    }, 1000);
  }

  pageNumberElement.textContent = `Page ${currentPage + 1}`;
}