import db from "./models";
import { Op } from "sequelize";

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
        // Lấy tổng doanh thu trong tháng
        socket.on("newCompletedBookingInMonth", async () => {
            try {
                const currentYear = new Date().getFullYear(); // Lấy năm hiện tại
                const currentMonth = new Date().getMonth(); // Lấy tháng hiện tại (0-11)
                
                // Ngày đầu tháng (UTC)
                const startDate = new Date(Date.UTC(currentYear, currentMonth, 1)).toISOString();
                // Ngày cuối tháng (UTC)
                const endDate = new Date(Date.UTC(currentYear, currentMonth + 1, 0, 23, 59, 59)).toISOString();

                const totalPrice = await db.Booking.sum("total_price", {
                    where: {
                        createdAt: {
                            [Op.between]: [startDate, endDate],
                        },
                    },
                    include: [
                        {
                            model: db.BookingStatus,
                            order: [["createdAt", "DESC"]],
                            limit: 1,
                            where: {
                                status: "completed",
                            },
                            required: false,
                        },
                    ],
                });
                return socket.emit("totalPricesInMonth", totalPrice);
            } catch (error) {
                console.error("Error while fetching booking:", error);
                return socket.emit("error", "An error occurred while processing the booking");
            }
        });
        // Lấy tổng số booking
        socket.on("newBooking", async () => {
            try {
                const totalBooking = await db.Booking.count();
                return socket.emit("totalBooking", totalBooking);
            } catch (error) {
                console.error("Error while fetching booking:", error);
                socket.emit("error", "An error occurred while processing the booking");
            }
        });
        // Lấy tổng số voucher
        socket.on("newVoucher", async () => {
            try {
                const totalVoucher = await db.Voucher.count();
                return socket.emit("totalVoucher", totalVoucher);
            } catch (error) {
                console.error("Error while fetching voucher:", error);
                socket.emit("error", "An error occurred while processing the voucher");
            }
        });
        // lấy tổng số manager
        socket.on("newManager", async () => {
            try {
                const totalManager = await db.User.count({
                    where: {
                        role_id: 2,
                        status: "active",
                    },
                });
                return socket.emit("totalManager", totalManager);
            } catch (error) {
                console.error("Error while fetching manager:", error);
                socket.emit("error", "An error occurred while processing the manager");
            }
        });
        // Lấy tổng số staff
        socket.on("newStaff", async () => {
            try {
                const totalStaff = await db.User.count({
                    where: {
                        role_id: 3,
                        status: "active",
                    },
                });
                return socket.emit("totalStaff", totalStaff);
            } catch (error) {
                console.error("Error while fetching staff:", error);
                socket.emit("error", "An error occurred while processing the staff");
            }
        });
        // Lấy tổng số customer
        socket.on("newCustomer", async () => {
            try {
                const totalCustomer = await db.User.count({
                    where: {
                        role_id: 4,
                        status: "active",
                    },
                });
                return socket.emit("totalCustomer", totalCustomer);
            } catch (error) {
                console.error("Error while fetching customer:", error);
                socket.emit("error", "An error occurred while processing the customer");
            }
        });
        // Lấy tổng số building
        socket.on("newBuilding", async () => {
            try {
                const totalBuilding = await db.Building.count({
                    where: {
                        status: "active",
                    },
                });
                return socket.emit("totalBuilding", totalBuilding);
            } catch (error) {
                console.error("Error while fetching building:", error);
                socket.emit("error", "An error occurred while processing the building");
            }
        });
        // Lấy tổng số workspace
        socket.on("newWorkspace", async () => {
            try {
                const totalWorkspace = await db.Workspace.count({
                    where: {
                        status: "active",
                    },
                });
                return socket.emit("totalWorkspace", totalWorkspace);
            } catch (error) {
                console.error("Error while fetching workspace:", error);
                socket.emit("error", "An error occurred while processing the workspace");
            }
        });
        // Lấy tổng số Amenities
        socket.on("newAmenities", async () => {
            try {
                const totalAmenities = await db.Amenities.count({
                    where: {
                        status: "active",
                    },
                });
                return socket.emit("totalAmenities", totalAmenities);
            } catch (error) {
                console.error("Error while fetching amenities:", error);
                socket.emit("error", "An error occurred while processing the amenities");
            }
        });


        // lấy 5 booking mới nhất
        socket.on("newFiveBooking", async () => {
            try {
                const bookings = await db.Booking.findAll({
                    order: [["createdAt", "DESC"]],
                    limit: 5,
                    include: [
                        {
                            model: db.BookingStatus,
                            order: [["createdAt", "DESC"]],
                            limit: 1,
                            required: false,
                        },
                        {
                            model: db.Customer,
                            attributes: [],
                            include: [
                                {
                                    model: db.User,
                                    attributes: ["name"],
                                },
                            ],
                        },
                        {
                            model: db.Workspace,
                            attributes: ["workspace_name"],
                        },
                    ],
                });
                return socket.emit("fiveBooking", bookings);
            } catch (error) {
                console.error("Error while fetching booking:", error);
                socket.emit("error", "An error occurred while processing the booking");
            }
        });

        // lấy 5 customer cao điểm nhất
        socket.on("newFiveCustomer", async () => {
            try {
                const customers = await db.Customer.findAll({
                    order: [["point", "DESC"]],
                    limit: 5,
                    include: [
                        {
                            model: db.User,
                            attributes: ["name"],
                        },
                    ],
                });
                return socket.emit("fiveCustomer", customers);
            } catch (error) {
                console.error("Error while fetching customer:", error);
                socket.emit("error", "An error occurred while processing the customer");
            }
        });
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });
}
