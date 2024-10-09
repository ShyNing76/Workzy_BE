import { v4 } from "uuid";
import db from "../../../models";
import { Op } from "sequelize";

export const createAmenitiesBookingService = ({booking_id, amenity_ids, quantities}) => //booking_id amenity_id quantity amenitiy_price
  new Promise(async (resolve, reject) => {
    const t = await db.sequelize.transaction();
    try {
      console.log(amenity_ids);
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
                booking_id: booking_id 
            }, 
            include: [
                {
                    model: db.BookingStatus, 
                    where: { 
                        status: "in-process" 
                    },
                    attribute: ["status"],
                    required: true
                }
            ]
        }),
      ]);
      console.log(amenities.length);
      console.log(booking);
      if (amenities.length === 0 || !booking || booking === null) {
        return reject(!booking ? "Booking not found" : "No valid amenities found")}

      const bookingAmenities = amenities.map((amenity, index) => {
        console.log(amenity.type)
        console.log(amenity.rent_price)
        console.log(amenity.original_price)
        const quantity = quantities[index];
          return db.BookingAmenities.create({
            booking_amenities_id: v4(),
            booking_id: booking.booking_id,
            amenity_id: amenity.amenity_id,
            quantity: quantity,
            amenitiy_price: amenity.type === "amenity" ? 
                amenity.rent_price * quantity : 
                amenity.original_price * quantity
          }, 
          {
            transaction: t,
          }
        );
      });
      const results = await Promise.all(bookingAmenities);
      const newRecordsCount = results.filter(result => result[1]).length; // result[1] is true if a new entry was created
      if (newRecordsCount === 0) return reject('Error associating amenities with booking');

      const total_amenities_price = db.BookingAmenities.sum('amenitiy_price', {
            where: {
                booking_id: booking.booking_id
            },
            transaction: t
        });
        console.log(total_amenities_price)
        if(total_amenities_price.length === 0) return reject("Cannot find total price")
      await booking.update({
        total_amenities_price: total_amenities_price
      },{
        where: {
          booking_id: booking.booking_id
        }, 
        transaction: t
      });           
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
