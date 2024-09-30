import db from '../models/';
import {v4} from "uuid";

export const createWorkspaceImageService = async ({images, workspaceId}) => new Promise(async (resolve, reject) => {
    try {
        const workspaceImages = [];

        for (const image of images) {
            const [workspaceImage, created] = await db.WorkspaceImage.findOrCreate({
                where: {
                    image: image
                },
                defaults: {
                    workspace_image_id: v4(),
                    workspace_id: workspaceId || null, 
                    image: image
                }
            });
            
            workspaceImages.push({
                image: workspaceImage,
                created
            });
        }

        resolve({
            err: workspaceImages[1] ? 0 : 1,
            message: workspaceImages[1] ? 'Workspace Image created successfully!' : 'Workspace Image already exists',
            data: workspaceImages
        })

    } catch (error) {
        reject(error)
    }
})

export const deleteWorkspaceImageService = async ({workspaceImageID}) => new Promise(async (resolve, reject) => {
    try {
        const workspaceImages = await db.WorkspaceImage.findAll({
                where: {
                    workspace_image_id: workspaceImageID
                }
            }) 
            
        if (workspaceImages.length === 0) 
            return resolve({
                err: 1,
                message: "No workspace image found"
            })
        
        let alreadyInactiveCount = 0;
        let deletedCount = 0;

        for (const image of workspaceImages) {
            if (image.status === "inactive") {
                alreadyInactiveCount++;
            } else {
                image.status = "inactive";
                await image.save(); // Save each image after updating
                deletedCount++;
            }
        }

        if (deletedCount > 0) {
            resolve({
                err: 0,
                message: `${deletedCount} workspace image(s) deleted successfully!`
            });
        } else {
            resolve({
                err: 1,
                message: alreadyInactiveCount > 0 ? `${alreadyInactiveCount} selected images were already deleted.` : 'No images were deleted.'
            });
        }
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
        if (order) queries.order = [order || "workspace_id"];
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
        const workspaceImage = await db.WorkspaceImage.findAll({
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
            err: workspaceImage.length > 0 ? 0 : 1,
            message: workspaceImage.length > 0 ? "Got" : "No Workspace Exist",
            data: workspaceImage
        });
    } catch (error) {
        reject(error)
    }
})
