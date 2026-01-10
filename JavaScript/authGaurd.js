// authGuard.js
function authGuard() {
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  if (!authUser) {
    // redirect to login page
    window.location.href = "login.html";
    return false;
  }
  return true;
}

// Call this at the very start of each JS file
authGuard();
