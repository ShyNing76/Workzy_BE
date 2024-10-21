import db from "./models";

export const initSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("a user connected");
        socket.on("newCompletedBooking", async (data) => {
            try {
                const booking = await db.Booking.findOne({
                    where: {
                        id: data.id,
                        status: "completed",
                    },
                }); 
                if (!booking) {
                    return socket.emit("error", "Booking is not completed or doesn't exist");
                }
                const totalPrice = await db.Booking.sum("total_price", {
                    where: {
                        status: "completed",
                    },
                });
                return socket.emit("revenue", totalPrice);
                // data.currentRevenue = parseInt(data.currentRevenue) + parseInt(booking.total_price);
                // io.emit("revenue", data.currentRevenue);
            } catch (error) {
                console.error("Error while fetching booking:", error);
                socket.emit("error", "An error occurred while processing the booking");
            }
            
        });
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });
}