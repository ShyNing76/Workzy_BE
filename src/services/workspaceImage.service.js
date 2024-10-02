import db from '../models';
import {v4} from "uuid";

export const createWorkspaceImageService = async ({images, workspaceId}, transaction) => {
    try {
        let foundCount = 0;
        for (const image of images) {
            const [workspaceImage, created] = await db.WorkspaceImage.findOrCreate({
                where: {
                    image: image
                },
                defaults: {
                    workspace_image_id: v4(),
                    workspace_id: workspaceId || null, 
                    image: image
                },
                transaction: transaction
            });
            if(!created) foundCount++;
        }
        return foundCount;
    } catch (error) {
        await transaction.rollback();
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
        const offset = !page || +page <= 1 ? 0 : +page - 1;
        const finalLimit = +limit || +process.env.PAGE_LIMIT;
        queries.offset = offset * finalLimit;
        queries.limit = finalLimit;
        if (order) queries.order = [order];
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
