import {col, fn} from "sequelize";
import db from "../../models";

export const searchBuildingService = ({location, workspace_type_name}) =>
    new Promise(async (resolve, reject) => {
        try {
            const buildingsWorkspace = await db.Building.findAll({
                where: location ? {location} : {},
                include: {
                    model: db.Workspace,
                    required: true,
                    attributes: [],
                    include: {
                        model: db.WorkspaceType,
                        required: true,
                        attributes: [],
                    },
                },
                attributes: [
                    "building_id",
                    "building_name",
                    "address",
                    "google_address",
                    "location",
                    "description",
                    "rating",
                    [fn("ARRAY_AGG", fn("DISTINCT", col("Workspaces.WorkspaceType.workspace_type_name"))), "workspace_types"],
                ],
                raw: true,
                group: ["Building.building_id"],
                nest: true,
            });

            const buildingsWorkspaceWithWorkspaceTypes = workspace_type_name
                ? buildingsWorkspace.filter((building) =>
                    building.workspace_types.includes(workspace_type_name)
                )
                : buildingsWorkspace;

            if (buildingsWorkspaceWithWorkspaceTypes.length === 0) {
                return reject({
                    err: 1,
                    message: "No buildings found",
                });
            }

            resolve({
                err: 0,
                message: "Buildings found",
                count: buildingsWorkspaceWithWorkspaceTypes.length,
                data: buildingsWorkspaceWithWorkspaceTypes,
            });
        } catch (error) {
            reject(error);
        }
    });
