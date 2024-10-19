const moment = require("moment");

function cancelBooking(bookingDate) {
    const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
    console.log("Current Date: " + currentDate);

    const start_time_date = moment(bookingDate).format("YYYY-MM-DD HH:mm:ss");
    console.log("Start Time Date: " + start_time_date);
    const diff = moment(currentDate).diff(moment(start_time_date), "days");

    if (diff > 1) {
        console.log(
            "You are late by " +
                diff +
                " days. Booking canceled but cannot refund."
        );
    } else {
        console.log("You are on time. Booking confirmed.");
    }

    console.log("Difference in days: " + diff);
}

// Example usage
cancelBooking("2024-11-20T12:00:00Z");
