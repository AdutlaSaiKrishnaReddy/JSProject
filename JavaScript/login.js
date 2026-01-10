const authUser = JSON.parse(localStorage.getItem("authUser"));

// If user is already logged in, redirect to index
if (authUser && authUser.isAuthenticated) {
  window.location.href = "index.html";
}

const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

// Toggle forms on desktop
registerBtn.addEventListener("click", () => {
  if (window.innerWidth > 800) {
    container.classList.add("active");
  } else {
    // On mobile, show login below signup
    document.querySelector(".sign-in").style.display = "block";
    container.classList.remove("active");
  }
});

loginBtn.addEventListener("click", () => {
  if (window.innerWidth > 800) {
    container.classList.remove("active");
  } else {
    // On mobile, show signup below login
    document.querySelector(".sign-up").style.display = "block";
    container.classList.add("active");
  }
});

const API_URL = "/users";

// SIGNUP FORM
const signupForm = document.querySelector(".sign-up form");
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  if (!name || !email || !password) {
    alert("All fields are required");
    return;
  }

  // Check if email exists
  const res = await fetch(`${API_URL}?email=${email}`);
  const users = await res.json();
  if (users.length > 0) {
    alert("User with this email already exists");
    return;
  }

  // Encode password
  const hashedPassword = btoa(password);

  const newUser = {
    name,
    email,
    password: hashedPassword,
    role: "USER",
    createdAt: new Date().toISOString(),
  };

  // Save user
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  });

  alert("Signup successful! Please login to continue.");

  // On mobile, show login form below signup
  if (window.innerWidth <= 800) {
    document.querySelector(".sign-in").style.display = "block";
    document.querySelector(".sign-up").style.display = "block"; // both visible
  } else {
    // On desktop, slide to login form
    container.classList.add("active");
  }

  // Clear signup fields
  signupForm.reset();
});

// LOGIN FORM
const loginForm = document.querySelector(".sign-in form");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showError("Please enter email and password");
    return;
  }

  const res = await fetch(`${API_URL}?email=${email}`);
  const users = await res.json();

  if (users.length === 0) {
    showError("Invalid email or password");
    return;
  }

  const user = users[0];
  const decodedPassword = atob(user.password);

  if (decodedPassword !== password) {
    showError("Invalid email or password");
    return;
  }

  // Save auth info
  localStorage.setItem(
    "authUser",
    JSON.stringify({
      name: user.name,
      email: user.email,
      role: user.role,
      isAuthenticated: true,
    })
  );

  // Redirect to index
  window.location.href = "index.html";
});

// Show error
function showError(message) {
  loginError.innerText = message;
  loginError.style.display = "block";
}

const mobileSigninLink = document.getElementById("mobileSigninLink");

if (mobileSigninLink) {
  mobileSigninLink.addEventListener("click", (e) => {
    e.preventDefault();

    if (window.innerWidth <= 800) {
      container.classList.add("show-signin");
    }
  });
}

const mobileSignupLink = document.getElementById("mobileSignupLink");

if (mobileSignupLink) {
  mobileSignupLink.addEventListener("click", (e) => {
    e.preventDefault();

    if (window.innerWidth <= 800) {
      container.classList.remove("show-signin");
    }
  });
}
