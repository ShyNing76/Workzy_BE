import db from "../../models";
import { createWorkspaceImageService } from "./workspaceImage.service";
import { v4 } from "uuid";
import { Op } from "sequelize";
import {
    handleLimit,
    handleOffset,
    handleSortOrder,
} from "../../utils/handleFilter";
import { deleteImages } from "../../middlewares/imageGoogleUpload";

export const createWorkspaceService = async ({
    images,
    workspace_name,
    workspace_price,
    ...data
}) =>
    new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            const price_per_day = workspace_price * 8 * 0.8;
            const price_per_month = workspace_price * 22 * 0.8;

            const workspace = await db.Workspace.findOrCreate({
                where: {
                    workspace_name: workspace_name,
                },
                defaults: {
                    workspace_id: v4(),
                    building_id: data.building_id || null,
                    workspace_type_id: data.workspace_type_id,
                    workspace_name: workspace_name,
                    price_per_hour: workspace_price,
                    price_per_day,
                    price_per_month,
                    ...data,
                },
                transaction: t,
            });

            if (!workspace[1]) return reject("Workspace already exists");
            const workspaceId = workspace[0].workspace_id;

            if (images && images.length > 0) {
                console.log(images);
                const response = await createWorkspaceImageService(
                    { images, workspaceId },
                    t
                );
                if (response.err === 1) return reject(response.message);
            }
            await t.commit();
            resolve({
                err: 0,
                message: "Workspace created successfully!",
            });
        } catch (error) {
            await t.rollback();
            console.log(error);
            reject(error);
        }
    });

