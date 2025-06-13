const allowedAdmin = "thetridenttheatre@gmail.com";

function verifyAdmin() {
  const inputEmail = document.getElementById("adminEmail").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  if (inputEmail.toLowerCase() === allowedAdmin) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("dataSection").style.display = "block";
    loadBookings();
  } else {
    errorMsg.textContent = "Email không hợp lệ. Vui lòng thử lại.";
  }
}

function loadBookings() {
  const tableBody = document.querySelector("#bookingTable tbody");
  tableBody.innerHTML = "";

  firebase.database().ref("bookedSeats").once("value", snapshot => {
    const data = snapshot.val() || {};
    const records = {};

    for (let seatId in data) {
      const booking = data[seatId];
      const key = `${booking.email}-${booking.phone}`; // gom chung lại theo người đặt

      if (!records[key]) {
        records[key] = {
          fullname: booking.fullname,
          email: booking.email,
          phone: booking.phone,
          seats: [],
          timestamp: booking.timestamp
        };
      }

      records[key].seats.push(seatId);
    }

    Object.values(records).forEach(b => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${b.fullname}</td>
        <td>${b.email}</td>
        <td>${b.phone}</td>
        <td>${b.seats.sort().join(", ")}</td>
        <td>${new Date(b.timestamp).toLocaleString("vi-VN")}</td>
      `;
      tableBody.appendChild(tr);
    });
  });
}
