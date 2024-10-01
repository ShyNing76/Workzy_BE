import db from '../models/';
import { Op } from 'sequelize';
import {v4} from "uuid";

export const createAmenitiesWorkspaceService = async ({amenity_ids}, workspace_id) => new Promise(async (resolve, reject) => {
    try {
        const workspace = await db.Workspace.findByPk(workspace_id);
        if(!workspace) return resolve({
            err: 1,
            message: "No valid workspace found"
        })
        const amenities = await db.Amenity.findAll({
            where: {
                amenity_id: {[Op.in]: amenity_ids}
            }
        })
        if (amenities.length === 0) return resolve({
            err: 1,
            message: 'No valid amenities found',
        });
        const amenitiesWorkspacePromises = amenities.map(amenity => {
            return db.AmenitiesWorkspace.findOrCreate({
                where: {
                    workspace_id: workspace.workspace_id,
                    amenity_id: amenity.amenity_id
                },
                defaults: {
                    amenities_workspace_id: v4(), 
                    workspace_id: workspace.workspace_id,
                    amenity_id: amenity.amenity_id
                }
            })
        });
        const results = await Promise.all(amenitiesWorkspacePromises);
        const newRecordsCount = results.filter(result => result[1]).length; // result[1] is true if a new entry was created
        resolve({
            err: newRecordsCount > 0 ? 0 : 1,
            message: newRecordsCount > 0 ? `${newRecordsCount} amenities associated with workspace successfully!` : 'Error associating amenities with workspace',
        });
    } catch (error) {
        reject(error)
    }
})

export const deleteAmenitiesWorkspaceService = async ({amenities_workspace_ids}) => new Promise(async (resolve, reject) => {
    try {
          const amenitiesWorkspace = await db.AmenitiesWorkspace.destroy({
            where: {
                amenities_workspace_id: {[Op.in]: amenities_workspace_ids}
            }
          });
          resolve({
            err: amenitiesWorkspace > 0 ? 0 : 1,
            mes: amenitiesWorkspace > 0 ? `${amenitiesWorkspace} amenities-workspace record(s) deleted successfully!`
            : "No amenities-workspace records found to delete"
          })
    } catch (error) {
        reject(error)
    }
})
