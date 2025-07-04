document.addEventListener('DOMContentLoaded', function () {
    // Обработка первого dropdown (тип события)
    const eventTypeDropdown = document.getElementById('dropDownType');
    const eventTypeSelected = eventTypeDropdown.querySelector('.m-calculator-dropdown-selected');
    const eventTypeList = eventTypeDropdown.querySelector('.m-calculator-dropdown-list');
    const eventTypeItems = eventTypeDropdown.querySelectorAll('.m-calculator-dropdown-list-item');

    // Обработка dropdown с датой
    const dateDropdown = document.getElementById('dateDropdown');
    const dateSelected = dateDropdown.querySelector('.m-calculator-dropdown-selected');
    const datePicker = dateDropdown.querySelector('.m-datepicker');
    const datePrevBtn = dateDropdown.querySelector('.m-datepicker-prev');
    const dateNextBtn = dateDropdown.querySelector('.m-datepicker-next');
    const dateTitle = dateDropdown.querySelector('.m-datepicker-title');
    const dateDaysContainer = dateDropdown.querySelector('.m-datepicker-days');

    // Инициализация dropdown типа события
    function initEventTypeDropdown() {
        // Открытие/закрытие списка при клике
        eventTypeDropdown.addEventListener('click', function (e) {
            e.stopPropagation();
            eventTypeList.classList.toggle('is-open');
        });

        // Выбор элемента из списка
        eventTypeItems.forEach(item => {
            item.addEventListener('click', function (e) {
                e.stopPropagation();
                eventTypeItems.forEach(i => i.classList.remove('is-active'));
                this.classList.add('is-active');
                eventTypeSelected.textContent = this.textContent;
                eventTypeList.classList.remove('is-open');
            });
        });

        // Закрытие списка при клике вне его
        document.addEventListener('click', function () {
            eventTypeList.classList.remove('is-open');
        });
    }

    // Инициализация datepicker
    function initDatePicker() {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        renderCalendar(currentMonth, currentYear);

        // Навигация по месяцам
        datePrevBtn.addEventListener('click', () => {
            if (datePrevBtn.disabled) return;
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar(currentMonth, currentYear);
        });

        dateNextBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar(currentMonth, currentYear);
        });

        // Открытие/закрытие datepicker
        dateDropdown.addEventListener('click', function (e) {
            if (!datePicker.contains(e.target)) {
                e.stopPropagation();
                datePicker.classList.toggle('is-open');
            }
        });

        // Закрытие при клике вне
        document.addEventListener('click', function (e) {
            if (!dateDropdown.contains(e.target)) {
                datePicker.classList.remove('is-open');
            }
        });
    }

    // Рендер календаря
    function renderCalendar(month, year) {
        const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
            "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
        dateTitle.textContent = `${monthNames[month]} ${year}`;

        dateDaysContainer.innerHTML = '';

        const firstDay = new Date(year, month, 1).getDay() || 7;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // Пустые ячейки для дней предыдущего месяца
        for (let i = 1; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'm-datepicker-day is-disabled';
            dateDaysContainer.appendChild(emptyDay);
        }

        // Дни текущего месяца
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'm-datepicker-day';
            dayElement.textContent = day;

            // Блокировка прошедших дней и сегодня
            if ((year < currentYear) ||
                (year === currentYear && month < currentMonth) ||
                (year === currentYear && month === currentMonth && day < currentDay)) {
                dayElement.classList.add('is-disabled');
            } else if (year === currentYear && month === currentMonth && day === currentDay) {
                dayElement.classList.add('is-today');
            }

            // Обработчик выбора дня
            dayElement.addEventListener('click', function () {
                if (!this.classList.contains('is-disabled')) {
                    document.querySelectorAll('.m-datepicker-day').forEach(d => {
                        d.classList.remove('is-selected');
                    });

                    this.classList.add('is-selected');

                    const selectedDate = new Date(year, month, day);
                    const formattedDate = selectedDate.toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    });
                    dateSelected.textContent = formattedDate;

                    datePicker.classList.remove('is-open');
                }
            });

            dateDaysContainer.appendChild(dayElement);
        }

        // Блокировка кнопки "назад" для текущего месяца
        datePrevBtn.disabled = (month === currentMonth && year === currentYear);
    }

    // Инициализация всех компонентов
    initEventTypeDropdown();
    initDatePicker();

    // Инициализация timepicker'ов
    const startTimePicker = initTimePicker('startTimeDropdown', 'Начало');
    const endTimePicker = initTimePicker('endTimeDropdown', 'Конец');

    function initTimePicker(dropdownId, defaultText) {
        const dropdown = document.getElementById(dropdownId);
        const selected = dropdown.querySelector('.m-calculator-dropdown-selected');
        const timepicker = dropdown.querySelector('.m-timepicker');
        const hourInput = timepicker.querySelector('.hour');
        const minuteInput = timepicker.querySelector('.minute');
        const hourUp = timepicker.querySelector('[data-action="increment-hour"]');
        const hourDown = timepicker.querySelector('[data-action="decrement-hour"]');
        const minuteUp = timepicker.querySelector('[data-action="increment-minute"]');
        const minuteDown = timepicker.querySelector('[data-action="decrement-minute"]');
        const cancelBtn = timepicker.querySelector('.cancel');
        const applyBtn = timepicker.querySelector('.apply');

        let currentHours = null;
        let currentMinutes = null;
        let isProcessing = false;

        // Обновление состояния стрелок с проверкой минимальной разницы
        function updateArrows() {
            const hours = parseInt(hourInput.value) || 0;
            const minutes = parseInt(minuteInput.value) || 0;

            // Базовые ограничения
            hourUp.disabled = hours >= 23;
            hourDown.disabled = hours <= 0;
            minuteUp.disabled = minutes >= 59;
            minuteDown.disabled = minutes <= 0;

            // Дополнительные ограничения для времени окончания
            if (dropdownId === 'endTimeDropdown') {
                const startTime = startTimePicker.getTime();
                if (startTime) {
                    const currentValue = parseInt(hourInput.value || 0) * 60 + parseInt(minuteInput.value || 0);

                    // Только если значение меньше времени начала
                    if (currentValue <= startTime) {
                        // Устанавливаем время начала +30 минут
                        const newTime = startTime + 30;
                        const newHours = Math.min(23, Math.floor(newTime / 60));
                        const newMinutes = newTime % 60;

                        hourInput.value = newHours.toString().padStart(2, '0');
                        minuteInput.value = newMinutes.toString().padStart(2, '0');
                    }
                }
            }
        }

        // Обработчик изменения значения
        function changeValue(input, change) {
            if (isProcessing) return;
            isProcessing = true;

            let value = parseInt(input.value) || 0;
            const max = input === hourInput ? 23 : 59;
            value += change;

            if (value < 0) value = 0;
            if (value > max) value = max;

            input.value = value.toString().padStart(2, '0');
            updateArrows();

            setTimeout(() => { isProcessing = false; }, 100);
        }

        // Назначение обработчиков
        hourUp.addEventListener('click', () => changeValue(hourInput, 1));
        hourDown.addEventListener('click', () => changeValue(hourInput, -1));
        minuteUp.addEventListener('click', () => changeValue(minuteInput, 1));
        minuteDown.addEventListener('click', () => changeValue(minuteInput, -1));

        // Валидация ввода
        [hourInput, minuteInput].forEach(input => {
            let lastValidValue = '00';

            // При фокусе запоминаем текущее значение
            input.addEventListener('focus', function () {
                lastValidValue = this.value;
                this.value = this.value === '00' ? '' : this.value;
            });

            // При вводе разрешаем любые цифры
            input.addEventListener('input', function () {
                // Разрешаем ввод только цифр
                let value = this.value.replace(/\D/g, '');

                // Ограничиваем до 2 цифр
                if (value.length > 2) {
                    value = value.slice(0, 2);
                }

                // Для часов проверяем максимум 23
                if (this.classList.contains('hour') && value.length === 2) {
                    const numValue = parseInt(value);
                    if (numValue > 23) {
                        value = '23';
                    }
                }

                // Для минут проверяем максимум 59
                if (this.classList.contains('minute') && value.length === 2) {
                    const numValue = parseInt(value);
                    if (numValue > 59) {
                        value = '59';
                    }
                }

                this.value = value;
                updateArrows();
            });

            // При потере фокуса форматируем значение
            input.addEventListener('blur', function () {
                let value = this.value;

                // Если поле пустое - восстанавливаем предыдущее значение
                if (value === '') {
                    value = lastValidValue;
                }

                // Форматируем в 2 цифры с ведущим нулем
                value = value.padStart(2, '0');

                // Для времени окончания делаем дополнительную проверку
                if (dropdownId === 'endTimeDropdown') {
                    const startTime = startTimePicker.getTime();
                    if (startTime) {
                        const hours = parseInt(hourInput.value) || 0;
                        const minutes = parseInt(minuteInput.value) || 0;
                        const endTime = hours * 60 + minutes;

                        if (endTime <= startTime) {
                            // Автоматически устанавливаем время начала + 30 минут
                            const newTime = startTime + 30;
                            hourInput.value = Math.min(23, Math.floor(newTime / 60)).toString().padStart(2, '0');
                            minuteInput.value = (newTime % 60).toString().padStart(2, '0');
                            value = this.classList.contains('hour') ? hourInput.value : minuteInput.value;
                        }
                    }
                }

                this.value = value;
                updateArrows();
            });
        });

        // Кнопка "Назад"
        cancelBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (currentHours !== null && currentMinutes !== null) {
                hourInput.value = currentHours.toString().padStart(2, '0');
                minuteInput.value = currentMinutes.toString().padStart(2, '0');
            }
            timepicker.classList.remove('is-open');
            updateArrows();
        });

        // Кнопка "Принять"
        applyBtn.addEventListener('click', function (e) {
            e.stopPropagation();

            // Проверка минимальной разницы для времени окончания
            if (dropdownId === 'endTimeDropdown') {
                const startTime = startTimePicker.getTime();
                const endTime = parseInt(hourInput.value) * 60 + parseInt(minuteInput.value);

                if (startTime && endTime <= startTime) {
                    alert('Время окончания должно быть позже времени начала');
                    return;
                }
            }

            currentHours = parseInt(hourInput.value);
            currentMinutes = parseInt(minuteInput.value);
            selected.textContent = `${hourInput.value.padStart(2, '0')}:${minuteInput.value.padStart(2, '0')}`;
            timepicker.classList.remove('is-open');

            // Сброс времени окончания при изменении начала
            if (dropdownId === 'startTimeDropdown') {
                endTimePicker.resetTime();
            }
        });

        // Сброс времени
        function resetTime() {
            hourInput.value = '00';
            minuteInput.value = '00';
            selected.textContent = defaultText;
            currentHours = null;
            currentMinutes = null;
            updateArrows();
        }

        // Открытие timepicker
        dropdown.addEventListener('click', function (e) {
            if (!timepicker.contains(e.target)) {
                e.stopPropagation();
                closeOtherDropdowns(dropdown);
                timepicker.classList.add('is-open');

                if (selected.textContent !== defaultText) {
                    const timeParts = selected.textContent.split(':');
                    if (timeParts.length === 2) {
                        currentHours = parseInt(timeParts[0]);
                        currentMinutes = parseInt(timeParts[1]);
                        hourInput.value = timeParts[0].padStart(2, '0');
                        minuteInput.value = timeParts[1].padStart(2, '0');
                    }
                }
                updateArrows();
            }
        });

        return {
            element: dropdown,
            hourInput,
            minuteInput,
            resetTime,
            getTime: () => {
                const h = parseInt(hourInput.value);
                const m = parseInt(minuteInput.value);
                return !isNaN(h) && !isNaN(m) ? h * 60 + m : null;
            }
        };
    }

    // Закрытие dropdown'ов при клике вне
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.t-label-dropdown')) {
            document.querySelectorAll('.m-timepicker').forEach(el => {
                el.classList.remove('is-open');
            });
        }
    });

    function closeOtherDropdowns(currentDropdown) {
        document.querySelectorAll('.t-label-dropdown').forEach(dropdown => {
            if (dropdown !== currentDropdown) {
                const picker = dropdown.querySelector('.m-timepicker');
                if (picker) picker.classList.remove('is-open');
            }
        });
    }

    // шаг 3
    const step3 = document.querySelector('.m-calculator-step[data-step="3"]');
    const addItems = step3.querySelectorAll('.m-calculator-add-item');

    addItems.forEach(item => {
        const top = item.querySelector('.m-calculator-add-item-top');
        const hidden = item.querySelector('.m-calculator-add-item-hidden');
        const title = top.querySelector('.m-calculator-add-item-title');
        const radios = item.querySelectorAll('input[type="radio"]');
        const cancelButton = item.querySelector('.m-btn.t-btn-white');

        // Обработчик клика по заголовку
        top.addEventListener('click', function (e) {
            if (!e.target.closest('input[type="radio"]')) {
                const isOpen = hidden.classList.contains('is-open');

                // Закрываем все блоки
                addItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherTop = otherItem.querySelector('.m-calculator-add-item-top');
                        const otherHidden = otherItem.querySelector('.m-calculator-add-item-hidden');
                        otherHidden.classList.remove('is-open');
                        otherTop.classList.remove('is-open');
                    }
                });

                // Тогглим текущий
                hidden.classList.toggle('is-open', !isOpen);
                top.classList.toggle('is-open', !isOpen);
            }
        });


        // Обработка радиокнопок
        radios.forEach(radio => {
            radio.addEventListener('change', function (e) {
                // Удаляем выделения со всех
                radios.forEach(rb => {
                    const marker = rb.closest('label')?.querySelector('.radio-marker');
                    if (marker) marker.classList.remove('checked');
                });

                // Отмечаем выбранный
                const marker = this.closest('label')?.querySelector('.radio-marker');
                if (marker) marker.classList.add('checked');

                title.classList.add('t-checked');

                // Показываем кнопку "Отказаться"
                if (cancelButton) cancelButton.style.display = 'inline-block';

                e.stopPropagation();
            });
        });

        // Кнопка "Отказаться"
        if (cancelButton) {
            cancelButton.addEventListener('click', function (e) {
                // Сброс радио
                radios.forEach(rb => {
                    rb.checked = false;
                    const marker = rb.closest('label')?.querySelector('.radio-marker');
                    if (marker) marker.classList.remove('checked');
                });

                title.classList.remove('t-checked');
                cancelButton.style.display = 'none';

                // При желании можно закрывать блок:
                hidden.classList.remove('is-open');
                top.classList.remove('is-open');

                e.stopPropagation();
            });
        }

        // Инициализация состояния
        const checkedRadio = item.querySelector('input[type="radio"]:checked');
        if (checkedRadio) {
            title.classList.add('t-checked');
            const marker = checkedRadio.closest('label')?.querySelector('.radio-marker');
            if (marker) marker.classList.add('checked');
            if (cancelButton) cancelButton.style.display = 'inline-block';
        } else {
            if (cancelButton) cancelButton.style.display = 'none';
        }
    });

    // Закрытие блоков при клике вне
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.m-calculator-add-item')) {
            addItems.forEach(item => {
                const top = item.querySelector('.m-calculator-add-item-top');
                const hidden = item.querySelector('.m-calculator-add-item-hidden');
                const title = top.querySelector('.m-calculator-add-item-title');
                const anyChecked = item.querySelector('input[type="radio"]:checked');

                if (!anyChecked) {
                    hidden.classList.remove('is-open');
                    top.classList.remove('is-open');
                    title.classList.remove('t-checked');
                }
            });
        }
    });

    function initCalculatorModal(calcModalOverlay) {
        const calcModal = calcModalOverlay.querySelector('.m-modal');
        const calculator = calcModal.querySelector('.m-calculator');
        const steps = calculator.querySelectorAll('.m-calculator-step');
        const progressLine = calculator.querySelector('.m-calculator-progress-line');
        const stepCount = calculator.querySelector('.m-calculator-step-count');
        const title = calculator.querySelector('.m-modal-title');

        let currentStep = 1;

        // Открытие модалки
        function openModal() {
            currentStep = 1;
            showStep(currentStep);
            calcModalOverlay.classList.add('is-open');
            calcModal.classList.add('is-open');
            toggleNoScroll()
        }

        // Закрытие модалки
        function closeModal() {
            calcModalOverlay.classList.remove('is-open');
            calcModal.classList.remove('is-open');
            resetCalculator();
            toggleNoScroll()
        }

        // Навешиваем события
        document.querySelectorAll('[data-click="calculator"]').forEach(btn => {
            btn.addEventListener('click', openModal);
        });

        calcModal.querySelector('.m-modal-close')?.addEventListener('click', closeModal);

        calculator.querySelector('.m-calculator-nav .m-btn:nth-child(1)')?.addEventListener('click', () => {
            if (currentStep === 1) {
                closeModal();
            } else {
                currentStep--;
                showStep(currentStep);
            }
        });

        calculator.querySelector('.m-calculator-nav .m-btn:nth-child(2)')?.addEventListener('click', () => {
            if (!validateStep(currentStep)) return;

            if (currentStep < 4) {
                currentStep++;
                showStep(currentStep);
            } else {
                if (validateStep(4)) {
                    const data = collectData();
                    console.log('Отправляем данные калькулятора:', data);
                    closeModal();
                    successModal.open();
                }
            }
        });

        // Показ шага
        function showStep(step) {
            steps.forEach(el => el.classList.remove('is-open'));
            const current = calculator.querySelector(`.m-calculator-step[data-step="${step}"]`);
            if (current) current.classList.add('is-open');

            stepCount.textContent = step;
            progressLine.style.width = `${step * 25}%`;

            title.textContent = step === 4 ? 'Примерная стоимость — 20 000 ₽' : 'Узнайте стоимость';
        }

        // Сброс формы
        function resetCalculator() {
            currentStep = 1;
            calculator.querySelectorAll('.t-label-error').forEach(el => el.classList.remove('t-label-error'));

            calculator.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.checked = false;
                radio.closest('label')?.querySelector('.radio-marker')?.classList.remove('checked');
            });

            calculator.querySelectorAll('input[type="text"], textarea').forEach(input => {
                input.value = '';
            });

            const dropdowns = {
                '#dateDropdown': 'Выберите дату',
                '#startTimeDropdown': 'Начало',
                '#endTimeDropdown': 'Конец',
                '#dropDownType': 'Корпоратив',
            };

            for (const [id, defaultText] of Object.entries(dropdowns)) {
                const el = calculator.querySelector(`${id} .m-calculator-dropdown-selected`);
                if (el) el.textContent = defaultText;
            }

            const step3 = calculator.querySelector('.m-calculator-step[data-step="3"]');
            if (step3) {
                const addItems = step3.querySelectorAll('.m-calculator-add-item');
                addItems.forEach(item => {
                    item.querySelector('.m-calculator-add-item-hidden')?.classList.remove('is-open');
                    item.querySelector('.m-calculator-add-item-top')?.classList.remove('is-open');
                    item.querySelector('.m-calculator-add-item-title')?.classList.remove('t-checked');
                    item.querySelector('.m-btn.t-btn-white')?.style.setProperty('display', 'none');
                    item.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
                    item.querySelectorAll('.radio-marker.checked').forEach(m => m.classList.remove('checked'));
                });
            }

            showStep(currentStep);
        }

        // Валидация
        function validateStep(step) {
            let valid = true;
            calculator.querySelectorAll('.t-label-error').forEach(el => el.classList.remove('t-label-error'));

            if (step === 1) {
                const selected = calculator.querySelector('input[name="who"]:checked');
                if (!selected) {
                    calculator.querySelectorAll('[data-step="1"] .m-calculator-label')
                        .forEach(l => l.classList.add('t-label-error'));
                    valid = false;
                }
            }

            if (step === 2) {
                const step2 = calculator.querySelector('[data-step="2"]');

                const dateText = step2.querySelector('#dateDropdown .m-calculator-dropdown-selected')?.textContent;
                if (!dateText || dateText.includes('Выберите дату')) {
                    step2.querySelector('#dateDropdown')?.classList.add('t-label-error');
                    valid = false;
                }

                const startText = step2.querySelector('#startTimeDropdown .m-calculator-dropdown-selected')?.textContent;
                if (!startText || startText.includes('Начало')) {
                    step2.querySelector('#startTimeDropdown')?.classList.add('t-label-error');
                    valid = false;
                }

                const endText = step2.querySelector('#endTimeDropdown .m-calculator-dropdown-selected')?.textContent;
                if (!endText || endText.includes('Конец')) {
                    step2.querySelector('#endTimeDropdown')?.classList.add('t-label-error');
                    valid = false;
                }

                const eventType = step2.querySelector('#dropDownType .m-calculator-dropdown-selected')?.textContent;
                if (!eventType || eventType === '') {
                    step2.querySelector('#dropDownType')?.classList.add('t-label-error');
                    valid = false;
                }
            }

            if (step === 4) {
                const contactInput = calculator.querySelector('input[name="contact"]');
                const nameInput = calculator.querySelector('input[name="name"]');

                if (!contactInput?.value.trim()) {
                    contactInput.closest('.m-calculator-label')?.classList.add('t-label-error');
                    valid = false;
                }

                if (!nameInput?.value.trim()) {
                    nameInput.closest('.m-calculator-label')?.classList.add('t-label-error');
                    valid = false;
                }
            }

            return valid;
        }

        // Сбор данных
        function collectData() {
            const data = {};

            const whoChecked = calculator.querySelector('input[name="who"]:checked');
            data.who = whoChecked?.value || null;

            const step2 = calculator.querySelector('[data-step="2"]');
            if (step2) {
                data.date = step2.querySelector('#dateDropdown .m-calculator-dropdown-selected')?.textContent.trim() || null;
                data.startTime = step2.querySelector('#startTimeDropdown .m-calculator-dropdown-selected')?.textContent.trim() || null;
                data.endTime = step2.querySelector('#endTimeDropdown .m-calculator-dropdown-selected')?.textContent.trim() || null;
                data.eventType = step2.querySelector('#dropDownType .m-calculator-dropdown-selected')?.textContent.trim() || null;
            }

            const step3 = calculator.querySelector('.m-calculator-step[data-step="3"]');
            data.additionalServices = [];
            if (step3) {
                const addItems = step3.querySelectorAll('.m-calculator-add-item');
                addItems.forEach(item => {
                    const checkedRadio = item.querySelector('input[type="radio"]:checked');
                    if (checkedRadio) {
                        const serviceName = item.querySelector('.m-calculator-add-item-title')?.textContent.trim();
                        const serviceValue = checkedRadio.value;
                        data.additionalServices.push({ serviceName, serviceValue });
                    }
                });
            }

            const step4 = calculator.querySelector('[data-step="4"]');
            if (step4) {
                data.name = step4.querySelector('input[name="name"]')?.value.trim() || null;
                data.contact = step4.querySelector('input[name="contact"]')?.value.trim() || null;
            }

            return data;
        }
    }
const modalElement = document.getElementById('modalCalculator');
initCalculatorModal(modalElement);


});