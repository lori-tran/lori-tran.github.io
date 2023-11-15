let currentPage = 1;
const totalPages = 3; // Update with the actual number of pages
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
  
  if (currentPage < 1) {
    currentPage = 1;
    return;
  }
  
  if (currentPage > totalPages) {
    currentPage = totalPages;
    return;
  }
  
  const newPageElement = document.getElementById(`book-spread-${currentPage}`);
  const oldPageElement = document.querySelector('.book-spread:not([style*="display: none"])');

  if (newPageElement) {
    if (oldPageElement) {
      oldPageElement.style.display = 'none';
    }
    newPageElement.style.display = 'block';
    pageNumberElement.textContent = `Page ${currentPage}`;
  }
}
