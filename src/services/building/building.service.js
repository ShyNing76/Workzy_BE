import { v4 } from "uuid";
import db from "../../models";
import { isDuplicate } from "../../utils/checkDuplicate";
import {
    handleLimit,
    handleOffset,
    handleSortOrder,
} from "../../utils/handleFilter";
import { Op } from "sequelize";
import { deleteImages } from "../../middlewares/imageGoogleUpload";

export const getBuildingService = ({
    page,
    limit,
    order,
    building_name,
    ...query
}) =>
    new Promise(async (resolve, reject) => {
        try {
            const fName = building_name || "";

            const buildings = await db.Building.findAndCountAll({
                where: {
                    building_name: {
                        [db.Sequelize.Op.substring]: fName,
                    },
                    ...query,
                },
                attributes: {
                    exclude: [
                        "created_at",
                        "updated_at",
                        "createdAt",
                        "updatedAt",
                    ],
                },
                include: [
                    {
                        model: db.BuildingImage,
                        as: "BuildingImages",
                        attributes: ["image"],
                        required: false,
                    },
                    {
                        model: db.Manager,
                        as: "Manager",
                        include: {
                            model: db.User,
                            as: "User",
                            attributes: {
                                exclude: [
                                    "created_at",
                                    "updated_at",
                                    "createdAt",
                                    "updatedAt",
                                    "password",
                                    "user_id",
                                ],
                            },
                        },
                    },
                    {
                        model: db.BuildingImage,
                        as: "BuildingImages",
                        attributes: ["image"],
                    },
                ],
                order: [handleSortOrder(order, "building_name")],
                limit: handleLimit(limit),
                offset: handleOffset(page, limit),
            });

            if (buildings.count === 0) {
                return reject("No building found");
            }

            resolve({
                err: 0,
                message: "Buildings found",
                data: buildings.rows,
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });

export const getBuildingByIdService = (id) =>
    new Promise(async (resolve, reject) => {
        try {
            const building = await db.Building.findOne({
                where: {
                    building_id: id,
                },
                attributes: {
                    exclude: [
                        "created_at",
                        "updated_at",
                        "createdAt",
                        "updatedAt",
                    ],
                },
                include: {
                    model: db.BuildingImage,
                    as: "BuildingImages",
                    attributes: ["image"],
                    required: false,
                },
            });

            if (!building) {
                return reject("Building not found");
            }

            resolve({
                err: 0,
                message: "Building found",
                data: building,
            });
        } catch (error) {
            reject(error);
        }
    });
export const createBuildingService = (data) =>
    new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            const isBuildingNameExist = await isDuplicate(
                db.Building,
                "building_name",
                data.building_name
            );
            if (isBuildingNameExist)
                return reject("Building name already exists");

            // get images and building from data
            const { images, ...building } = data;

            const newBuilding = await db.Building.create(
                {
                    building_id: v4(),
                    ...building,
                },
                {
                    transaction: t,
                }
            );

            if (images && images.length > 0) {
                console.log(images);
                try {
                    await createBuildingImages(
                        images,
                        newBuilding.building_id,
                        t
                    );
                } catch (error) {
                    await t.rollback();
                    return reject(error.message);
                }
            }

            await t.commit();

            resolve({
                err: 0,
                message: "Building created successfully",
            });
        } catch (error) {
            console.log(error);
            await t.rollback();
            reject(error);
        }
    });

