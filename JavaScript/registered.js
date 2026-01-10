const REGISTERED_API = "/registeredEvents";

fetch("/navbar.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("nav-placeholder").innerHTML = data;

    initNavbar(); // Mobile menu toggle
    initNavbarAuth(); // Login/logout toggle
    initSearch(); // Search bar (if needed)
  });

// Fetch Registered Events
async function getRegisteredEvents() {
  try {
    let res = await fetch(REGISTERED_API);
    if (!res.ok) throw new Error("Failed to fetch registered events");

    let data = await res.json();
    displayRegisteredEvents(data);
  } catch (error) {
    console.error(error.message);
  }
}

// Display data in table
function displayRegisteredEvents(events) {
  const tbody = document.querySelector("#events-table tbody");
  tbody.innerHTML = "";

  if (events.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;">No registered events</td>
      </tr>
    `;
    return;
  }

  events.forEach((event) => {
    let row = document.createElement("tr");

    row.innerHTML = `
      <td>${event.name}</td>
      <td>${event.location}</td>
      <td>${event.date}</td>
      <td>${event.time}</td>
      <td>₹ ${event.price}</td>
    `;

    tbody.appendChild(row);
  });
}

// Call function
getRegisteredEvents();
