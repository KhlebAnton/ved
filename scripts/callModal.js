function initCallModal(modalId, triggerSelector) {
    const modalOverlay = document.getElementById(modalId);
    if (!modalOverlay) return;

    const modal = modalOverlay.querySelector('.m-modal');
    const closeButton = modalOverlay.querySelector('.m-modal-close');
    const submitButton = modalOverlay.querySelector('.m-btn.t-color-accent');

    const nameInput = modalOverlay.querySelector('input[name="name"]');
    const contactInput = modalOverlay.querySelector('input[name="contact"]');
    const commentInput = modalOverlay.querySelector('textarea[name="comment"]');

    // Очистка формы
    function clearForm() {
        [nameInput, contactInput, commentInput].forEach(el => {
            if (el) el.value = '';
        });
        modalOverlay.querySelectorAll('.t-label-error').forEach(el => el.classList.remove('t-label-error'));
    }

    // Открытие
    function open() {
        modalOverlay.classList.add('is-open');
        modal.classList.add('is-open');
        clearForm();
        closeMenu();
        toggleNoScroll()
    }

    // Закрытие
    function close() {
        modalOverlay.classList.remove('is-open');
        modal.classList.remove('is-open');
        toggleNoScroll()
    }

    // Обработка отправки
    submitButton.addEventListener('click', () => {
        let valid = true;

        modalOverlay.querySelectorAll('.t-label-error').forEach(el => el.classList.remove('t-label-error'));

        if (!contactInput.value.trim()) {
            contactInput.closest('.m-calculator-label')?.classList.add('t-label-error');
            valid = false;
        }

        if (!nameInput.value.trim()) {
            nameInput.closest('.m-calculator-label')?.classList.add('t-label-error');
            valid = false;
        }

        if (!valid) return;

        const data = {
            name: nameInput.value.trim(),
            contact: contactInput.value.trim(),
            comment: commentInput.value.trim(),
        };

        console.log('Данные заявки на звонок:', data);

        close();

        successModal.open();
    });

    // Закрытие по крестику
    if (closeButton) {
        closeButton.addEventListener('click', close);
    }

    // Закрытие по клику вне окна
    modalOverlay.addEventListener('click', (e) => {
        if (!modal.contains(e.target)) close();
    });

    // Привязка ко всем кнопкам-триггерам
    document.querySelectorAll(triggerSelector).forEach(btn => {
        btn.addEventListener('click', open);
    });

    return { open, close };
}
initCallModal('modalCall', '[data-click="call"]');
