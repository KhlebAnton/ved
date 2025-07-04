const faqItems = document.querySelectorAll('.m-faq');

faqItems.forEach(faq=> {
    faq.addEventListener('click',(e)=> {
        const isOpen = faq.querySelector('.m-faq-icon').classList.contains('is-open');

        closeAllFaq();
        
        if (!isOpen) {
            faq.querySelector('.m-faq-icon').classList.add('is-open');
            faq.querySelector('.m-faq-hidden-text').classList.add('is-open');
        }
    })
});

function closeAllFaq() {
    faqItems.forEach(faq => {
        faq.querySelector('.m-faq-icon').classList.remove('is-open');
        faq.querySelector('.m-faq-hidden-text').classList.remove('is-open');
    })
}