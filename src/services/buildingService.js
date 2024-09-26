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
        },
      });
    } catch (error) {
      reject(error);
    }
  });
