import { v4 } from "uuid";
import db from "../../../models";
import { Op } from "sequelize";

export const createAmenitiesBookingService = (tokenUser, total_amenities_price, {booking_id, amenity_ids, quantities}) => //booking_id amenity_id quantity amenitiy_price
  new Promise(async (resolve, reject) => {
    const t = await db.sequelize.transaction();
    try {
      const customer = await db.Customer.findOne({where: {user_id: tokenUser.user_id}});
      const [amenities, booking] = await Promise.all([
        db.Amenity.findAll({ 
            where: {
                 amenity_id: {
                    [Op.in]: amenity_ids
                }
            }
        }),
        db.Booking.findOne({ 
            where: { 
                customer_id: customer.customer_id,
                booking_id: booking_id 
            }, 
            include: [
                {
                    model: db.BookingStatus, 
                    where: { 
                        status: "in-process" 
                    },
                    required: true
                }
            ]
        }),
      ]);
      if (amenities.length === 0 || !booking) 
        return reject(!booking ? "Booking not found" : "No valid amenities found")

      const bookingAmenities = amenities.map((amenity, index) => {
        const quantity = quantities[index];
        const bookingAmenity = {
          booking_amenities_id: v4(),
          booking_id: booking.booking_id,
          amenity_id: amenity.amenity_id,
          quantity: quantity,
          price: amenity.type === "Device" ? 
              amenity.rent_price * quantity : 
              amenity.original_price * quantity
        }
        return db.BookingAmenities.create(bookingAmenity, {transaction: t});
      });
      await Promise.all(bookingAmenities);
      booking.total_amenities_price = parseInt(total_amenities_price)
      await booking.save({transaction: t});           
      await t.commit();
      resolve({
        err: 0,
        message: "Add Amenities Booking successfully",
        data: {
          booking
        }
      });
    } catch (error) {
      console.log(error);
      await t.rollback();
      reject(error);
    }
  });
