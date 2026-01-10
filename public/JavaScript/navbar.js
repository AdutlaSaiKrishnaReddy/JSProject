/* ---------- MOBILE MENU ---------- */
function initNavbar() {
  const openBtn = document.getElementById("open-sidebar");
  const closeBtn = document.getElementById("close-sidebar");
  const navbar = document.getElementById("navbar");
  const overlay = document.getElementById("overlay");

  if (!openBtn || !closeBtn || !navbar || !overlay) return;

  openBtn.onclick = () => {
    navbar.classList.add("show");
    overlay.style.display = "block";
  };

  function closeMenu() {
    navbar.classList.remove("show");
    overlay.style.display = "none";
  }

  closeBtn.onclick = closeMenu;
  overlay.onclick = closeMenu;
}

/* ---------- AUTH NAVBAR ---------- */
function initNavbarAuth() {
  const loginItem = document.getElementById("loginItem");
  const logoutItem = document.getElementById("logoutItem");
  const myEventsItem = document.getElementById("myEventsItem");
  const logoutBtn = document.getElementById("logoutBtn");
  const navLinks = document.querySelectorAll("#navbar ul li a");

  const authUser = JSON.parse(localStorage.getItem("authUser"));

  // ✅ LOGGED IN
  if (authUser) {
    loginItem.style.display = "none";
    logoutItem.style.display = "block";
    if (myEventsItem) myEventsItem.style.display = "block";

    // 🔴 LOGOUT HANDLER
    logoutBtn.onclick = () => {
      localStorage.removeItem("authUser");
      window.location.href = "login.html";
    };

    return;
  }

  // 🔐 NOT LOGGED IN
  loginItem.style.display = "block";
  logoutItem.style.display = "none";
  if (myEventsItem) myEventsItem.style.display = "none";

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");

    // ✅ Allow login page
    if (href.includes("login.html")) return;

    // 🔒 Redirect all others to login
    link.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "login.html?mode=login";
    });
  });
}
