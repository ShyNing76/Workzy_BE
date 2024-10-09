import db from '../../models';
import { createWorkspaceImageService } from './workspaceImage.service';
import {v4} from "uuid";
import {Op} from "sequelize";
import { handleLimit, handleOffset, handleSortOrder } from "../../utils/handleFilter";

export const createWorkspaceService = async ({images, workspace_name, workspace_price, ...data}) => new Promise(async (resolve, reject) => {
    const t = await db.sequelize.transaction();
    try {
        const price_per_day = workspace_price * 8 * 0.8;
        const price_per_month = workspace_price * 22 * 0.8;

        const workspace = await db.Workspace.findOrCreate({
            where: {
                workspace_name: workspace_name
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
            transaction: t
        });

        if(!workspace[1]) return reject("Workspace already exists")
        const workspaceId = workspace[0].workspace_id;
        const workspaceImages = await createWorkspaceImageService({images, workspaceId}, t);
        if(workspaceImages.foundCount > 0) return reject(`${workspaceImages.foundCount} Workspace Image is already exist`)
        await t.commit();
        resolve({
            err: 0,
            message: 'Workspace created successfully!',
            data: {workspace: workspace[0], workspaceImages}
        })
    } catch (error) {
        await t.rollback();
        reject(error)
    }
})

export const updateWorkspaceService = async (id, {workspace_name, building_id, workspace_price, workspace_type_id, ...data}) => new Promise(async (resolve, reject) => {
    const t = await db.sequelize.transaction();
    try {

        const [isWorkspaceExist, isBuildingExist, isTypeExist] = await Promise.all([
            db.Workspace.findByPk(id), 
            db.Building.findByPk(building_id),
            db.WorkspaceType.findByPk(workspace_type_id)
        ])
        if(!isWorkspaceExist) return reject({
            err: 1,
            message: "Workspace is not exist"
        })
        if(!isBuildingExist) return reject({
            err: 1,
            message: "Building is not exist"
        })
        if(!isTypeExist) return reject({
            err: 1,
            message: "Workspace Type is not exist"
        })

        const isWorkspaceNameDuplicated = await db.Workspace.findOne({
            where: {
                workspace_name: workspace_name,
                workspace_id: { [Op.ne]: id }
            },
            transaction: t
        })

        if(isWorkspaceNameDuplicated) return reject({
            err: 1,
            message: "Workspace name is already used"
        })

        const price_per_day = workspace_price * 8 * 0.8;
        const price_per_month = workspace_price * 22 * 0.8;

        const [updatedRowsCount] = await db.Workspace.update({
            workspace_name: workspace_name,
            building_id: building_id,
            workspace_type_id: data.workspace_type_id,
            price_per_hour: workspace_price,
            price_per_day: price_per_day,
            price_per_month: price_per_month,
            ...data
        }, 
        {
            where: {
                workspace_id: id
            },
            transaction: t
        });
        await t.commit();
        resolve({
            err: updatedRowsCount > 0 ? 0 : 1,
            message: updatedRowsCount > 0 ? 'Workspace updated successfully!' : 'Workspace update failed',
        })

    } catch (error) {
        await t.rollback();
        reject(error)
    }
})

export const deleteWorkspaceService = async (id) => new Promise(async (resolve, reject) => {
    try {
        const [updatedRowsCount] = await db.Workspace.update({
            status: "inactive"
        }, {
            where: {
                workspace_id: id,
                status: "active"
            },
        });
        resolve({
            err: updatedRowsCount > 0 ? 0 : 1,
            message: updatedRowsCount > 0 ? `${updatedRowsCount} Workspace deleted successfully!` : 'Cannot find any workspace to delete',
        });

    } catch (error) {
        reject(error);
    }
})

export const getAllWorkspaceService = ({page, limit, order, workspace_name, office_size, min_price, max_price, workspace_type_name, ...query}) => new Promise(async (resolve, reject) => {
    try {
        const capacity = {};
        if (office_size)
            switch (office_size) {
                case 1:
                    capacity.capacity = {[Op.lte]: 10}
                    break;
                case 2:
                    capacity.capacity = {[Op.between]: [10,20]}
                    break;
                case 3:
                    capacity.capacity = {[Op.between]: [20,30]}
                    break;
                case 4:
                    capacity.capacity = {[Op.between]: [30,40]}
                    break;
                case 5:
                    capacity.capacity = {[Op.between]: [40,50]}
                    break;
                case 6:
                    capacity.capacity = {[Op.gte]: 50}
                    break;
                default:
                    break;
        }
        const price = {};
        if (min_price && max_price) {
            price.price_per_hour = {[Op.between]: [min_price, max_price]}
        }
        console.log(min_price, max_price)
        const workspaces = await db.Workspace.findAll({
            where: {
                workspace_name: {
                    [Op.substring]: workspace_name || ""
                },
                ...price,
                ...capacity,
                ...query
            },
            offset: handleOffset(page, limit),
            limit: handleLimit(limit),
            order: [handleSortOrder(order, "workspace_name")],
            attributes: {
                exclude: ["building_id","createdAt", "updatedAt"]
            },
            include: [
                {
                    model: db.Building,
                    attributes: ["building_id"],
                    required: true,
                }, 
                {
                    model: db.WorkspaceType,
                    attributes: ["workspace_type_name"],
                    where: {
                        workspace_type_name: workspace_type_name ? workspace_type_name : {[Op.substring]: ""}
                    },
                    required: true,
                }, 
            ],
            raw: true, 
            nest: true,
            distinct: true,
        });

        resolve({
            err: workspaces.length > 0 ? 0 : 1,
            message: workspaces.length > 0 ? "Got" : "No Workspace Exist",
            data: workspaces
        });
    } catch (error) {
        reject(error)
    }
})

export const getWorkspaceByIdService = (workspace_id) => new Promise(async (resolve, reject) => {
    try {
        const workspace = await db.Workspace.findOne({
            where: {
                workspace_id: workspace_id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
            include: {
                model: db.Building,
                attributes: {
                exclude: ["buildingId","status","createdAt","updatedAt"]
                },
            }
        });
        resolve({
            err: workspace ? 0 : 1,
            message: workspace ? "Got" : "No Workspace Exist",
            data: workspace
        });
    } catch (error) {
        reject(error)
    }
})

export const assignWorkspacetoBuildingService = async (id, building_id) => new Promise(async (resolve, reject) => {
    try {

        const [workspace, isBuildingExist] = await Promise.all([
            db.Workspace.findOne({
                where: {
                    workspace_id: id
                }
            }), 
            db.Building.findOne({
                where: {
                    building_id: building_id
                }
            })
        ])
        if(!workspace) return resolve({
            err: 1,
            message: "Workspace is not exist"
        })
        if(!isBuildingExist) return resolve({
            err: 1,
            message: "Building is not exist"
        })

        workspace.building_id = building_id;
        await workspace.save();
        
        resolve({
            err: 0,
            message: 'Workspace updated successfully!',
        })

    } catch (error) {
        reject(error)
    }
})