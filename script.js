const leftLabels = ['A','B','C','D','E'];
const rightLabels = ['F','G','H','I','J'];
const leftSide = document.querySelector('.side.left');
const rightSide = document.querySelector('.side.right');
let selected = [];
let bookedData = {};

function createSeats(side, labels) {
  for (let i = 0; i < 5; i++) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');

    for (let j = 1; j <= 10; j++) {
      const seat = document.createElement('div');
      seat.classList.add('seat');
      const seatId = labels[i] + (j < 10 ? '0' + j : j);
      seat.textContent = seatId;
      seat.dataset.id = seatId;

      seat.addEventListener('click', () => {
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();

        if (!email || !phone) {
          alert('Vui lòng nhập Email và Số điện thoại trước khi chọn hoặc hủy ghế.');
          return;
        }

        const id = seat.dataset.id;
        const booked = bookedData[id];

        // Nếu ghế đã được đặt
        if (seat.classList.contains('booked')) {
          // Nếu người đặt là chính mình → cho hủy
          if (booked && booked.email === email && booked.phone === phone) {
            db.ref('bookedSeats/' + id).remove();
            seat.classList.remove('booked');
            alert(`Đã hủy ghế ${id}`);
            loadBookedSeats();
          } else {
            alert('Ghế này đã được người khác đặt và bạn không thể hủy.');
          }
          return;
        }

        // Nếu ghế đang được chọn → bỏ chọn
        if (seat.classList.contains('selected')) {
          seat.classList.remove('selected');
          selected = selected.filter(s => s !== id);
        } else {
          seat.classList.add('selected');
          selected.push(id);
        }
        updateForm();
      });

      rowDiv.appendChild(seat);
    }
    side.appendChild(rowDiv);
  }
}

function updateForm() {
  document.getElementById('selectedSeats').value = selected.join(', ');
  let total = 0;
  selected.forEach(seat => {
    let row = seat[0];
    if (['A', 'B', 'F', 'G'].includes(row)) {
      total += 350000;
    } else {
      total += 320000;
    }
  });
  document.getElementById('total').value = total.toLocaleString();
}

function confirmBooking() {
  const email = document.getElementById('email').value.trim();
  const fullname = document.getElementById('fullname').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (!email || !fullname || !phone || selected.length === 0) {
    alert('Vui lòng nhập đầy đủ thông tin và chọn ít nhất 1 ghế.');
    return;
  }

  const bookingData = {
    email,
    fullname,
    phone,
    seats: selected,
    timestamp: Date.now()
  };

  selected.forEach(seatId => {
    db.ref('bookedSeats/' + seatId).set(bookingData);
  });

  alert('Đặt chỗ thành công!');
  selected = [];
  updateForm();
  loadBookedSeats();
}

function loadBookedSeats() {
  db.ref('bookedSeats').once('value', snapshot => {
    bookedData = snapshot.val() || {};

    document.querySelectorAll('.seat').forEach(seat => {
      const id = seat.dataset.id;
      if (bookedData[id]) {
        seat.classList.add('booked');
        seat.classList.remove('selected');
      } else {
        seat.classList.remove('booked');
      }
    });
  });
}

createSeats(leftSide, leftLabels);
createSeats(rightSide, rightLabels);
loadBookedSeats();
