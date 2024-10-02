import db from "../models";
import { Op } from "sequelize";

export const searchBuildingService = ({location, workspace_type_name}) => new Promise(async (resolve, reject) => {
    try {
        let whereClause = {};
        let includeClause = [];

        if (location && location !== "") {
            whereClause.location = location;
        }

        if (workspace_type_name && workspace_type_name !== "") {
            includeClause = [{
                model: db.Workspace,
                required: true,
                attributes: [],
                include: [{
                    model: db.WorkspaceType,
                    where: { workspace_type_name: workspace_type_name },
                    attributes: [],
                    required: true,
                }]
            }];
        }

        const buildings = await db.Building.findAndCountAll({
            where: whereClause,
            attributes: {
                exclude: ["status", "createdAt", "updatedAt"]
            },
            include: includeClause,
            distinct: true
        });

        if (buildings.count === 0) {
            return reject("No buildings found");
        }
        resolve({
            err: 0,
            message: "Buildings found",
            data: buildings
        });
    } catch (error) {
        reject(error);
    }
});

