function initSuccessModal(modalId) {
    const modalOverlay = document.getElementById(modalId);
    if (!modalOverlay) return;

    const modal = modalOverlay.querySelector('.m-modal');
    const closeButton = modalOverlay.querySelector('.m-modal-close');

    // Открыть модалку
    function open() {
        modalOverlay.classList.add('is-open');
        modal.classList.add('is-open');
        toggleNoScroll()
    }

    // Закрыть модалку
    function close() {
        modalOverlay.classList.remove('is-open');
        modal.classList.remove('is-open');
        toggleNoScroll()
    }

    // Закрытие по крестику
    if (closeButton) {
        closeButton.addEventListener('click', close);
    }

    // Закрытие по клику вне модалки
    modalOverlay.addEventListener('click', (e) => {
        if (!modal.contains(e.target)) {
            close();
        }
    });

    return { open, close };
}

const successModal = initSuccessModal('modalSuccess');



