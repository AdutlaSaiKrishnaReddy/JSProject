const API_URL = "http://localhost:3000/events";
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
      <td>${event.id}</td>
      <td>${event.name}</td>
      <td>${event.location}</td>
      <td>${event.date}</td>
      <td>${event.time}</td>
      <td>₹ ${event.price}</td>
      <td>${event.category}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;

    tr.querySelector(".edit-btn").addEventListener("click", () =>
      editEvent(event.id)
    );
    tr.querySelector(".delete-btn").addEventListener("click", () =>
      deleteEvent(event.id)
    );

    tbody.appendChild(tr);
  });
}

async function addEvent(eventData) {
  try {
    let method = editId ? "PUT" : "POST";
    let url = editId ? `${API_URL}/${editId}` : API_URL;

    if (!editId) {
      let events = await fetch(API_URL).then((res) => res.json());
      eventData.id =
        events.length === 0 ? 1 : Math.max(...events.map((e) => e.id)) + 1;
    }

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
