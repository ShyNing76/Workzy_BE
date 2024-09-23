import db from "../models";
import jwt from "jsonwebtoken";

export const getAllBuilding = () =>
  new Promise(async (resolve, reject) => {
    try {
      const building = await db.Building.findAll();

      resolve({
        err: 1,
        message: "Get All Building Successfully",
        data: {
          building_id: building.building_id,
          building_name: building.building_name,
          status: building.status,
          description: building.description,
          location: building.location,
          amenities: building.amenities,
          workspace_id: building.workspace_id,
          rating: building.rating,
          image: building.image,
          manager_id: building.manager_id,
        },
      });
    } catch (error) {
      reject(error);
    }
  });
