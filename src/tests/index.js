const { where } = require("sequelize");
const db = require("../models");

const amenityWorkspace = () =>
    new Promise(async (resolve, reject) => {
        try {
            const amenitiesWorkspace = await db.AmenitiesWorkspace.findAll({
                // where: {
                //     workspace_id: "639b7e0e-e586-4206-bb7f-0a34a6d8f35b",
                // },
                attributes: ["amenity_id"],
                include: [
                    {
                        model: db.Amenity,
                        as: "Amenities",
                        attributes: ["amenity_id", "amenity_name"],
                        required: true,
                    },
                    {
                        model: db.Workspace,
                        as: "Workspaces",
                        attributes: ["workspace_id", "workspace_name"],
                        where: {
                            workspace_id:
                                "639b7e0e-e586-4206-bb7f-0a34a6d8f35b",
                        },
                        required: true,
                    },
                ],
                raw: true,
                nest: true,
            });

            resolve(amenitiesWorkspace);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });

amenityWorkspace()
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.error(error);
    });
