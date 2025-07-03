document.addEventListener("DOMContentLoaded", () => {
    const portfolioSliderEl = document.querySelector(".m-portfolio-slider");
    const swiperWrapper = portfolioSliderEl.querySelector(".swiper-wrapper");
    const btnPrev = document.querySelector(".m-portfolio-btn-prev");
    const btnNext = document.querySelector(".m-portfolio-btn-next");
    const progressBar = document.querySelector(".m-portfolio-progressbar .progress");
    const currentCounter = document.querySelector(".m-portfolio-counter .current");
    const totalCounter = document.querySelector(".m-portfolio-counter .total");

    const tabs = document.querySelectorAll(".m-portfolio-tab");
    const allSlidesOriginal = Array.from(swiperWrapper.children);

    let portfolioSwiper;
    let innerSwipers = [];

    function initPortfolioSwiper() {
        if (portfolioSwiper) portfolioSwiper.destroy(true, true);

        portfolioSwiper = new Swiper(portfolioSliderEl, {
            slidesPerView: 1,
            spaceBetween: 40,
            effect: 'fade',
            fadeEffect: {
                crossFade: true,
            },
            loop: false,
            navigation: {
                nextEl: btnNext,
                prevEl: btnPrev,
            },
            on: {
                slideChangeTransitionEnd() {
                    updateCounterAndProgress();
                    initInnerSliders();
                },
            },
        });
    }

    function initInnerSliders() {
        innerSwipers.forEach(swiper => swiper.destroy(true, true));
        innerSwipers = [];

        portfolioSwiper.slides.forEach(slide => {
            const sliderEl = slide.querySelector(".m-image-slider");
            if (!sliderEl) return;

            const innerSlides = sliderEl.querySelectorAll(".swiper-slide");
            const slidesCount = innerSlides.length;
            const minimumNeededForLoop = 3;

            const innerSwiper = new Swiper(sliderEl, {
                slidesPerView: "auto",
                spaceBetween: 0,
                centeredSlides: false,
                watchOverflow: true,
                loop: slidesCount >= minimumNeededForLoop,
                allowTouchMove: false,
                autoplay: {
                    delay: 1000,
                    disableOnInteraction: false,
                },
                speed: 2000,
            });


            innerSwipers.push(innerSwiper);
        });
    }

    function updateCounterAndProgress() {
        const total = portfolioSwiper.slides.length;
        const current = portfolioSwiper.activeIndex;

        currentCounter.textContent = current + 1;
        totalCounter.textContent = total;

        const progress = total > 1 ? (current / (total - 1)) * 100 : 0;
        progressBar.style.width = progress + "%";
    }

    function filterSlides(selectedTab) {
        // Очищаем wrapper
        swiperWrapper.innerHTML = "";

        // Клонируем и добавляем только нужные слайды
        const filteredSlides = selectedTab === "all"
            ? allSlidesOriginal
            : allSlidesOriginal.filter(slide => slide.dataset.tab === selectedTab);

        filteredSlides.forEach(slide => {
            swiperWrapper.appendChild(slide.cloneNode(true));
        });

        if (portfolioSwiper) {
            portfolioSwiper.update();
            portfolioSwiper.slideTo(0, 0);
        }

        updateCounterAndProgress();
        initInnerSliders();
    }

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("is-active"));
            tab.classList.add("is-active");

            filterSlides(tab.dataset.tab);
        });
    });

    initPortfolioSwiper();

    // Активируем вкладку "all" при загрузке страницы
    const allTab = document.querySelector('.m-portfolio-tab[data-tab="all"]');
    if (allTab) allTab.click();
});
