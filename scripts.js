document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.querySelector('.slider-container');
    if (!sliderContainer) return;

    const track = sliderContainer.querySelector('.slider-track');
    const slides = Array.from(track.children);
    const pagination = sliderContainer.querySelector('.slider-pagination');
    const sliderViewport = sliderContainer.querySelector('.slider-viewport');
    
    if (!track || !slides.length || !pagination || !sliderViewport) return;

    let currentIndex = 0;
    let slideWidth = 0;
    
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    
    function initializeSlider() {
        updateSlideWidth();
        createPagination();
        addEventListeners();
        goToSlide(0);
    }

    function updateSlideWidth() {
        slideWidth = sliderViewport.getBoundingClientRect().width;
    }

    function createPagination() {
        pagination.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('pagination-dot');
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            pagination.appendChild(dot);
        });
        updateActiveDot();
    }

    function addEventListeners() {
        sliderViewport.addEventListener('mousedown', dragStart);
        sliderViewport.addEventListener('touchstart', dragStart, { passive: true });
        sliderViewport.addEventListener('mouseup', dragEnd);
        sliderViewport.addEventListener('mouseleave', dragEnd);
        sliderViewport.addEventListener('touchend', dragEnd);
        sliderViewport.addEventListener('mousemove', drag);
        sliderViewport.addEventListener('touchmove', drag, { passive: true });
        window.addEventListener('resize', onResize);
    }
    
    function onResize() {
        updateSlideWidth();
        track.style.transition = 'none';
        goToSlide(currentIndex);
        setTimeout(() => {
            track.style.transition = 'transform 0.4s ease-out';
        }, 50);
    }

    function dragStart(event) {
        isDragging = true;
        startPos = getPositionX(event);
        sliderViewport.classList.add('grabbing');
        track.style.transition = 'none';
    }

    function drag(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startPos;
            setSliderPosition();
        }
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        const movedBy = currentTranslate - prevTranslate;
        
        if (movedBy < -50 && currentIndex < slides.length - 1) {
            currentIndex += 1;
        }
        if (movedBy > 50 && currentIndex > 0) {
            currentIndex -= 1;
        }

        track.style.transition = 'transform 0.4s ease-out';
        goToSlide(currentIndex);
        sliderViewport.classList.remove('grabbing');
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function setSliderPosition() {
        track.style.transform = `translateX(${currentTranslate}px)`;
    }
    
    function goToSlide(index) {
        currentTranslate = index * -slideWidth;
        prevTranslate = currentTranslate;
        currentIndex = index;
        setSliderPosition();
        updateActiveDot();
    }
    
    function updateActiveDot() {
        const dots = pagination.children;
        Array.from(dots).forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    initializeSlider();
});