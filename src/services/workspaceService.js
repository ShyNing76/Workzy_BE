import db from '../models/';
import {v4} from "uuid";

export const createWorkspaceService = async (data) => new Promise(async (resolve, reject) => {
    try {
        const workspace = await db.findOrCreate({
            where: {
                workspace_name: data.workspace_name
            },
            defaults: {
                workspace_id: v4(),
                workspace_name: data.workspace_name
            }
        });

        resolve({
            err: workspace[1] ? 1 : 0,
            message: workspace[1] ? 'Workspace created successfully!' : 'Workspace already exists',
            data: workspace
        })

    } catch (error) {
        reject(error)
    }
})