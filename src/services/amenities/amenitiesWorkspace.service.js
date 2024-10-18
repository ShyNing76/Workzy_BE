import db from '../../models';
import { Op } from 'sequelize';
import {v4} from "uuid";

export const createAmenitiesWorkspaceService = async ({amenity_ids, workspace_id}) => new Promise(async (resolve, reject) => {
    try {
        const workspace = await db.Workspace.findByPk(workspace_id);
        if(!workspace) return reject("No valid workspace found")
        const amenities = await db.Amenity.findAll({
            where: {
                amenity_id: {[Op.in]: amenity_ids}
            }
        })
        if (amenities.length === 0) return reject("No valid amenities found")
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
        
        if (newRecordsCount === 0) return reject('Error associating amenities with workspace');
        resolve({
            err: 0,
            message: `${newRecordsCount} amenities associated with workspace successfully!`
        });
    } catch (error) {
        reject(error)
    }
})

export const deleteAmenitiesWorkspaceService = async (id) => new Promise(async (resolve, reject) => {
    try {
          const amenitiesWorkspace = await db.AmenitiesWorkspace.destroy({
            where: {
                amenities_workspace_id: id
            }
          });
          if(amenitiesWorkspace === 0) return reject("No amenities-workspace record found to delete")
          resolve({
            err: 0,
            message: `${amenitiesWorkspace} amenities-workspace record deleted successfully!`
          })
    } catch (error) {
        reject(error)
    }
})

export const getAmenitiesByWorkspaceIdService = async (workspace_id) => new Promise(async (resolve, reject) => {
    try {
        const amenitiesWorkspace = await db.AmenitiesWorkspace.findAll({
            where: {
                workspace_id: workspace_id
            },
            attributes: [],
            include: {
                model: db.Amenity,
                attributes: ['amenity_name'],
                required: true
            },
            raw: true,
            nest: true
        })
        for(const item of amenitiesWorkspace) {
            console.log(item.Amenities)
        }
        if(amenitiesWorkspace.length === 0) return reject("No amenities found for this workspace")
        const amenities = []
        for(const item of amenitiesWorkspace) {
            amenities.push(item.Amenities.amenity_name)
        }
        resolve({
            err: 0,
            message: "Got",
            data: amenities
        })
    } catch (error) {
        reject(error)
    }
})
