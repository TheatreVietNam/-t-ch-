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

  db.ref("bookedSeats").once("value", snapshot => {
    const data = snapshot.val() || {};
    const records = {};

    for (let seatId in data) {
      const booking = data[seatId];
      const key = `${booking.email}-${booking.phone}`;

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
        <td>
          <button onclick="deleteBooking('${b.email}', '${b.phone}')">Xóa</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  });
}

function deleteBooking(email, phone) {
  const confirmDelete = confirm(`Bạn có chắc muốn xóa tất cả các ghế đã đặt bởi:\n${email} - ${phone}?`);
  if (!confirmDelete) return;

  db.ref("bookedSeats").once("value", snapshot => {
    const data = snapshot.val() || {};
    for (let seatId in data) {
      const booking = data[seatId];
      if (booking.email === email && booking.phone === phone) {
        db.ref("bookedSeats/" + seatId).remove();
      }
    }
    alert("Đã xóa vé thành công.");
    loadBookings();
  });
}