export const updateBuildingService = (id, firebaseUrl, remove_images, data) =>
    new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            const building = await db.Building.findOne({
                where: {
                    building_id: id,
                },
            });
            if (!building) {
                return reject("Building not found");
            }

            console.log(data);

            const isBuildingNameExist = await db.Building.findOne({
                where: {
                    building_name: data.building_name,
                    building_id: { [db.Sequelize.Op.ne]: id },
                },
            });
            if (isBuildingNameExist) {
                return reject("Building name already exists");
            }

            delete data.remove_images;

            building.set({ ...building.dataValues, ...data });
            await building.save({ transaction: t });

            try {
                console.log(remove_images);
                if (remove_images) {
                    const remove_images_array = remove_images.split(",");
                    if (remove_images_array && remove_images_array.length > 0) {
                        // xóa ảnh cũ trong db
                        await db.BuildingImage.destroy({
                            where: {
                                building_id: id,
                                image: {
                                    [Op.in]: remove_images_array,
                                },
                            },
                            transaction: t,
                        });
                        // xóa ảnh cũ trong firebase
                        await deleteImages(remove_images_array);
                    }
                }
                // tạo mới những ảnh thêm mới
                await createBuildingImages(
                    firebaseUrl,
                    building.building_id,
                    t
                );
            } catch (error) {
                console.log(error);
                reject(error.message);
            }

            await t.commit();

            resolve({
                err: 0,
                message: "Building updated successfully",
                data: {
                    ...building.dataValues,
                },
            });
        } catch (error) {
            console.log(error);
            await t.rollback();
            reject(error);
        }
    });

export const assignManagerService = (building_id, manager_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const [building, manager] = await Promise.all([
                db.Building.findOne({
                    where: { building_id, status: "active" },
                }),
                db.Manager.findOne({ where: { manager_id } }),
            ]);
            console.log(building, manager);
            if (!building) return reject("Building not found");
            if (!manager) return reject("Manager not found");

            building.manager_id = manager_id;
            await building.save();

            resolve({ err: 0, message: "Manager assigned successfully" });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });

export const deleteBuildingImageService = (id, images) =>
    new Promise(async (resolve, reject) => {
        try {
            const building = await db.Building.findOne({
                where: {
                    building_id: id,
                },
                include: {
                    model: db.BuildingImage,
                    as: "BuildingImages",
                },
            });
            if (!building) {
                return reject("Building not found");
            }

            const imageUrls = building.BuildingImages.map((item) => item.image);
            await deleteImages(imageUrls);

            await db.BuildingImage.destroy({
                where: {
                    building_id: id,
                    image: {
                        [Op.in]: images,
                    },
                },
            });

            resolve({
                err: 0,
                message: "Building image updated successfully",
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });

export const removeManagerService = (id) =>
    new Promise(async (resolve, reject) => {
        try {
            const building = await db.Building.findOne({
                where: {
                    building_id: id,
                },
            });
            if (!building) {
                return reject("Building not found");
            }

            building.setManager(null);
            await building.save();

            resolve({
                err: 0,
                message: "Manager removed successfully",
            });
        } catch (error) {
            reject(error);
        }
    });

export const updateBuildingStatusService = (id, status) =>
    new Promise(async (resolve, reject) => {
        try {
            const building = await db.Building.findOne({
                where: {
                    building_id: id,
                },
            });
            if (!building) {
                return reject("Building not found");
            }

            building.status = status;
            await building.save();

            resolve({
                err: 0,
                message: "Building status updated successfully",
            });
        } catch (error) {
            reject(error);
        }
    });

export const deleteBuildingService = (id) =>
    new Promise(async (resolve, reject) => {
        try {
            const building = await db.Building.update(
                {
                    status: "inactive",
                },
                {
                    where: {
                        building_id: id,
                    },
                }
            );
            if (building[0] === 0) {
                return reject("Building not found");
            }
            resolve({
                err: 0,
                message: "Building deleted successfully",
            });
        } catch (error) {
            reject(error);
        }
    });

//lấy tổng số building
export const getTotalBuildingService = () =>
    new Promise(async (resolve, reject) => {
        try {
            const totalBuilding = await db.Building.count({
                where: {
                    status: "active",
                },
            });
            resolve({
                err: 0,
                message: "Total building found",
                data: totalBuilding,
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });

const createBuildingImages = async (images, building_id, t) => {
    const uniqueImages = new Set();
    const newImages = []; // tạo ra mảng mới chứa những ảnh không trùng lặp

    for (const image of images) {
        if (!uniqueImages.has(image)) {
            uniqueImages.add(image);
            newImages.push(image);
        }
    }
    console.log(newImages);

    try {
        await Promise.all(
            newImages.map((image) =>
                db.BuildingImage.create(
                    {
                        building_id,
                        image: image.firebaseUrl,
                    },
                    { transaction: t }
                )
            )
        );
    } catch (error) {
        console.error("Failed to create building images:", error);
        throw error;
    }
};
