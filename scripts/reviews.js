document.addEventListener('DOMContentLoaded', function () {
    setTimeout(initSwiper, 100);
    initExpandButtons();
    checkTextLength(); // Проверяем длину текста при загрузке
    
    // Добавляем обработчик изменения размера окна
    window.addEventListener('resize', handleResize);
});

// Функция для обработки изменения размера окна
function handleResize() {
    // Переинициализируем Swiper
    initSwiper();
    
    // Проверяем длину текста снова
    checkTextLength();
    
    // Сбрасываем состояние кнопок расширения
    resetExpandButtons();
}

function initSwiper() {
    // Уничтожаем существующий Swiper, если он есть
    if (this.swiperInstance) {
        this.swiperInstance.destroy();
    }
    
    this.swiperInstance = new Swiper('.m-reviews.swiper', {
        loop: false,
        centeredSlides: false,
        spaceBetween: 12,
        slidesPerView: 1,
        initialSlide: 1,
        slideToClickedSlide: true,
        breakpoints: {
            760: {
                centeredSlides: true,
                slidesPerView: 'auto',
                spaceBetween: 12
            }
        }
    });
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

// Новая функция для сброса состояния кнопок расширения
function resetExpandButtons() {
    document.querySelectorAll('.m-review-content').forEach(content => {
        content.classList.remove('expanded');
        const button = content.nextElementSibling;
        if (button && button.classList.contains('expand-button')) {
            button.classList.remove('hidden');
        }
    });
    
    // Проверяем длину текста снова
    checkTextLength();
}

function checkTextLength() {
    document.querySelectorAll('.m-review-content').forEach(content => {
        const button = content.nextElementSibling;
        if (!button || !button.classList.contains('expand-button')) return;

        const lineHeight = parseInt(getComputedStyle(content).lineHeight);
        const maxHeight = lineHeight * 5;

        if (content.scrollHeight <= maxHeight) {
            button.classList.add('hidden');
        } else {
            // Если текст был развернут, но теперь его длина меньше максимальной
            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
            }
        }
    });
}