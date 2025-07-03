document.addEventListener('DOMContentLoaded', function () {
    setTimeout(initSwiper, 100);
    initExpandButtons();
    checkTextLength(); // Проверяем длину текста при загрузке
});

function initSwiper() {
    try {
        const swiper = new Swiper('.m-reviews.swiper', {
            loop: false,
            centeredSlides: true,
            spaceBetween: 12,
            slidesPerView: 'auto',
            initialSlide: 1,
            slideToClickedSlide: true,
        });
        window.addEventListener('resize', function () {
            swiper.update();
        });
    } catch (e) {
        console.error('Swiper error:', e);
    }

}

function initExpandButtons() {
    document.querySelectorAll('.expand-button').forEach(button => {
        button.addEventListener('click', function () {
            const content = this.previousElementSibling;
            if (!content) return;

            content.classList.add('expanded');
            this.classList.add('hidden');

            const slide = this.closest('.swiper-slide');
            if (slide) {
                slide.style.height = 'auto';
            }
        });
    });
}

function checkTextLength() {
    document.querySelectorAll('.m-review-content').forEach(content => {
        const button = content.nextElementSibling;
        if (!button || !button.classList.contains('expand-button')) return;

        const lineHeight = parseInt(getComputedStyle(content).lineHeight);
        const maxHeight = lineHeight * 5;

        if (content.scrollHeight <= maxHeight) {
            button.classList.add('hidden');
        }
    });
}
