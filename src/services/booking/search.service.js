import { col, fn } from "sequelize";
import db from "../../models";

export const searchBuildingService = ({ location, workspace_type_name }) =>
    new Promise(async (resolve, reject) => {
        try {
            const buildingsWorkspace = await db.Building.findAll({
                where: location ? { location } : {},
                include: [
                    {
                        model: db.Workspace,
                        required: true,
                        where: {
                            status: "active",
                        },
                        attributes: [],
                        include: [
                            {
                                model: db.WorkspaceType,
                                required: true,
                                attributes: [],
                                where: {
                                    status: "active",
                                },
                            },
                        ],
                    },
                    {
                        model: db.BuildingImage,
                        as: "BuildingImages",
                        attributes: ["image"],
                        required: false,
                    },
                ],
                attributes: [
                    "building_id",
                    "building_name",
                    "address",
                    "google_address",
                    "location",
                    "description",
                    "rating",
                    [
                        fn(
                            "ARRAY_AGG",
                            fn(
                                "DISTINCT",
                                col(
                                    "Workspaces.WorkspaceType.workspace_type_name"
                                )
                            )
                        ),
                        "workspace_types",
                    ],
                ],
                group: [
                    "Building.building_id",
                    "Building.building_name",
                    "Building.address",
                    "Building.google_address",
                    "Building.location",
                    "Building.description",
                    "Building.rating",
                    "BuildingImages.building_image_id",
                ],
                // raw: true,
                // nest: true,
            });

            const buildingsWorkspaceWithWorkspaceTypes = workspace_type_name
                ? buildingsWorkspace.filter((building) =>
                      building.workspace_types.includes(workspace_type_name)
                  )
                : buildingsWorkspace;

            resolve({
                err: 0,
                message: "Buildings found",
                data: buildingsWorkspaceWithWorkspaceTypes,
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
