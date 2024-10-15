import db from '../../models';
import {v4} from "uuid";
import {handleLimit, handleOffset, handleSortOrder} from "../../utils/handleFilter";

export const createReviewService = async (data) => new Promise(async (resolve, reject) => {
    try {
        const review = await db.Review.Create({
            review_id: v4(),
            booking_id: data.booking_id,
            review_content: data.review_content,
            rating: data.rating,
        })
        if(!review) return reject("Failed to create review")
        resolve({
            err: 0,
            message: 'Review created successfully!',
            data: review
        })
    } catch (error) {
        reject(error)
    }
})

export const deleteReviewService = async (review_id) => new Promise(async (resolve, reject) => {
    try {
        const review = await db.Review.update({
            status: "inactive"
        }, {
            where: {
                review_id: review_id,
                status: "active"
            }
        })
        if(review[0] === 0) return reject("Review not found")
            resolve({
                err: 0,
                message: `Review deleted successfully!`
            });
        }
    catch (error) {
        reject(error)
    }
})

export const getAllReviewService = ({page, limit, order, ...query}) => new Promise(async (resolve, reject) => {
    try {
        const reviews = await db.Review.findAndCountAll({
            where: query,
            order: [handleSortOrder(order, "rating")],
            limit: handleLimit(limit),
            offset: handleOffset(page, limit),
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
        });
        if(reviews.count === 0) return reject("No Review Found")
        resolve({
            err: 0,
            message: "Got",
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
        if(!review) return reject("No Review Found")
        resolve({
            err: 0,
            message: "Got",
            data: review
        });
    } catch (error) {
        reject(error)
    }
})
