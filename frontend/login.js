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
    const response = await fetch('https://winged-axon-394617.ew.r.appspot.com/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
    const responseData = await response.json();
    console.log(response.status);
    if (response.status === 200) {
        document.cookie = `accessToken=${responseData.accessToken}; secure; SameSite=None;`;
        window.location.href = './contacts.html';
    } else {
        const errorMessage = responseData.message
        errorMessageEL.innerHTML = errorMessage;
        toastEl.classList.add('show');
    }
});


