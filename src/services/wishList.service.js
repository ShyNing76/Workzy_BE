import db from '../models/';
import { Op } from 'sequelize';
import {v4} from "uuid";

export const createWishListService = ({workspace_ids, customer_id}) => new Promise(async (resolve, reject) => {
    try {

        const customer = await db.Customer.findByPk(customer_id);

        if(!customer) return reject("No valid customer found");

        const workspaces = await db.Workspace.findAll({
            where: {
                workspace_id: {[Op.in]: workspace_ids}
            }
        })

        if (workspaces.length === 0) return reject('No valid workspaces found');
        

            const wishList = workspaces.map(workspace => {
                return db.Wishlist.findOrCreate({
                    where: {
                        workspace_id: workspace.workspace_id,
                        customer_id: customer.customer_id
                    },
                    defaults: {
                        wishlist_id: v4(), 
                        workspace_id: workspace.workspace_id,
                        customer_id: customer.customer_id
                    }
                })
            });
    
            // Execute all insertions
            const results = await Promise.all(wishList);
            const newRecordsCount = results.filter(result => result[1]).length; // result[1] is true if a new entry was created
            if(newRecordsCount === 0) return reject('Error creating WishList');
            resolve({
                err: 0,
                message: `${newRecordsCount} WishList created successfully!`
            });
    } catch (error) {
        reject(error)
    }
})

export const deleteWishListService = ({wishlist_id}) => new Promise(async (resolve, reject) => {
    try {
        const wishlist = await db.Wishlist.destroy({
            where: {
                wishlist_id: {[Op.in]: wishlist_id}
            }
        });
        if(wishlist === 0) return reject("No WishList found to delete");
        resolve({
            err: 0,
            message: `${wishlist} WishList deleted successfully!`
        })
    } catch (error) {
        reject(error)
    }
})
