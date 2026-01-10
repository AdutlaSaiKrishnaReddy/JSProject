const API_URL = "/events";
let editId = null;

async function getEvents() {
  try {
    let res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch events");

    let data = await res.json();
    displayTable(data);
    return data;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

function displayTable(events) {
  const tbody = document.querySelector("#events-table tbody");
  tbody.innerHTML = "";

  events.forEach((event) => {
    let tr = document.createElement("tr");

    tr.innerHTML = `
     
      <td>${event.name}</td>
      <td>${event.location}</td>
      <td>${event.date}</td>
      <td>${event.time}</td>
      <td>₹ ${event.price}</td>
      <td>${event.category}</td>
      <td>
        <button class="edit-btn" id="editBtn-${event.id}">Edit</button>
        <button class="delete-btn" id="deleteBtn-${event.id}">Delete</button>
      </td>
    `;

    tbody.appendChild(tr);

    document
      .getElementById(`editBtn-${event.id}`)
      .addEventListener("click", () => editEvent(event.id));
    document
      .getElementById(`deleteBtn-${event.id}`)
      .addEventListener("click", () => deleteEvent(event.id));
  });
}

async function addEvent(eventData) {
  try {
    let method = editId ? "PUT" : "POST";
    let url = editId ? `${API_URL}/${editId}` : API_URL;

    let res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });

    if (!res.ok) throw new Error("Save failed");

    alert(editId ? "Event updated!" : "Event added!");
    editId = null;
    document.querySelector("form").reset();
    getEvents();
  } catch (error) {
    console.error(error.message);
  }
}

async function editEvent(id) {
  let res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    alert("Event not found!");
    return;
  }

  let event = await res.json();

  editId = id;
  eventName.value = event.name;
  eventLocation.value = event.location;
  eventDate.value = event.date;
  eventTime.value = event.time;
  price.value = event.price;
  category.value = event.category;
  image.value = event.image;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteEvent(id) {
  if (!confirm("Are you sure you want to delete this event?")) return;

  try {
    let res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      res.message;
      throw new Error("Failed to delete event");
    }
    alert("Event deleted successfully");
    getEvents();
  } catch (error) {
    console.error(error.message);
    alert("Error deleting event");
  }
}

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  let eventData = {
    name: eventName.value,
    location: eventLocation.value,
    date: eventDate.value,
    time: eventTime.value,
    price: price.value,
    category: category.value,
    image: image.value,
  };

  addEvent(eventData);
});

getEvents();

const authUser = JSON.parse(localStorage.getItem("authUser"));

if (!authUser || authUser.role !== "ADMIN") {
  alert("Access denied");
  window.location.href = "login.html";
}
