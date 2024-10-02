import db from '../models';
import {v4} from "uuid";
import {Op} from "sequelize";

export const createWorkspaceService = async ({workspace_name, workspace_price, ...data}) => new Promise(async (resolve, reject) => {
    try {
        const price_per_day = workspace_price * 8 * 0.8;
        const price_per_month = workspace_price * 22 * 0.8;

        const workspace = await db.Workspace.findOrCreate({
            where: {
                workspace_name: workspace_name
            },
            defaults: {
                workspace_id: v4(),
                building_id: "",
                workspace_type_id: data.workspace_type_id,
                workspace_name: workspace_name,
                price_per_hour: workspace_price,
                price_per_day,
                price_per_month,
                ...data,
            }
        });

        resolve({
            err: workspace[1] ? 0 : 1,
            message: workspace[1] ? 'Workspace created successfully!' : 'Workspace already exists',
            data: workspace[1] ? workspace : null
        })

    } catch (error) {
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

export const deleteWorkspaceService = async ({workspace_ids}) => new Promise(async (resolve, reject) => {
    try {
        const [updatedRowsCount] = await db.Workspace.update({
            status: "inactive"
        }, {
            where: {
                workspace_id: {
                    [Op.in]: workspace_ids
                },
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

export const getAllWorkspaceService = ({page, limit, order, workspaceName, ...query}) => new Promise(async (resolve, reject) => {
    try {
        const queries = { raw: true, nest: true };
        const offset = !page || +page <= 1 ? 0 : +page - 1;
        const finalLimit = +limit || +process.env.PAGE_LIMIT;
        queries.offset = offset * finalLimit;
        queries.limit = finalLimit;
        if (order) queries.order = [order || "workspace_id"];
        if (workspaceName) query.workspaceName = { [Op.substring]: workspaceName };

        const workspaces = await db.Workspace.findAndCountAll({
            where: {
                ...query, 
            },
            ...queries,
            attributes: {
                exclude: ["building_id","createdAt", "updatedAt"]
            },
            include: [
                {
                    model: db.Building,
                    attributes: {exclude : ["createdAt", "updatedAt"]},
                }, 
            ],
        });

        resolve({
            err: workspaces.count > 0 ? 0 : 1,
            message: workspaces.count > 0 ? "Got" : "No Workspace Exist",
            data: workspaces
        });
    } catch (error) {
        reject(error)
    }
})

export const getWorkspaceByIdService = (id) => new Promise(async (resolve, reject) => {
    try {
        const workspace = await db.Workspace.findOne({
            where: {
                workspace_id: id
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