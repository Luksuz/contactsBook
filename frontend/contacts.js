const accessToken = getCookie("accessToken");
const table = document.querySelector(".table");
const tableEl = document.getElementById("contacts-table");
const addContactBtnEl = document.getElementById("add-contact");
const saveContactBtnEl = document.getElementById("save-contact");
const deleteButtonEl = document.getElementById("delete-contact");
const lastTableRowEl = document.getElementById("last-row");

fetchContactsAndPopulateTable();

saveContactBtnEl.addEventListener("click", () => {
  const nameInputEl = document.querySelector(".name");
  const nameData = nameInputEl.value;

  const emailInputEl = document.querySelector(".email");
  const emailData = emailInputEl.value;

  const phoneInputEl = document.querySelector(".phone");
  const phoneData = phoneInputEl.value;

  let userData;
  userData = { nameData, emailData, phoneData };
  tableEl.innerHTML = "";
  createContact(userData);
  addContactBtnEl.disabled = false;
  saveContactBtnEl.disabled = true;
});

addContactBtnEl.addEventListener("click", async (e) => {
  addContactBtnEl.disabled = true;
  saveContactBtnEl.disabled = false;
  e.preventDefault();

  const row = document.createElement("tr");
  row.id = "last-row";
  const idCell = document.createElement("th");
  idCell.setAttribute("scope", "row");

  const nameCell = document.createElement("td");
  nameCell.classList.add("td-name");

  const emailCell = document.createElement("td");
  nameCell.classList.add("td-email");

  const phoneCell = document.createElement("td");
  nameCell.classList.add("td-phone");

  const nameInput = document.createElement("input");
  nameInput.classList.add("name");

  const emailInput = document.createElement("input");
  emailInput.classList.add("email");

  const phoneInput = document.createElement("input");
  phoneInput.classList.add("phone");
  idCell.textContent = localStorage.getItem("id");

  nameCell.appendChild(nameInput);
  emailCell.appendChild(emailInput);
  phoneCell.appendChild(phoneInput);

  row.appendChild(idCell);
  row.appendChild(nameCell);
  row.appendChild(emailCell);
  row.appendChild(phoneCell);

  tableEl.appendChild(row);
});

deleteButtonEl.addEventListener("click", () => {
  table.classList.add("table-hover");
  Array.from(tableEl.children).forEach((row) => {
    row.addEventListener("click", () => {
      const emailCell = row.querySelector(".td-email");
      const emailValue = emailCell.textContent;
      deleteContact(emailValue);
    });
  });
});

function getCookie(name) {
  const cookieString = document.cookie;
  const cookies = cookieString.split("; ");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const [cookieName, cookieValue] = cookie.split("=");

    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }

  return null;
}

console.log(accessToken);

async function fetchContactsAndPopulateTable() {
  const response = await fetch("https://winged-axon-394617.ew.r.appspot.com/api/contacts", {
    method: "GET",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log(response);
  if (response.status == "200") {
    const data = await response.json();
    console.log(data);

    for (let i = 0; i < data.length; i++) {
      const row = document.createElement("tr");
      if (i % 2 === 0) {
        row.classList.add("table-active");
      }
      console.log(data[i]);

      const idCell = document.createElement("th");
      idCell.setAttribute("scope", "row");
      idCell.textContent = i + 1;

      const nameCell = document.createElement("td");
      nameCell.textContent = data[i].name;

      const emailCell = document.createElement("td");
      emailCell.classList.add(`td-email`);
      emailCell.textContent = data[i].email;

      const phoneCell = document.createElement("td");
      phoneCell.textContent = data[i].phone;

      row.appendChild(idCell);
      row.appendChild(nameCell);
      row.appendChild(emailCell);
      row.appendChild(phoneCell);

      tableEl.appendChild(row);
    }
    localStorage.setItem("id", data.length + 1);
    sessionStorage.setItem("", data.length + 1);
  }
}

async function updateContact(userData) {
  const { nameData, emailData, phoneData } = userData;
  console.log(userData);

  const response = await fetch("https://winged-axon-394617.ew.r.appspot.com/api/contacts", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      name: nameData,
      email: emailData,
      phone: phoneData,
    }),
  });
  fetchContactsAndPopulateTable();
}

async function createContact(userData) {
  const { nameData, emailData, phoneData } = userData;
  console.log(userData);

  const response = await fetch("https://winged-axon-394617.ew.r.appspot.com/api/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      name: nameData,
      email: emailData,
      phone: phoneData,
    }),
  });
  fetchContactsAndPopulateTable();
}

async function deleteContact(userEmail) {
  console.log("starting delete");
  try {
    const response = await fetch("https://winged-axon-394617.ew.r.appspot.com/api/contacts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ email: userEmail }),
    });
    console.log(response);
    tableEl.innerHTML = "";
    fetchContactsAndPopulateTable();
  } catch (error) {
    console.error("Error deleting contact:", error);
  }
}
