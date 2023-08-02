const usernameEL = document.getElementById('username');
const emailEL = document.getElementById('email');
const passwordEL = document.getElementById('password');
const submitBtnEL = document.getElementById('submit');
const errorMessageEL = document.getElementById('error-message');
const toastEl = document.querySelector('.toast');


submitBtnEL.addEventListener('click', async (e) => {
    e.preventDefault();
    const username = usernameEL.value;
    const email = emailEL.value;
    const password = passwordEL.value;
    const data = {
        username,
        email,
        password
    };
    const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (response.status == '201') {
       window.location.href = './login.html';
    } else {
        const errorMessage = responseData.message
        errorMessageEL.innerHTML = errorMessage;
        toastEl.classList.add('show');
    }
});

