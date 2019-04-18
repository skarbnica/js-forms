/**
 *
 * @constructor
 * @name Validation
 *
 * Для валидации форм необходимо задать определенные селекторы элементов формы, соответствующие сообщения об ошибках и
 * вызвать объект валидации через new Validation().
 */

function Validation() {
    var self = this;

    /**
     * Сообщения об разничных типах ошибок
     *
     * @type {object}
     *
     * @property {string} emptyText - Пустое текстовое поле.
     * @property {string} emptyEmail - Пустое поле ввода email.
     * @property {string} emptyTel - Пустое поле ввода телефонного номера.
     * @property {string} emptyPassword - Пустое поле ввода пароля.
     * @property {string} emptyDate - Пустое поле ввода даты.
     * @property {string} shortText - Короткое содержимое текстового поля.
     * @property {string} shortEmail - Короткое содержимое поля ввода email.
     * @property {string} shortPassword - Короткое содержимое поля ввода пароля.
     * @property {string} invalidEmail - Некорректное содержимое поля ввода email.
     * @property {string} invalidText - Некорректное содержимое текстового поля.
     * @property {string} InvalidDate - Некорректное содержимое поля ввода даты.
     * @property {string} InvalidTel - Некорректное содержимое поля ввода телефонного номера.
     * @property {string} InvalidPassword - Некорректное содержимое поля ввода пароля.
     */
    this.errors = {
        'emptyText': 'пустой текст',
        'emptyEmail': 'пустой емаил',
        'emptyTel': 'пустой номер телефона',
        'emptyPassword': 'пустой пароль',
        'emptyDate': 'пустое поле даты',
        'shortText': 'короткий текст',
        'shortEmail': 'короткий емаил',
        'shortPassword': 'короткий пароль',
        'invalidEmail': 'невалидный емаил',
        'InvalidDate': 'невалидная дата',
        'invalidText': 'невалидный текст',
        'invalidPassword': 'невалидный пароль',
        'InvalidTel': 'невалидный номер телефона',
        'requiredList': 'выберите значение'
    };

    /**
     * Определенные селекторы формы.
     * @type {object}
     *
     * @property {string} rowInput - Родительский блок єлемента формы.
     * @property {string} errorText - Блок для размещения сообщения об ошибке.
     * @property {string} errorBlock - Класс стилизации ошибки элемента формы.
     * @property {string} forms - Формы к которым будет применяться валидация.
     */
    this.selectors = {
        'rowBlock': '.row-input',
        'errorText': '.form__error',
        'errorBlock': 'error__field',
        'wereErrorClass': '.row-input',
        'forms': 'form'
    };


    /**
     * Добавляет сообщение об ошибке.
     *
     * @param {object} target - Элемент для размещения ошибки.
     * @param {string} errorMessage - Сообщение об ошибке.
     */
    this.addError = function (target, errorMessage) {
        if ($(target).closest(this.selectors.rowBlock).find(this.selectors.errorText).text() === '') {
            $(target).closest(this.selectors.rowBlock).find(this.selectors.errorText).text('');
            if (this.errors[errorMessage]) {
                $(target).closest(this.selectors.rowBlock).find(this.selectors.errorText).text(this.errors[errorMessage]);
            } else {
                $(target).closest(this.selectors.rowBlock).find(this.selectors.errorText).text(errorMessage);
            }

        }
        $(target).closest(this.selectors.wereErrorClass).addClass(this.selectors.errorBlock);
    };

    /**
     * @param target - Элемент в котором нужно удалить сообщение об ошибке.
     * Удаляет сообщение об ошибке.
     *
     */
    this.removeError = function (target) {
        $(target).closest(this.selectors.wereErrorClass).removeClass(this.selectors.errorBlock);
    };

    this.addEvents = function () {

        /**
         *
         * Проверка формы на наличие аттрибута novalidate.
         */
        $(this.selectors.forms).each(function () {
            if ($(this).attr('novalidate') === undefined) {
                $(this).attr('novalidate', true);
            }
            $(this).data('blur', false);
        });

        /**
         *
         *  Убирает ошибки в поле при фокусе на нем.
         */
        $(this.selectors.forms).find('input,textarea,select').on('focus', function () {
            self.removeError(this);
        });

        /**
         *
         *  Убирает ошибки при изминении select, radio.
         */
        $(this.selectors.forms).find('input[type=radio],select').on('change', function () {
            self.removeError(this);
        });


        /**
         *
         * Проверка валидности элементов формы при submit
         */
        $(this.selectors.forms).on('submit', function (e) {
            var form = $(this),
                formValid = true;
            if (form.data('blur') === false) form.data('blur', true);
            form.find('input,textarea,select').not('input[type=hidden],input[type=submit]').each(function () {
                if (self.validFormElements(this) === false) {
                    formValid = false;
                }
            });
            if (formValid === true) {
                console.log('Validation is fine');
                return true;
            }
            return false;
        });

        /**
         *
         *  Проверка на валидность определенного поля при уходе из него фокуса.
         */
        $(this.selectors.forms).find('input, textarea').on('blur', function () {
            if ($(this).closest('form').data('blur')) {
                var type;
                if ($(this).is('textarea')) {
                    type = 'text';
                } else if ($(this).is('input')) {
                    type = $(this).attr('type');
                }
                if (type !== 'submit') {

                    if (type === 'text') {
                        self.validText(this);
                    } else if (type === 'email') {
                        self.validEmail(this);
                    } else if (type === 'tel') {
                        self.validTel(this);
                    } else if (type === 'password') {
                        self.validPassword(this);
                    } else if (type === 'date'){
                        self.validDate(this);
                    }
                }
            }
        });
    };

    /**
     * Проверка на валидность элементов формы
     *
     * @param target - Элемент формы, который будет проверяться на валидность.
     */
    this.validFormElements = function (target) {
        formValid = true;
        if (target.validity.valid === false) {
            var type;

            if ($(target).is('textarea')) {
                type = 'text';
            } else if ($(target).is('select')) {
                type = 'select';
            } else if ($(target).is('input')) {
                type = $(target).attr('type');
            }

            if (type === 'text') {
                self.validText(target);
            } else if (type === 'email') {
                self.validEmail(target);
            } else if (type === 'tel') {
                self.validTel(target);
            } else if (type === 'password') {
                self.validPassword(target);
            } else if (type === 'select') {
                self.validList(target);
            } else if (type === 'radio') {
                self.validList(target);
            } else if (type === 'date') {
                self.validDate(target);
            }

            formValid = false;
            // $(target).blur();
        }
        if ($(target).closest(self.selectors.wereErrorClass).hasClass(self.selectors.errorBlock)) {
            formValid = false;
            self.triggError(target);
        }
        return formValid;
    };


    /**
     * Анимация к текстам ошибок при submit
     *
     * @param target - Поле с текстом ошибки, к которой будет применена анимация.
     */
    this.triggError = function (target) {
        var errorBox = $(target).hasClass(this.selectors.errorText) ? $(target) : $(target).closest(this.selectors.rowBlock).find(this.selectors.errorText),
            trigger = false;
        var triggeredErrors = setInterval(function () {
            var right = errorBox.css('right');
            if (trigger === false) {
                errorBox.css('right', +right.substring(0, right.search('p')) + 2 + 'px');
                trigger = true;
            } else {
                errorBox.css('right', +right.substring(0, right.search('p')) + (-2) + 'px');
                trigger = false;
            }
        }, 85);
        setTimeout(function () {
            clearInterval(triggeredErrors);
        }, 525);
    };

    /**
     * Проверяет валидность поля для вводу текстовой информации.
     *
     * @param {object} target - Поле которое проверяется на валидность.
     */
    this.validText = function (target) {
        if (target.validity.valueMissing) {
            self.addError(target, 'emptyText');
        } else if (target.validity.tooShort) {
            self.addError(target, 'shortText');
        } else if (target.validity.patternMismatch) {
            self.addError(target, 'invalidText');
        } else if (target.validity.typeMismatch) {
            self.addError(target, 'invalidText');
        }
    };

    /**
     * Проверяет валидность поля для ввода электронного адреса.
     *
     * @param {object} target - Поле которое проверяется на валидность.
     */
    this.validEmail = function (target) {
        if (target.validity.valueMissing) {
            self.addError(target, 'emptyEmail');
        } else if (target.validity.tooShort) {
            self.addError(target, 'shortEmail');
        } else if (target.validity.typeMismatch) {
            self.addError(target, 'invalidEmail');
        } else if (target.validity.patternMismatch) {
            self.addError(target, 'invalidEmail');
        }
    };

    /**
     * Проверяет валидность поля для ввода телефонного номера.
     *
     * @param {object} target - Поле которое проверяется на валидость.
     */
    this.validTel = function (target) {
        if (target.validity.valueMissing) {
            self.addError(target, 'emptyTel');
        } else if (target.validity.typeMismatch) {
            self.addError(target, 'invalidTel');
        } else if (target.validity.patternMismatch) {
            self.addError(target, 'invalidTel');
        }
    };

    /**
     * Проверяет валидность поля для пароля.
     *
     * @param {object} target - Поле которое проверяется на валидость.
     */
    this.validPassword = function (target) {
        if (target.validity.valueMissing) {
            self.addError(target, 'emptyPassword');
        } else if (target.validity.tooShort) {
            self.addError(target, 'shortPassword');
        } else if (target.validity.typeMismatch) {
            self.addError(target, 'invalidPassword');
        } else if (target.validity.patternMismatch) {
            self.addError(target, 'invalidPassword');
        }
    };

    /**
     * Проверяет валидность поля для селекта или радиобатона.
     *
     * @param {object} target - Поле которое проверяется на валидость.
     */
    this.validList = function (target) {
        self.addError(target, 'requiredList');
    };

    /**
     * Проверяет валидность поля для даты.
     *
     * @param {object} target - Поле которое проверяется на валидость.
     */
    this.validDate = function (target) {
        if (target.validity.badInput) {
            self.addError(target, 'invalidDate');
        } else if (target.validity.valueMissing) {
            self.addError(target, 'emptyDate');
        }
    };

}