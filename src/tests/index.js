const knownErrors = new Set([
    "Workspace is already booked for the selected time period",
    "Customer not found",
    "Workspace not found",
    "Booking type not found",
]);

console.log(knownErrors.has("Workspace is already booked for the selected time period"));