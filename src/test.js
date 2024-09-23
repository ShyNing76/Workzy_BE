import db from "./models";
import jwt from "jsonwebtoken";
import {v4} from "uuid";

require('dotenv').config()

// async function getProfile() {
//     try {
//         const customer = await db.User.findOne({
//             where: {
//                 email: 'lehoangtrong1@gmail.com'
//             },
//             include: {
//                 model: db.Customer,
//                 attributes: {
//                     exclude: ['created_at', 'updated_at', 'customer_id', 'createdAt', 'updatedAt']
//                 }
//             },
//             raw: true
//         });
//
//         console.log(customer)
//     } catch (err) {
//         console.log(err)
//     }
// }

async function updateProfile(accessToken) {
    try {
        console.log(accessToken.split(' ')[1])
        jwt.verify(accessToken.split(' ')[1], process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                console.log("Invalid access token")
            }

            const updateFields = {
                phone: '0987654321',
                gender: 'male',
                date_of_birth: '1999-01-01'
            }
            const customer = await db.Customer.findOrCreate({
                where: {
                    user_id: decoded.user_id
                },
                defaults: {
                    customer_id: v4(),
                    user_id: decoded.user_id,
                    ...updateFields
                }
            });

            console.log(customer)
            //
            // if(!customer) {
            //     const response = await db.Customer.create({
            //         customer_id: v4(),
            //         user_id: decoded.user_id,
            //         ...updateFields
            //     })
            //     console.log("Create new customer")
            // }
            //
            // const affectedRows = await db.Customer.update(...updateFields, {
            //     where: {
            //         user_id: decoded.user_id
            //     }
            // });
            //
            // console.log(affectedRows)
            //
            // if (affectedRows[0] === 0) {
            //     console.log("Update failed")
            // }
            // else {
            //     console.log("Update successful")
            // }
        });
    } catch (error) {
        console.log(error)
    }
}


updateProfile("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZGU2ZTI1NjItOGRmOS00MTc3LWFhMjAtMTZhMWRlZjA4ZTQ1IiwiZW1haWwiOiJsZWhvYW5ndHJvbmcxQGdtYWlsLmNvbSIsImlhdCI6MTcyNzA4NjM5NSwiZXhwIjoxNzI3MDg5OTk1fQ.RY-75snlEqvra3Qb7oVvG68UHdIY9oC3GlwLNCdL9IA")