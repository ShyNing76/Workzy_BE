import db from "../../models";
import { v4 } from "uuid";
import {
    handleLimit,
    handleOffset,
    handleSortOrder,
} from "../../utils/handleFilter";

export const createWishListService = ( {workspace_id, user_id} ) =>
    new Promise(async (resolve, reject) => {
        try {
            console.log(workspace_id);
            console.log(user_id);
            const customer = await db.User.findOne({
                where: { user_id: user_id, status: "active" },
                include: [{ model: db.Customer, attributes: ["customer_id"] },],
            })

            if (!customer) return reject("No valid customer found");

            const workspace = await db.Workspace.findOne({
                where: { workspace_id: workspace_id, status: "active" },
            });

            if (!workspace) return reject("No valid workspace found");

            const wishList = await db.Wishlist.findOrCreate({
                where: {
                    workspace_id: workspace.workspace_id,
                    customer_id: customer.Customer.customer_id,
                },
                defaults: {
                    wishlist_id: v4(),
                    workspace_id: workspace.workspace_id,
                    customer_id: customer.Customer.customer_id,
                },
            });

            if (!wishList[1]) return reject("Workspace already in WishList");
            resolve({
                err: 0,
                message: "WishList created successfully!",
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });

export const deleteWishListService = (wishlist_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const wishlist = await db.Wishlist.destroy({
                where: {
                    wishlist_id: wishlist_id,
                },
            });
            if (!wishlist) return reject("No WishList found to delete");
            resolve({
                err: 0,
                message: "WishList deleted successfully!",
            });
        } catch (error) {
            reject(error);
        }
    });

export const getAllWishListService = ({ page, limit, order, ...query }) =>
    new Promise(async (resolve, reject) => {
        try {
            const wishlist = await db.Wishlist.findAll({
                where: query,
                offset: handleOffset(page, limit),
                limit: handleLimit(limit),
                order: [handleSortOrder(order, "created_at")],
                attributes: {
                    exclude: ["created_at", "updated_at"],
                },
                include: [
                    {
                        model: db.Workspace,
                        attributes: [
                            "workspace_id",
                            "workspace_name",
                            "price_per_hour",
                            "price_per_day",
                            "price_per_month",
                        ],
                        required: true,
                    },
                    {
                        model: db.Customer,
                        attributes: ["customer_id"],
                        required: true,
                        include: [
                            {
                                model: db.User,
                                attributes: ["user_id", "name"],
                            },
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });
            if (wishlist.length === 0) return reject("No WishList Exist");
            resolve({
                err: 0,
                message: "WishList fetched successfully!",
                data: wishlist,
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });

export const getWishListByUserIdService = (tokenUser) =>
    new Promise(async (resolve, reject) => {
        try {
            const customer = await db.Customer.findOne({
                where: { user_id: tokenUser.user_id },
            });
            if (!customer) return reject("No valid customer found");
            const wishlist = await db.Wishlist.findAll({
                where: { customer_id: customer.customer_id },
                attributes: { exclude: ["created_at", "updated_at"] },
                raw: true,
                nest: true,
            });
            if (wishlist.length === 0) return reject("No WishList Exist");
            resolve({
                err: 0,
                message: "WishList fetched successfully!",
                data: wishlist,
            });
        } catch (error) {
            reject(error);
        }
    });
