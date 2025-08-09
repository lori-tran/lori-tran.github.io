class BookViewer {
  constructor() {
    this.currentSpread = 0;
    this.totalSpreads = 8;
    this.isAnimating = false;
    this.book = document.getElementById('book');
    this.pageNumberElement = document.getElementById('page-number');
    
    this.init();
  }
  
  init() {
    // Set up initial page positions
    this.setupInitialPageStates();
    
    // Event listeners
    document.getElementById('prev-page').addEventListener('click', () => this.changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => this.changePage(1));
    
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        this.changePage(-1);
      } else if (event.key === 'ArrowRight') {
        this.changePage(1);
      }
    });
    
    // Resize handler
    window.addEventListener('resize', () => this.adjustZoom());
    this.adjustZoom();
    
    // Update initial UI
    this.updateUI();
  }
  
  setupInitialPageStates() {
    for (let i = 0; i <= this.totalSpreads * 2 + 1; i++) {
      const page = document.getElementById(`page-${i}`);
      if (page) {
        page.classList.remove('flip-right', 'flip-left', 'flip-right-back', 'flip-left-back', 'flip-left-initial');
        
        // Set initial z-index based on spread position
        const spread = Math.floor(i / 2);
        page.style.zIndex = this.totalSpreads - spread;
        
        // Hide pages that should be flipped initially
        if (i > 1) {
          if (i % 2 === 0) {
            // Left pages after first spread should be hidden behind
            page.style.zIndex = -(this.totalSpreads - spread);
          } else {
            // Right pages after first spread start flipped
            page.classList.add('flip-left-initial');
          }
        }
      }
    }
  }
  
  changePage(direction) {
    if (this.isAnimating) return;
    
    const newSpread = this.currentSpread + direction;
    if (newSpread < 0 || newSpread > this.totalSpreads) return;
    
    this.isAnimating = true;
    
    if (direction === 1) {
      this.turnPageForward();
    } else {
      this.turnPageBackward();
    }
    
    this.currentSpread = newSpread;
    
    // Animation complete after transition duration
    setTimeout(() => {
      this.isAnimating = false;
      this.updateZIndices();
    }, 800);
    
    this.updateUI();
  }
  
  turnPageForward() {
    const currentLeftPage = document.getElementById(`page-${this.currentSpread * 2}`);
    const currentRightPage = document.getElementById(`page-${this.currentSpread * 2 + 1}`);
    const nextLeftPage = document.getElementById(`page-${this.currentSpread * 2 + 2}`);
    
    if (currentRightPage) {
      currentRightPage.classList.add('flipping', 'flip-right');
    }
    
    if (nextLeftPage) {
      nextLeftPage.classList.remove('flip-left-initial');
      nextLeftPage.classList.add('flipping', 'flip-left');
    }
    
    // Clean up classes after animation
    setTimeout(() => {
      if (currentRightPage) {
        currentRightPage.classList.remove('flipping');
      }
      if (nextLeftPage) {
        nextLeftPage.classList.remove('flipping');
      }
    }, 800);
  }
  
  turnPageBackward() {
    const currentLeftPage = document.getElementById(`page-${this.currentSpread * 2}`);
    const prevRightPage = document.getElementById(`page-${this.currentSpread * 2 - 1}`);
    
    if (currentLeftPage) {
      currentLeftPage.classList.add('flipping', 'flip-left-back');
    }
    
    if (prevRightPage) {
      prevRightPage.classList.remove('flip-right');
      prevRightPage.classList.add('flipping', 'flip-right-back');
    }
    
    // Clean up classes after animation
    setTimeout(() => {
      if (currentLeftPage) {
        currentLeftPage.classList.remove('flipping');
        currentLeftPage.classList.add('flip-left-initial');
      }
      if (prevRightPage) {
        prevRightPage.classList.remove('flipping', 'flip-right-back');
      }
    }, 800);
  }
  
  updateZIndices() {
    // Ensure proper stacking order after animation
    for (let i = 0; i <= this.totalSpreads * 2 + 1; i++) {
      const page = document.getElementById(`page-${i}`);
      if (page) {
        const spread = Math.floor(i / 2);
        if (spread <= this.currentSpread) {
          if (i % 2 === 0) {
            // Left pages that have been turned
            page.style.zIndex = -(this.totalSpreads - spread);
          } else {
            // Right pages that have been turned
            page.style.zIndex = -(this.totalSpreads - spread);
          }
        } else {
          // Pages that haven't been reached yet
          page.style.zIndex = this.totalSpreads - spread;
        }
      }
    }
  }
  
  updateUI() {
    this.pageNumberElement.textContent = `Page ${this.currentSpread + 1}`;
    
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    
    prevButton.style.visibility = this.currentSpread === 0 ? 'hidden' : 'visible';
    nextButton.style.visibility = this.currentSpread === this.totalSpreads ? 'hidden' : 'visible';
  }
  
  adjustZoom() {
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
}

// Initialize the book viewer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BookViewer();
});