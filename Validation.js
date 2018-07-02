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
     * @memberOf Validation
     *
     * @param {string} emptyText - Пустое текстовое поле.
     * @param {string} emptyEmail - Пустое поле ввода email.
     * @param {string} emptyTel - Пустое поле ввода телефонного номера.
     * @param {string} shortText - Короткое содержимое текстового поля.
     * @param {string} shortEmail - Короткое содержимое поля ввода email.
     * @param {string} invalidEmail - Некорректное содержимое поля ввода email.
     * @param {string} invalidText - Некорректное содержимое текстового поля.
     * @param {string} InvalidTel - Некорректное содержимое поля ввода телефонного номера.
     */
    this.errors = {
        'emptyText': 'пустой текст',
        'emptyEmail': 'пустой емаил',
        'emptyTel': 'пустой емаил',
        'shortText': 'короткий текст',
        'shortEmail': 'короткий емаил',
        'invalidEmail': 'невалидный емаил',
        'invalidText': 'невалидный текст',
        'InvalidTel': 'невалидный номер телефона'
    };

    /**
     * Определенные селекторы формы.
     * @memberOf Validation
     *
     * @param {string} rowInput - Родительский блок єлемента формы.
     * @param {string} errorText - Блок для размещения сообщения об ошибке.
     * @param {string} errorBlock - Класс стилизации ошибки элемента формы.
     * @param {string} forms - Формы к которым будет применяться валидация.
     */
    this.selectors = {
        'rowBlock': '.row-input',
        'errorText': '.form__error',
        'errorBlock': 'error__field',
        'forms': '.contacts-page__form form'
    };

    /**
     *
     * Проверка формы на наличие аттрибута novalidate.
     */
    if ($(this.selectors.forms).attr('novalidate') === undefined) {
        $(this.selectors.forms).attr('novalidate', true);
    }

    /**
     * Добавляет сообщение об ошибке.
     *
     * @memberOf Validation
     * @param {object} target - Элемент для размещения ошибки.
     * @param {string} errorMessage - Сообщение об ошибке.
     */
    this.addError = function (target, errorMessage) {
        if (this.errors[errorMessage]) {
            $(target).closest(this.selectors.rowBlock).find(this.selectors.errorText).text(this.errors[errorMessage]);
        } else {
            $(target).closest(this.selectors.rowBlock).find(this.selectors.errorText).text(errorMessage);
        }
        $(target).addClass(this.selectors.errorBlock);
    };

    /**
     * Удаляет сообщение об ошибке.
     *
     * @memberOf Validation
     * @param target - Элемент в котором нужно удалить сообщение об ошибке.
     */
    this.removeError = function (target) {
        $(target).removeClass(this.selectors.errorBlock);
        $(target).closest(this.selectors.rowBlock).find(this.selectors.errorText).text('');
    };

    /**
     *
     *  Убирает ошибки в поле при фокусе на нем.
     */
    $(this.selectors.forms).find('input,textarea').on('focus', function () {
        self.removeError(this);
    });


    /**
     *
     * Проверка валидности элементов формы при submit
     */
    $(this.selectors.forms).on('submit', function () {
        var form = $(this),
            formInvalid = true;
        form.find('input,textarea').not('input[type=hidden]').each(function () {
            if (this.validity.valid === false) {
                if ($(this).is('textarea')) {
                    var type = 'text'
                } else if ($(this).is('input')) {
                    var type = $(this).attr('type')
                }
                if (type === 'text') {
                    self.validText(this);
                } else if (type === 'email') {
                    self.validEmail(this);
                } else if (type === 'tel') {
                    self.validTel(this);
                }
                formInvalid = false;
                $(this).blur();
            }
            if ($(this).hasClass(self.selectors.errorBlock)) {
                formInvalid = false;
                self.triggError(this);
            }
        });
        if (formInvalid === true) {
            console.log('Validation is fine');
            return true
        }
        return false
    });

    /**
     *
     *  Проверка на валидность определенного поля при уходе из него фокуса.
     */
    $(this.selectors.forms).find('input, textarea').on('blur', function () {
        if ($(this).is('textarea')) {
            var type = 'text'
        } else if ($(this).is('input')) {
            var type = $(this).attr('type')
        }
        if (type !== 'submit') {
            if (type === 'text') {
                self.validText(this);
            } else if (type === 'email') {
                self.validEmail(this);
            } else if (type === 'tel') {
                self.validTel(this);
            }
        }
    });

    /**
     * Анимация к текстам ошибок при submit
     * @memberOf Validation
     *
     * @param target - Поле с текстом ошибки, к которой будет применена анимация.
     */
    this.triggError = function (target) {
        var errorBox = $(target).closest(this.selectors.rowBlock).find(this.selectors.errorText),
            trigger = false;
        var triggeredErrors = setInterval(function () {
            if (trigger === false) {
                errorBox.css('right', '2px');
                trigger = true;
            } else {
                errorBox.css('right', '0');
                trigger = false;
            }
        }, 85);
        setTimeout(function () {
            clearInterval(triggeredErrors);
        }, 525);
    };

    /**
     * Проверяет валидность поля для вводу текстовой информации.
     * @memberOf Validation
     *
     * @param {object} target - Поле которое проверяется на валидность.
     */
    this.validText = function (target) {
        if (target.validity.valueMissing) {
            self.addError(target, 'emptyText');
        } else if (target.validity.tooShort) {
            self.addError(target, 'shortText');
        } else if (target.validity.patternMismatch) {
            self.addError(target, 'invalidText')
        }
    };

    /**
     * Проверяет валидность поля для ввода электронного адреса.
     * @memberOf Validation
     *
     * @param {object} target - Поле которое проверяется на валидность.
     */
    this.validEmail = function (target) {
        if (target.validity.valueMissing) {
            self.addError(target, 'emptyEmail');
        } else if (target.validity.tooShort) {
            self.addError(target, 'shortEmail');
        } else if (target.validity.patternMismatch) {
            self.addError(target, 'invalidEmail')
        }
    };

    /**
     * Проверяет валидность поля для ввода телефонного номера.
     * @memberOf Validation
     *
     * @param {object} target - Поле которое проверяется на валидость.
     */
    this.validTel = function (target) {
        if (target.validity.valueMissing) {
            self.addError(target, 'emptyTel')
        } else if (target.validity.patternMismatch) {
            self.addError(target, 'invalidTel')
        }
    };

}
