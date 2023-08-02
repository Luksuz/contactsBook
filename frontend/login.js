const emailEL = document.getElementById('email');
const passwordEL = document.getElementById('password');
const submitBtnEL = document.getElementById('submit');
const errorMessageEL = document.getElementById('error-message');
const toastEl = document.querySelector('.toast');

submitBtnEL.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = emailEL.value;
    const password = passwordEL.value;
    const data = {
        email,
        password
    };
    console.log(data);
    const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include', // Include cookies with cross-origin requests
        body: JSON.stringify(data),
    });
    const responseData = await response.json();
    console.log(response.status);
    if (response.status === 200) {
        window.location.href = './contacts.html';
    } else {
        const errorMessage = responseData.message
        errorMessageEL.innerHTML = errorMessage;
        toastEl.classList.add('show');
    }
});

