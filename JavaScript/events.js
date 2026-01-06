const API_URL = "http://localhost:3000/events";

fetch("./navbar.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("nav-placeholder").innerHTML = data;
  });

async function getEvents() {
  try {
    let res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch events");

    let events = await res.json();
    displayEvents(events);
  } catch (error) {
    console.error(error.message);
  }
}

function displayEvents(events) {
  let container = document.getElementById("events-container");
  container.innerHTML = "";

  events.forEach((event) => {
    let card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${event.image}" alt="${event.name}" />

      <h5>${event.name}</h5>

      <p>
        ${event.location} | ${event.date} | ${event.time} 
      </p>

      <div class="card-footer">
        <button class="price-btn">₹ ${event.price}</button>
        <button class="add-cartbtn">
          <ion-icon name="cart-outline"></ion-icon>
          Register
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

getEvents();
