import db from '../../models';
import {v4} from "uuid";

export const createReviewService = async (data) => new Promise(async (resolve, reject) => {
    try {
        const booking = await db.Booking.findOne({
            where: { booking_id: data.booking_id },
            include: [
                {
                    model: db.BookingStatus,
                    as: "BookingStatuses",
                    order: [["createdAt", "DESC"]],
                    limit: 1,
                },
            ],
        });

        if (!booking) return reject("Booking not found");

        if (booking.BookingStatuses[0].status !== "completed")
            return reject("Booking is not completed");

        if (booking.BookingStatuses[0].status === "cancelled")
            return reject("Booking already cancelled");

        const review = await db.Review.create({
            review_id: v4(),
            booking_id: data.booking_id,
            review_content: data.review_content,
            rating: data.rating,
        })
        resolve({
            err: 0,
            message: 'Review created successfully!',
            data: review
        })

    } catch (error) {
        console.log(error)
        reject(error)
    }
})

// export const deleteReviewService = async ({amenity_id}) => new Promise(async (resolve, reject) => {
//     try {
//         const review = await db.Review.findAll({
//                 where: {
//                     amenity_id: amenity_id
//                 }
//             }) 
            
//         if (amenities.length === 0) 
//             return resolve({
//                 err: 1,
//                 message: "No amenity found"
//             })
        
//         let alreadyInactiveCount = 0;
//         let deletedCount = 0;

//         for (const amenity of amenities) {
//             if (amenity.status === "inactive") {
//                 alreadyInactiveCount++;
//             } else {
//                 amenity.status = "inactive";
//                 await amenity.save(); // Save each image after updating
//                 deletedCount++;
//             }
//         }

//         if (deletedCount > 0) {
//             resolve({
//                 err: 0,
//                 message: `${deletedCount} amenity(s) deleted successfully!`
//             });
//         } else {
//             resolve({
//                 err: 1,
//                 message: alreadyInactiveCount > 0 ? `${alreadyInactiveCount} selected amenities were already deleted.` : 'No images were deleted.'
//             });
//         }
//     } catch (error) {
//         reject(error)
//     }
// })

export const getAllReviewService = ({page, limit, order, ...query}) => new Promise(async (resolve, reject) => {
    try {
        const queries = { raw: true, nest: true };
        const offset = !page || +page <= 1 ? 0 : +page - 1;
        const finalLimit = +limit || +process.env.PAGE_LIMIT;
        queries.offset = offset * finalLimit;
        queries.limit = finalLimit;
        if (order) queries.order = [order];

        const reviews = await db.Review.findAndCountAll({
            where: {
                ...query, 
            },
            ...queries,
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
        });

        resolve({
            err: reviews.count > 0 ? 0 : 1,
            message: reviews.count > 0 ? "Got" : "No Amenity Exist",
            data: reviews
        });
    } catch (error) {
        reject(error)
    }
})

export const getReviewByIdService = (review_id) => new Promise(async (resolve, reject) => {
    try {
        const review = await db.Review.findOne({
            where: {
                review_id: review_id
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
            raw: true
        });
        resolve({
            err: review ? 0 : 1,
            message: review ? "Got" : "No Amenity Exist",
            data: review
        });
    } catch (error) {
        reject(error)
    }
})
