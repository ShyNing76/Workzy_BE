import db from "../models";

export const removeUserService = (userId) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.User.findOne({
            where: {
                user_id: userId
            }
        });

        if (!user) {
            return reject('User not found')
        }

        user.setStatus('inactive');
        await user.save();

        resolve({
            err: 0,
            message: 'Remove user successful'
        })
    } catch (error) {
        reject(error)
    }
});