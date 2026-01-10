const REGISTERED_API = "/registeredEvents";

/* ---------- AUTH HELPER ---------- */
function getAuthUser() {
  return JSON.parse(localStorage.getItem("authUser"));
}

/* ---------- LOAD NAVBAR ---------- */
fetch("/navbar.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("nav-placeholder").innerHTML = data;

    initNavbar(); // mobile menu
    initNavbarAuth(); // login/logout toggle
    initSearch(); // search logic
  });

/* ---------- REGISTER EVENT (AUTH PROTECTED) ---------- */
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".add-cartbtn");
  if (!btn) return;

  const authUser = getAuthUser();
  if (!authUser) {
    // Only alert once and redirect
    alert("Please login to register for events");
    window.location.href = "login.html";
    return;
  }

  const registeredEvent = {
    name: btn.dataset.name,
    location: btn.dataset.location,
    date: btn.dataset.date,
    time: btn.dataset.time,
    price: btn.dataset.price,
    userEmail: authUser.email,
  };

  try {
    const res = await fetch(REGISTERED_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registeredEvent),
    });

    if (!res.ok) throw new Error("Failed to register event");
    alert("Event registered successfully!");
  } catch (err) {
    console.error(err.message);
    alert("Failed to register event. Please try again.");
  }
});

/* ---------- SEARCH (AUTH PROTECTED) ---------- */
function initSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const pageContent = document.getElementById("pageContent");

  if (!searchInput) return;

  const allCards = document.querySelectorAll(".card");

  searchInput.addEventListener("focus", () => {
    if (!getAuthUser()) {
      // Redirect immediately
      window.location.href = "login.html";
    }
  });

  searchInput.addEventListener("input", () => {
    const authUser = getAuthUser();
    if (!authUser) return; // Prevent search if not logged in

    const query = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = "";

    if (!query) {
      searchResults.style.display = "none";
      pageContent.classList.remove("hide-page");
      return;
    }

    pageContent.classList.add("hide-page");
    searchResults.style.display = "grid";

    allCards.forEach((card) => {
      const btn = card.querySelector(".add-cartbtn");
      if (!btn) return;

      const text = `
        ${btn.dataset.name}
        ${btn.dataset.location}
        ${btn.dataset.date}
        ${btn.dataset.time}
      `.toLowerCase();

      if (text.includes(query)) {
        const clonedCard = card.cloneNode(true);

        // Remove previous click listeners to prevent multiple triggers
        const clonedBtn = clonedCard.querySelector(".add-cartbtn");
        clonedBtn.addEventListener("click", () => {
          // Trigger same registration logic
          if (!getAuthUser()) {
            window.location.href = "login.html";
            return;
          }
          const registeredEvent = {
            name: clonedBtn.dataset.name,
            location: clonedBtn.dataset.location,
            date: clonedBtn.dataset.date,
            time: clonedBtn.dataset.time,
            price: clonedBtn.dataset.price,
            userEmail: getAuthUser().email,
          };
          registerEvent(registeredEvent);
        });

        searchResults.appendChild(clonedCard);
      }
    });
  });
}
