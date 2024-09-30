import db from '../models/';
import {v4} from "uuid";

export const createWishListService = async ({workspace_id}, customer_id) => new Promise(async (resolve, reject) => {
    try {

        const customer = await db.Customer.findByPk(customer_id);

        if(!customer) return resolve({
            err: 1,
            message: "No valid customer found"
        })

        const workspaces = await db.Workspace.findAll({
            where: {
                workspace_id: {[Op.in]: workspace_id}
            }
        })

        if (workspaces.length === 0) 
            return resolve({
                err: 1,
                message: 'No valid workspaces found',
            });
        

            const wishList = workspaces.map(workspace => {
                return db.Wishlist.create({
                    wishlist_id: v4(), 
                    workspace_id: workspace.workspace_id,
                    customer_id: customer.customer_id
                });
            });
    
            // Execute all insertions
            await Promise.all(wishList);
    
            resolve({
                err: 0,
                message: 'WishList created successfully!',
            });
    } catch (error) {
        reject(error)
    }
})

export const deleteWishListService = async ({wishlist_id}) => new Promise(async (resolve, reject) => {
    try {
          const wishlist = await db.Wishlist.destroy({
            where: {
                wishlist_id: {[Op.in]: wishlist_id}
            }
          });
          resolve({
            err: wishlist > 0 ? 0 : 1,
            mes: wishlist > 0 ? `WishList deleted successfully!`
            : "No WishList found to delete"
          })
    } catch (error) {
        reject(error)
    }
})
