// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict';

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form');

    // Loop over them and prevent submission
    Array.from(forms).forEach(function (form) {
        form.addEventListener(
            'submit',
            function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add('was-validated');
            },
            false
        );
    });
})();

if (document.querySelector('form')) {
    let firstInput;
    const allInputs = document.querySelectorAll('input');
    const textArea = document.querySelector('textarea');
    let i = 0;
    for (let input of allInputs) {
        if (
            input.type === 'text' ||
            input.type === 'password' ||
            input.type === 'email`' ||
            input.type === 'textarea`'
        ) {
            firstInput = input;
            break;
        } else {
            i++;
        }
    }

    if (!allInputs[i]) {
        textArea.focus();
    } else {
        allInputs[i].focus();
        document.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowDown') {
                if (i < allInputs.length - 1) {
                    i++;
                    allInputs[i].focus();
                } else {
                    i = 0;
                    allInputs[i].focus();
                }
            }
        });
    }
}
