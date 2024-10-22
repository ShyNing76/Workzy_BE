import db from '../../models';
import { createWorkspaceImageService } from './workspaceImage.service';
import {v4} from "uuid";
import { Op } from "sequelize";
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
    
        // if (images && images.length > 0) {
        //     console.log(images);
        //         await createWorkspaceImageService({images, workspaceId}, t);
        // }
        await t.commit();
        resolve({
            err: 0,
            message: 'Workspace created successfully!',
        })
    } catch (error) {
        await t.rollback();
        console.log(error)
        reject(error)
    }
})

export const updateWorkspaceService = async (id, {workspace_name, building_id, workspace_price, workspace_type_id, images, ...data}) => new Promise(async (resolve, reject) => {
    try {

        if(building_id){
            const isBuildingExist = await db.Building.findByPk(building_id);
            if(!isBuildingExist) return reject("Building is not exist")
        }
        const [isWorkspaceExist, isTypeExist] = await Promise.all([
            db.Workspace.findByPk(id), 
            db.WorkspaceType.findByPk(workspace_type_id)
        ])
        if(!isWorkspaceExist) return reject("Workspace is not exist")
        if(!isTypeExist) return reject("Workspace Type is not exist")

        const isWorkspaceNameDuplicated = await db.Workspace.findOne({
            where: {
                workspace_name: workspace_name,
                workspace_id: { [Op.ne]: id }
            },
        })

        if(isWorkspaceNameDuplicated) return reject("Workspace name is already used")

        const price_per_day = workspace_price * 8 * 0.8;
        const price_per_month = workspace_price * 22 * 0.8;

        const updatedRowsCount = await db.Workspace.update({
            workspace_name: workspace_name,
            building_id: building_id,
            workspace_type_id: workspace_type_id,
            price_per_hour: workspace_price,
            price_per_day: price_per_day,
            price_per_month: price_per_month,
            ...data
        }, 
        {
            where: {
                workspace_id: id
            },
        });
        if(updatedRowsCount[0] === 0) return reject("Cannot find any workspace to update || Workspace is already updated")
        resolve({
            err: 0,
            message: 'Workspace updated successfully!',
        })

    } catch (error) {
        console.log(error)
        reject(error)
    }
})

export const deleteWorkspaceService = async (id) => new Promise(async (resolve, reject) => {
    try {
        const workspace = await db.Workspace.findOne({
            where: {
                workspace_id: id,
            },
            attributes: ["status", "workspace_id"]
        });
        if(!workspace) return reject("Workspace is not exist")
        
        const changeStatus = workspace.status === "active" ? "inactive" : "active";

        const [updatedRowsCount] = await db.Workspace.update({
            status: changeStatus
        }, {
            where: {
                workspace_id: id,
                status: workspace.status
            },
        });
        if (updatedRowsCount === 0) {
            return reject("Cannot find any workspace to delete");
        }
        resolve({
            err: 0,
            message: `Workspace deleted successfully!`,
        });

    } catch (error) {
        console.log(error)
        reject(error);
    }
})

export const getAllWorkspaceService = ({page, limit, order, workspace_name, office_size, min_price, max_price, workspace_type_name, building_id, status, ...query}) => new Promise(async (resolve, reject) => {
    try {
        const office_size_case = {
            "1": {[Op.lte]: 10},
            "2": {[Op.between]: [10,20]},
            "3": {[Op.between]: [20,30]},
            "4": {[Op.between]: [30,40]},
            "5": {[Op.between]: [40,50]},
            "6": {[Op.gte]: 50},
        }
        if (office_size) query.capacity = office_size_case[office_size];
        if (min_price && max_price) query.price_per_hour = {[Op.between]: [min_price, max_price]}
        query.status = status || {[Op.ne]: null};
        const workspaces = await db.Workspace.findAll({
            where: query,
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
                    where: {
                        building_id: building_id ? building_id : {[Op.ne]: null}
                    },
                    required: true,
                }, 
                {
                    model: db.WorkspaceType,
                    attributes: ["workspace_type_name"],
                    where: {
                        workspace_type_name: workspace_type_name ? workspace_type_name : {[Op.ne]: null}
                    },
                    required: true,
                }, 
            ],
        });
        if(workspaces.length === 0) return reject("No Workspace Exist")
        resolve({
            err: 0,
            message: "Got Workspace successfully",
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
        if(!workspace) return reject("Workspace is not exist")
        resolve({
            err: 0,
            message: "Got",
            data: workspace
        });
    } catch (error) {
        console.log(error)
        reject(error)
    }
})

export const assignWorkspacetoBuildingService = async (id, building_id) => new Promise(async (resolve, reject) => {
    try {
        const isBuildingExist = db.Building.findByPk(building_id);
        if(!isBuildingExist) return resolve("Building is not exist")
        const [updatedWorkspace] = await db.Workspace.update({
            building_id: building_id
        },{
            where: {
                workspace_id: id,
                building_id: null
            }
        })
        if(updatedWorkspace === 0) return reject("Workspace is not exist || Workspace has been allocated to the building")
        resolve({
            err: 0,
            message: 'Workspace allocated successfully!',
        })
    } catch (error) {
        console.log(error)
        reject(error)
    }
})