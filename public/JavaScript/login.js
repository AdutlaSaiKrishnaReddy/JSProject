const authUser = JSON.parse(localStorage.getItem("authUser"));
if (authUser && authUser.isAuthenticated) {
  if (authUser.role === "ADMIN") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "index.html";
  }
}

const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
  if (window.innerWidth > 800) {
    container.classList.add("active");
  } else {
    document.querySelector(".sign-in").style.display = "block";
    container.classList.remove("active");
  }
});

loginBtn.addEventListener("click", () => {
  if (window.innerWidth > 800) {
    container.classList.remove("active");
  } else {
    document.querySelector(".sign-up").style.display = "block";
    container.classList.add("active");
  }
});

const API_URL = "/users";

/* =======================
   SIGNUP
======================= */
const signupForm = document.querySelector(".sign-up form");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = signupName.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value;

  if (!name || !email || !password) {
    alert("All fields are required");
    return;
  }

  const res = await fetch(`${API_URL}?email=${email}`);
  const users = await res.json();
  if (users.length > 0) {
    alert("User already exists");
    return;
  }

  const newUser = {
    name,
    email,
    password: btoa(password),
    role: document.getElementById("role").value.toUpperCase(),
    createdAt: new Date().toISOString(),
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  });

  alert("Signup successful! Please login.");
  container.classList.add("active");
  signupForm.reset();
});

/* =======================
   LOGIN
======================= */
const loginForm = document.querySelector(".sign-in form");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginEmail.value.trim();
  const password = loginPassword.value;
  const loginType = document.getElementById("loginType").value.toUpperCase();

  const res = await fetch(`${API_URL}?email=${email}`);
  const users = await res.json();

  if (users.length === 0) {
    showError("Invalid email or password");
    return;
  }

  const user = users[0];

  if (atob(user.password) !== password) {
    showError("Invalid email or password");
    return;
  }

  if (user.role !== loginType) {
    showError("Invalid account type");
    return;
  }

  /* USER LOGIN */
  if (loginType === "USER") {
    localStorage.setItem(
      "authUser",
      JSON.stringify({
        name: user.name,
        email: user.email,
        role: user.role,
        isAuthenticated: true,
      })
    );
    window.location.href = "index.html";
  }

  /* ADMIN LOGIN */
  if (loginType === "ADMIN") {
    const otp = Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem("adminOTP", otp);
    localStorage.setItem("tempAdmin", JSON.stringify(user));
    alert("Admin OTP: " + otp); // For now
    document.getElementById("otpBox").style.display = "block";
  }
});

/* =======================
   OTP VERIFY
======================= */
document.getElementById("verifyOtp").addEventListener("click", () => {
  const entered = otpInput.value;
  const real = localStorage.getItem("adminOTP");

  if (entered === real) {
    const admin = JSON.parse(localStorage.getItem("tempAdmin"));

    localStorage.setItem(
      "authUser",
      JSON.stringify({
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isAuthenticated: true,
      })
    );

    localStorage.removeItem("adminOTP");
    localStorage.removeItem("tempAdmin");

    window.location.href = "admin.html";
  } else {
    alert("Wrong OTP");
  }
});

function showError(msg) {
  loginError.innerText = msg;
  loginError.style.display = "block";
}

const mobileSigninLink = document.getElementById("mobileSigninLink");
const mobileSignupLink = document.getElementById("mobileSignupLink");

if (mobileSigninLink) {
  mobileSigninLink.addEventListener("click", (e) => {
    e.preventDefault();
    container.classList.remove("active"); // show Sign In
  });
}

if (mobileSignupLink) {
  mobileSignupLink.addEventListener("click", (e) => {
    e.preventDefault();
    container.classList.add("active"); // show Sign Up
  });
}
