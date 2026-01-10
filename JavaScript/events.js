const API_URL = "http://localhost:3000/events";
let allEvents = [];

// Ensure user is logged in
const authUser = JSON.parse(localStorage.getItem("authUser"));
if (!authUser) {
  window.location.href = "login.html";
}

// Wait for navbar to load, then init page
async function initPage() {
  // 1️⃣ Load Navbar
  const navbarRes = await fetch("./navbar.html");
  const navbarHTML = await navbarRes.text();
  document.getElementById("nav-placeholder").innerHTML = navbarHTML;

  // 2️⃣ Initialize Navbar and Search
  if (typeof initNavbar === "function") initNavbar();
  if (typeof initNavbarAuth === "function") initNavbarAuth();
  if (typeof initSearch === "function") initSearch();

  // 3️⃣ Fetch and display events
  getEvents();
}

// Call the init function
initPage();

// Fetch and display events
async function getEvents() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch events");
    allEvents = await res.json();
    displayEvents(allEvents);
  } catch (err) {
    console.error(err.message);
  }
}

// Display events
function displayEvents(events) {
  const container = document.getElementById("events-container");
  container.innerHTML = "";
  events.forEach((event) => container.appendChild(createCard(event)));
}

// Create card
function createCard(event) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${event.image}" alt="${event.name}" />
    <h5>${event.name}</h5>
    <p>${event.location} | ${event.date} | ${event.time}</p>
    <div class="card-footer">
      <button class="price-btn">₹ ${event.price}</button>
      <button class="add-cartbtn">
        <ion-icon name="cart-outline"></ion-icon>
        Register
      </button>
    </div>
  `;

  card.querySelector(".add-cartbtn").addEventListener("click", () => {
    registerEvent(event);
  });

  return card;
}

// Register event
function registerEvent(event) {
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  if (!authUser) {
    alert("Please login to register for events");
    window.location.href = "login.html";
    return;
  }

  fetch("http://localhost:3000/registeredEvents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...event, userEmail: authUser.email }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to register");
      alert("Event registered successfully!");
    })
    .catch((err) => console.error(err.message));
}
