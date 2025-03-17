const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const signupForm = document.querySelector(".sign-up-form");
const signinForm = document.querySelector(".sign-in-form");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});


signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = signupForm.querySelector("input[type='text']").value;
  const email = signupForm.querySelector("input[type='email']").value;
  const password = signupForm.querySelector("input[type='password']").value;

  if (!username || !email || !password) {
    alert("Please fill in all fields!");
    return;
  }

  const userData = { username, email, password };
  localStorage.setItem("userData", JSON.stringify(userData));

  alert("Signup successful! Please log in.");
  container.classList.remove("sign-up-mode");
});

signinForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = signinForm.querySelector("input[type='text']").value;
  const password = signinForm.querySelector("input[type='password']").value;

  const storedData = JSON.parse(localStorage.getItem("userData"));

  if (!storedData) {
    alert("No user found! Please sign up first.");
    return;
  }

  if (storedData.username === username && storedData.password === password) {
    alert("Login successful!");
  } else {
    alert("Invalid username or password!");
  }
});


