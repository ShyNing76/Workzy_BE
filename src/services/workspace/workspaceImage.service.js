import db from '../../models';
import {v4} from "uuid";
import { handleLimit, handleOffset, handleSortOrder } from "../../utils/handleFilter";
export const createWorkspaceImageService = async ({images, workspaceId}, t) => {
    try {
        await Promise.all(images.map(async (image) => {
            const [workspaceImage, created] = await db.WorkspaceImage.findOrCreate({
                where: {
                    image: image.firebaseUrl,
                },
                defaults: {
                    workspace_image_id: v4(),
                    workspace_id: workspaceId,
                    image: image.firebaseUrl,
                },
                transaction: t
            });
        }));
        return {
            "err": 0,
            "message": "Workspace image created successfully!"
        };
    } catch (error) {
        await t.rollback();
        return {
            "err": 1,
            "message": error.message
        };
    }
}

export const deleteWorkspaceImageService = async ({workspaceImageID}) => new Promise(async (resolve, reject) => {
    try {
        const [updatedRowsCount] = await db.WorkspaceImage.update({
                status: "inactive"
            }, {
                where: {
                    workspace_image_id: {
                        [Op.in]: workspaceImageID
                    },
                    status: "active"
                }
            }) 
        resolve({
            err: updatedRowsCount > 0 ? 0 : 1,
            message: updatedRowsCount > 0 ? `${updatedRowsCount} workspace image(s) deleted successfully!` : 'No workspace image found',
        });
    } catch (error) {
        reject(error)
    }
})

export const getAllWorkspaceImageService = ({page, limit, order, image, ...query}) => new Promise(async (resolve, reject) => {
    try {
        const queries = { raw: true, nest: true };
        queries.offset = handleOffset(page, limit);
        queries.limit = handleLimit(limit);
        if (order) queries.order = [handleSortOrder(order, "image")];
        if (image) query.image = image;

        const workspaceImages = await db.WorkspaceImage.findAndCountAll({
            where: {
                ...query, 
            },
            ...queries,
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
            include: [
                {
                    model: db.Workspace,
                    attributes: {exclude : ["createdAt", "updatedAt"]},
                }, 
            ],
        });

        resolve({
            err: workspaceImages.count > 0 ? 0 : 1,
            message: workspaceImages.count > 0 ? "Got" : "No Workspace Image Exist",
            data: workspaceImages
        });
    } catch (error) {
        reject(error)
    }
})

export const getWorkspaceImageByWorkspaceIdService = (workspaceId) => new Promise(async (resolve, reject) => {
    try {
        const workspaceImage = await db.WorkspaceImage.findOne({
            where: {
                workspace_id: workspaceId
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
            include: {
                model: db.Workspace,
                attributes: {
                exclude: ["createdAt","updatedAt"]
                },
            }
        });
        resolve({
            err: workspaceImage > 0 ? 0 : 1,
            message: workspaceImage > 0 ? "Got" : "No Workspace Exist",
            data: workspaceImage
        });
    } catch (error) {
        reject(error)
    }
})
