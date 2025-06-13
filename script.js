const leftLabels = ['A','B','C','D','E'];
const rightLabels = ['F','G','H','I','J'];
const leftSide = document.querySelector('.side.left');
const rightSide = document.querySelector('.side.right');
let selected = [];

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
        if (seat.classList.contains('booked')) return;

        if (seat.classList.contains('selected')) {
          seat.classList.remove('selected');
          selected = selected.filter(s => s !== seatId);
        } else {
          seat.classList.add('selected');
          selected.push(seatId);
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
    const booked = snapshot.val() || {};
    document.querySelectorAll('.seat').forEach(seat => {
      const id = seat.dataset.id;
      if (booked[id]) {
        seat.classList.add('booked');
        seat.classList.remove('selected');
      }
    });
  });
}

createSeats(leftSide, leftLabels);
createSeats(rightSide, rightLabels);
loadBookedSeats();
