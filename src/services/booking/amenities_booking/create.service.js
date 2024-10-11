import { v4 } from "uuid";
import db from "../../../models";
import { Op } from "sequelize";

export const createAmenitiesBookingService = (tokenUser, {booking_id, amenity_ids, quantities}) => //booking_id amenity_id quantity amenitiy_price
  new Promise(async (resolve, reject) => {
    const t = await db.sequelize.transaction();
    try {
      console.log(amenity_ids);
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
      if (amenities.length === 0 || !booking) {
        return reject(!booking ? "Booking not found" : "No valid amenities found")}

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
        console.log(bookingAmenity)
        return db.BookingAmenities.create(bookingAmenity, 
          {
            transaction: t,
          }
        );
      });
      await Promise.all(bookingAmenities);
      // console.log(results[1]);
      // const newRecordsCount = results.filter(result => result[1]).length; // result[1] is true if a new entry was created
      // if (newRecordsCount === 0) return reject('Error associating amenities with booking');

      const total_amenities_price = (await db.BookingAmenities.sum('price', {
            where: {
                booking_id: booking.booking_id
            },
            transaction: t
        })) || 0
      if(total_amenities_price === 0) return reject("Cannot find total price")
      booking.total_amenities_price = total_amenities_price
      console.log(parseInt(booking.workspace_price))
      console.log(parseInt(booking.total_amenities_price))
      console.log(parseInt(booking.total_price))
      booking.total_price = parseInt(booking.workspace_price) + parseInt(booking.total_amenities_price)
      console.log(booking.total_price)

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
