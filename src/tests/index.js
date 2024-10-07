

const existingSlots = [
  { start: '2023-10-01T10:00:00', end: '2023-10-01T11:00:00' },
  { start: '2023-10-01T12:00:00', end: '2023-10-01T13:00:00' },
];

const newSlot = { start: '2023-10-01T10:30:00', end: '2023-10-01T11:30:00' };

function isTimeSlotDuplicate(existingSlots, newSlot) {
  const newStart = new Date(newSlot.start);
  const newEnd = new Date(newSlot.end);

  for (const slot of existingSlots) {
    const existingStart = new Date(slot.start);
    const existingEnd = new Date(slot.end);

    if (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    ) {
      return true;
    }
  }

  return false;
}
console.log(isTimeSlotDuplicate(existingSlots, newSlot)); // Expected: true