export const updateWorkspaceService = async (
    id,
    {
        workspace_name,
        building_id,
        workspace_price,
        workspace_type_id,
        images,
        ...data
    }
) =>
    new Promise(async (resolve, reject) => {
        try {
            if (building_id) {
                const isBuildingExist = await db.Building.findByPk(building_id);
                if (!isBuildingExist) return reject("Building is not exist");
            }
            const [isWorkspaceExist, isTypeExist] = await Promise.all([
                db.Workspace.findByPk(id),
                db.WorkspaceType.findByPk(workspace_type_id),
            ]);
            if (!isWorkspaceExist) return reject("Workspace is not exist");
            if (!isTypeExist) return reject("Workspace Type is not exist");

            const isWorkspaceNameDuplicated = await db.Workspace.findOne({
                where: {
                    workspace_name: workspace_name,
                    workspace_id: { [Op.ne]: id },
                },
            });

            if (isWorkspaceNameDuplicated)
                return reject("Workspace name is already used");

            const price_per_day = workspace_price * 8 * 0.8;
            const price_per_month = workspace_price * 22 * 0.8;

            const updatedRowsCount = await db.Workspace.update(
                {
                    workspace_name: workspace_name,
                    building_id: building_id,
                    workspace_type_id: workspace_type_id,
                    price_per_hour: workspace_price,
                    price_per_day: price_per_day,
                    price_per_month: price_per_month,
                    ...data,
                },
                {
                    where: {
                        workspace_id: id,
                    },
                }
            );

            if (images && images.length > 0) {
                console.log(images);
                const response = await createWorkspaceImageService({
                    images: images,
                    workspaceId: id,
                });
                if (response.err === 1) return reject(response.message);
            }
            if (updatedRowsCount[0] === 0)
                return reject(
                    "Cannot find any workspace to update || Workspace is already updated"
                );
            resolve({
                err: 0,
                message: "Workspace updated successfully!",
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });

export const deleteImageOfWorkspaceService = async (workspace_id, images) =>
    new Promise(async (resolve, reject) => {
        try {
            const workspace = await db.Workspace.findByPk(workspace_id);
            if (!workspace) return reject("Workspace is not exist");

            const deletedImages = await db.WorkspaceImage.destroy({
                where: {
                    workspace_id: workspace_id,
                    image: {
                        [Op.in]: images,
                    },
                },
            });

            await deleteImages(images);
            if (deletedImages === 0)
                return reject("Cannot find any image to delete");
            resolve({
                err: 0,
                message: "Image deleted successfully!",
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });

export const deleteWorkspaceService = async (id) =>
    new Promise(async (resolve, reject) => {
        try {
            const workspace = await db.Workspace.findOne({
                where: {
                    workspace_id: id,
                },
                attributes: ["status", "workspace_id"],
            });
            if (!workspace) return reject("Workspace is not exist");

            const changeStatus =
                workspace.status === "active" ? "inactive" : "active";

            const [updatedRowsCount] = await db.Workspace.update(
                {
                    status: changeStatus,
                },
                {
                    where: {
                        workspace_id: id,
                        status: workspace.status,
                    },
                }
            );
            if (updatedRowsCount === 0) {
                return reject("Cannot find any workspace to delete");
            }
            resolve({
                err: 0,
                message: `Workspace deleted successfully!`,
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });

export const getAllWorkspaceService = ({
    page,
    limit,
    order,
    workspace_name,
    office_size,
    min_price,
    max_price,
    workspace_type_name,
    building_id,
    status,
    ...query
}) =>
    new Promise(async (resolve, reject) => {
        try {
            const office_size_case = {
                1: { [Op.lte]: 10 },
                2: { [Op.between]: [10, 20] },
                3: { [Op.between]: [20, 30] },
                4: { [Op.between]: [30, 40] },
                5: { [Op.between]: [40, 50] },
                6: { [Op.gte]: 50 },
            };
            if (office_size) query.capacity = office_size_case[office_size];
            if (min_price && max_price)
                query.price_per_hour = { [Op.between]: [min_price, max_price] };
            query.status = status || { [Op.ne]: null };
            const workspaces = await db.Workspace.findAll({
                where: query,
                offset: handleOffset(page, limit),
                limit: handleLimit(limit),
                order: [handleSortOrder(order, "workspace_name")],
                attributes: {
                    exclude: ["building_id", "createdAt", "updatedAt"],
                },
                include: [
                    {
                        model: db.Building,
                        attributes: ["building_id"],
                        where: {
                            building_id: building_id
                                ? building_id
                                : { [Op.ne]: null },
                        },
                        required: true,
                    },
                    {
                        model: db.WorkspaceType,
                        attributes: ["workspace_type_name"],
                        where: {
                            workspace_type_name: workspace_type_name
                                ? workspace_type_name
                                : { [Op.ne]: null },
                        },
                        required: true,
                    },
                    {
                        model: db.WorkspaceImage,
                        attributes: ["image"],
                        required: false,
                    },
                ],
            });
            if (workspaces.length === 0) return reject("No Workspace Exist");
            resolve({
                err: 0,
                message: "Got Workspace successfully",
                data: workspaces,
            });
        } catch (error) {
            reject(error);
        }
    });

export const getWorkspaceByIdService = (workspace_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const workspace = await db.Workspace.findOne({
                where: {
                    workspace_id: workspace_id,
                },
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
                include: [
                    {
                        model: db.Building,
                        attributes: {
                            exclude: [
                                "buildingId",
                                "status",
                                "createdAt",
                                "updatedAt",
                            ],
                        },
                    },
                    {
                        model: db.WorkspaceImage,
                        attributes: ["image"],
                        required: true,
                    },
                ],
            });
            if (!workspace) return reject("Workspace is not exist");
            resolve({
                err: 0,
                message: "Got",
                data: workspace,
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });

export const assignWorkspacetoBuildingService = async ({workspace_ids, building_id}) =>
    new Promise(async (resolve, reject) => {
        try {
            // Await the result to check if the building exists
            const isBuildingExist = await db.Building.findByPk(building_id);
            if (!isBuildingExist) return reject("Building is not exist"); // Reject instead of resolve
            
            const workspace = await db.Workspace.findAll({
                where: {
                    workspace_id: {
                        [Op.in]: workspace_ids,
                    },
                },
            });
            if (workspace.length === 0) return reject("Workspace is not exist");

            // Await the updates to ensure they are completed
            const assignWorkspaceToBuilding = await Promise.all(workspace.map(async (w) => {
                const [updatedWorkspace] = await db.Workspace.update(
                    {
                        building_id: building_id,
                    },
                    {
                        where: {
                            workspace_id: w.workspace_id,
                            building_id: { [Op.eq]: null },
                        },
                    }
                );
                return updatedWorkspace;
            }));

            if(assignWorkspaceToBuilding[1] === 0) return reject("Workspace is already allocated to the building");
            resolve({
                err: 0,
                message: "Workspace allocated successfully!",
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });

export const unassignWorkspacetoBuildingService = async ({workspace_ids, building_id}) =>
    new Promise(async (resolve, reject) => {
        try {
            // Await the result to check if the building exists
            const isBuildingExist = await db.Building.findByPk(building_id);
            if (!isBuildingExist) return reject("Building is not exist"); // Reject instead of resolve
            
            const workspace = await db.Workspace.findAll({
                where: {
                    workspace_id: {
                        [Op.in]: workspace_ids,
                    },
                },
            });
            if (workspace.length === 0) return reject("Workspace is not exist");

            // Await the updates to ensure they are completed
            const assignWorkspaceToBuilding = await Promise.all(workspace.map(async (w) => {
                const [updatedWorkspace] = await db.Workspace.update(
                    {
                        building_id: null,
                    },
                    {
                        where: {
                            workspace_id: w.workspace_id,
                        },
                    }
                );
                return updatedWorkspace;
            }));

            if(assignWorkspaceToBuilding[1] === 0) return reject("Workspace unallocated failled"); 
            resolve({
                err: 0,
                message: "Workspace unallocated successfully!",
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });

export const getTotalWorkspaceService = async (tokenUser, building_id) => {
    try {
        let totalWorkspaces = 0;
        if(tokenUser.role_id === 1) {
            totalWorkspaces = await db.Workspace.count({
                where: {
                    status: "active",
                },
            });
        } else if(tokenUser.role_id === 2) {
            if(!building_id) return reject("Building is required");
            const isManagerBelongToBuilding = await db.Building.findOne({
                where: {
                    manager_id: tokenUser.user_id,
                    building_id: building_id,
                },
            });
            if(!isManagerBelongToBuilding) return reject("Manager does not belong to this building");
            totalWorkspaces = await db.Workspace.count({
                where: {
                    status: "active",
                },
                include: [
                    {
                        model: db.Building,
                        attributes: ["building_id"],
                        where: {
                            building_id: building_id,
                        },
                    },
                ],
            });
        }
        return {
            err: 0,
            message: "Got Total Workspace successfully",
            data: totalWorkspaces,
        };
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const getTotalUsageWorkspacesService = async (building_id) => {
    new Promise(async (resolve, reject) => {
    try {
        const booking = db.Booking.findAll({
            include: [
                {
                    model: db.BookingStatus,
                    required: true,
                    attributes: ["status"],
                    where: {
                        status: "usage",
                    },
                },{
                    model: db.Workspace,
                    required: true,
                    include: [
                        {
                            model: db.Building,
                            required: true,
                            attributes: ["building_id"],
                            where: {
                                building_id: building_id,
                            },
                        },
                    ],
                }
            ],
        });
        const totalUsageWorkspaces = new Set();
        for (let i = 0; i < booking.length; i++) {
            totalUsageWorkspaces.add(booking[i].workspace_id);
        }
        resolve({
            err: 0,
            message: "Got Total Usage Workspace successfully",
            data: totalUsageWorkspaces.size,
        });
    } catch (error) {
        console.log(error);
        reject(error);
    }
    });
}

export const getTotalWorkspaceNotInBookingService = async (building_id) => {
    new Promise(async (resolve, reject) => {
    try {
        const booking = await db.Booking.findAll({
            attributes: ["workspace_id"],
            include: [
                {
                    model: db.BookingStatus,
                    order: [["createdAt", "DESC"]],
                    limit: 1,
                    where: {
                        status: {[Op.in]: ["confirmed", "paid", "check-in", "completed", "check-out", "check-amenities", "damaged-payment"]},
                    },
                    required: false,
                },{
                    model: db.Workspace,
                    required: true,
                    include: [
                        {
                            model: db.Building,
                            required: true,
                            attributes: ["building_id"],
                            where: {
                                building_id: building_id,
                            },
                        },
                    ],
                }
            ],
        });
        const bookedWorkspaceIds = booking.map(b => b.workspace_id);
        const totalWorkspaces = await db.Workspace.count({
            where: {
                workspace_id: {
                    [Op.notIn]: bookedWorkspaceIds,
                },
            },
        });
        resolve({
            err: 0,
            message: "Got Total Workspace Not In Booking successfully",
            data: totalWorkspaces,
        });
    } catch (error) {
        console.log(error);
        reject(error);
    }
    });
}

export const getTop5WorkspaceReviewService = async () => {
    new Promise(async (resolve, reject) => {
    try {
        const rating = await db.Review.findAll({
            attributes: ["rating"],
            order: [["rating", "DESC"]],
            include: [
                {
                    model: db.Booking,
                    attributes: ["booking_id"],
                    required: true,
                },
            ],
        });
        if(rating.length === 0) return reject("No Review Exist");
        const bookings = await db.Booking.findAll({
            where:{
                booking_id: {[Op.in]: rating.map(r => r.booking_id)}
            },
            attributes: ["workspace_id"],
        });
        // const filterWorkspaceId = bookings.set("workspace_id");
        const top5WorkspaceReview = await db.Workspace.findAll({
            where: {
                workspace_id: {[Op.in]: bookings.map(b => b.workspace_id)}
            },
            limit: 5,
        });
        resolve({
            err: 0,
            message: "Got Top 5 Workspace Review successfully",
            data: top5WorkspaceReview,
        });
    } catch (error) {
        console.log(error);
        reject(error);
    }
    });
}
