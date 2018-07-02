
/*errors = {
    'emptyText': 'пустой текст',
    'emptyEmail': 'пустой емаил',
    'emptyTel': 'пустой емаил',
    'shortText': 'короткий текст',
    'shortEmail': 'короткий емаил',
    'invalidEmail': 'невалидный емаил',
    'invalidText': 'невалидный текст',
    'InvalidTel': 'невалидный номер телефона'
};

selectors = {
    'rowInput': '.row-input',
    'errorBlock': '.form__error',
    'errorInput': 'error__field',
    'forms': '.contacts-page__form form'

};*/

function Validation() {
    var self = this;

    if ($(selectors.forms).attr('novalidate') === undefined) {
        $(selectors.forms).attr('novalidate', true);
    }

    this.addError = function (target, errorMessage) {
        if (errors[errorMessage]) {
            $(target).closest(selectors.rowInput).find(selectors.errorBlock).text(errors[errorMessage]);
        } else {
            $(target).closest(selectors.rowInput).find(selectors.errorBlock).text(errorMessage);
        }
        $(target).addClass(selectors.errorInput);
    };

    this.removeError = function (target) {
        $(target).removeClass(selectors.errorInput);
        $(target).closest(selectors.rowInput).find(selectors.errorBlock).text('');
    };

    $('input,textarea').on('focus', function () {
        self.removeError(this);
    });

    $(selectors.forms).on('submit', function () {
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
                    self.valid_text(this);
                } else if (type === 'email') {
                    self.valid_email(this);
                } else if (type === 'tel') {
                    self.valid_tel(this);
                }
                formInvalid = false;
                $(this).blur();
            }
            if ($(this).hasClass(selectors.errorInput)) {
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

    $('input, textarea').on('blur', function () {
        if ($(this).is('textarea')) {
            var type = 'text'
        } else if ($(this).is('input')) {
            var type = $(this).attr('type')
        }
        if (type !== 'submit') {
            if (type === 'text') {
                self.valid_text(this);
            } else if (type === 'email') {
                self.valid_email(this);
            } else if (type === 'tel') {
                self.valid_tel(this);
            }
        }
    });

    this.triggError = function (target) {
        var errorBox = $(target).closest(selectors.rowInput).find(selectors.errorBlock),
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

    this.valid_text = function (target) {
        if (target.validity.valueMissing) {
            self.addError(target, 'emptyText');
        } else if (target.validity.tooShort) {
            self.addError(target, 'shortText');
        } else if (target.validity.patternMismatch) {
            self.addError(target, 'invalidText')
        }
    };

    this.valid_email = function (target) {
        if (target.validity.valueMissing) {
            self.addError(target, 'emptyEmail');
        } else if (target.validity.tooShort) {
            self.addError(target, 'shortEmail');
        } else if (target.validity.patternMismatch) {
            self.addError(target, 'invalidEmail')
        }
    };

    this.valid_tel = function (target) {
        if (target.validity.valueMissing) {
            self.addError(target, 'emptyTel')
        } else if (target.validity.patternMismatch) {
            self.addError(target, 'invalidTel')
        }
    };

}
