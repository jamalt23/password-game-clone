const rules = [
    {
        id: 1,
        rule: "Your password must be at least 8 characters",
        check: password => password.length >= 8
    },
    {
        id: 2,
        rule: "Your password must include a number",
        check: password => /\d/.test(password)
    },
    {
        id: 3,
        rule: "Your password must include an uppercase letter",
        check: password => /[A-Z]/.test(password)
    },
    {
        id: 4,
        rule: "Your password must include a special character",
        check: password => /[^\w\d]/.test(password)
    },
    {
        id: 5,
        rule: "The digits in your password must add up to 40",
        check: password => sumDigits(password) == 40
    },
    {
        id: 6,
        rule: "Your password must include a day of the week",
        check: password => containDay(password)
    },
    {
        id: 7,
        rule: "Your password must include current year",
        check: password => password.includes(new Date().getFullYear())
    },
    {
        id: 8,
        rule: "Your password must include the length of your password",
        check: password => password.includes(password.length)
    },
    {
        id: 9,
        rule: "Your password must include the key emoji",
        check: password => password.includes("🔑")
    },
    {
        id: 10,
        rule: "Your password must include one of our sponsors:",
        attachment: `
        <div class="d-flex align-items-baseline justify-content-evenly">
            <img src="img/apple-logo.png" alt="" class="sponsor" height="85"></img>
            <img src="img/x-logo.png" alt="𝕏" class="sponsor" height="70"></img>
            <img src="img/mcdonalds.png" alt="ᗰ" class="sponsor" height="76"></img>
        </div>`,
        check: password => containSponsor(password)
    },
    {
        id: 11,
        rule: "The length of your password must be an even number",
        check: password => password.length % 2 === 0
    },
    {
        id: 12,
        rule: "Your password must include the current time backwards (Example: 01:02 -> 20:10)",
        check: password => containReversedTime(password)
    },
]

function renderRule({id, rule, attachment}, isValid = false) {
    const status = isValid ? 'valid' : 'invalid';
    const isAlreadyRendered = $(`.rule#${id}`).length > 0;

    if (isAlreadyRendered) {
        const $rule = $(`.rule#${id}`);
        if (!$rule.hasClass(status)) {
            $rule.removeClass('valid invalid').addClass(status);
            $rule.find('.fas').removeClass('fa-check fa-xmark').addClass(`fa-${isValid ? 'check' : 'xmark'}`);
        }
        return;
    }

    const $rule = $(`
        <div class="rule ${status}" id="${id}" style="display: none;">
            <div class="rule-title">
                <i class="fas fa-${isValid ? 'check' : 'xmark'}"></i>
                <span>Rule ${id}</span>
            </div>
            <div class="rule-content">
                <span>${rule}</span>
                ${attachment ? attachment : ''}
            </div>
        </div>`
    );
    $('#rules').append($rule);
    $rule.fadeIn();
}

function sumDigits(str) {
    let total = 0;
    for (const char of str) {
        if (/\d/.test(char)) {
            total += +char;
        }
    }
    return total;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
function containDay(str) {
    str = str.toLowerCase();
    for (const day of DAYS) {
        if (str.includes(day)){
            return true;
        }
    }
    return false;
}

const SPONSORS = ["apple","","x","twitter","mcdonalds","mcdonald's"];
function containSponsor(str) {
    str = str.toLowerCase();
    for (const sponsor of SPONSORS) {
        if (str.includes(sponsor)){
            return true;
        }
    }
    return false;
}

function containReversedTime(str) {
    const now = new Date();
    const formattedTime = now.toTimeString().slice(0, 5);
    const reversedTime = formattedTime.split('').reverse().join('');
    return str.includes(reversedTime);
}

let score = 0;
const $passwordLength = $('#password-length');
$('input#password').on('input', function(){
    const password = this.value;
    $passwordLength.text(password.length).css('opacity', password.length > 0 ? 1 : 0);

    for (const rule of rules) {
        const isValid = rule.check(password);
        renderRule(rule, isValid);
        if (rule.id > score) {
            if (isValid) {
                score = rule.id;
            } else {
                break;
            }
        }
    }
})