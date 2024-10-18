import db from "../../models";
import { v4 } from "uuid";
import { isDuplicate, isDuplicateExcludeId } from "../../utils/checkDuplicate";
import {
    handleLimit,
    handleOffset,
    handleSortOrder,
} from "../../utils/handleFilter";

export const createWorkspaceTypeService = async (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const checkDuplicateName = await isDuplicate(
                db.WorkspaceType,
                "workspace_type_name",
                data.workspace_type_name
            );

            if (checkDuplicateName) {
                return reject("Workspace type name already exists");
            }

            const workspaceType = await db.WorkspaceType.create({
                workspace_type_id: v4(),
                ...data,
            });

            if (!workspaceType) {
                return reject("Failed to create workspace type");
            }

            resolve({
                err: 0,
                message: "Workspace type created successfully",
                data: workspaceType,
            });
        } catch (error) {
            reject(error);
        }
    });

export const getAllWorkspaceTypeService = async ({
    page,
    limit,
    order,
    workspace_type_name,
    ...query
}) =>
    new Promise(async (resolve, reject) => {
        try {
            const workspaceTypes = await db.WorkspaceType.findAndCountAll({
                limit: handleLimit(limit),
                offset: handleOffset(page, limit),
                order: [handleSortOrder(order, "workspace_type_name")],
                where: {
                    workspace_type_name: {
                        [db.Sequelize.Op.substring]: workspace_type_name || "",
                    },
                    ...query,
                },
                attributes: {
                    exclude: [
                        "createdAt",
                        "updatedAt",
                        "created_at",
                        "updated_at",
                    ],
                },
                raw: true,
                nest: true,
            });

            if (!workspaceTypes) {
                return reject("Failed to get workspace types");
            }

            resolve({
                err: 0,
                message: "Workspace types retrieved successfully",
                data: workspaceTypes,
            });
        } catch (error) {
            reject(error);
        }
    });

export const getWorkspaceTypeService = async ({ id }) =>
    new Promise(async (resolve, reject) => {
        try {
            const workspaceType = await db.WorkspaceType.findOne({
                where: {
                    workspace_type_id: id,
                },
                attributes: {
                    exclude: [
                        "createdAt",
                        "updatedAt",
                        "created_at",
                        "updated_at",
                    ],
                },
                raw: true,
                nest: true,
            });

            if (!workspaceType) {
                return reject("Workspace type not found");
            }

            resolve({
                err: 0,
                message: "Workspace type retrieved successfully",
                data: workspaceType,
            });
        } catch (error) {
            reject(error);
        }
    });

export const updateWorkspaceTypeService = async ({ id }, data) =>
    new Promise(async (resolve, reject) => {
        try {
            // const checkDuplicateName = await isDuplicate(db.WorkspaceType, "workspace_type_name", data.workspace_type_name);
            const checkDuplicateName = await isDuplicateExcludeId(
                db.WorkspaceType,
                "workspace_type_name",
                data.workspace_type_name,
                "workspace_type_id",
                id
            );
            if (checkDuplicateName) {
                return reject("Workspace type name already exists");
            }

            const workspaceType = await db.WorkspaceType.update(data, {
                where: {
                    workspace_type_id: id,
                },
            });

            if (!workspaceType) {
                return reject("Workspace type not found");
            }

            resolve({
                err: 0,
                message: "Workspace type updated successfully",
            });
        } catch (error) {
            reject(error);
        }
    });

export const deleteWorkspaceTypeService = async (id) =>
    new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            const workspaceType = await db.WorkspaceType.update(
                {
                    status: "inactive",
                },
                {
                    where: {
                        workspace_type_id: id,
                    },
                    transaction: t,
                }
            );
            const workspace = await db.Workspace.update(
                {
                    status: "inactive",
                },
                {
                    where: {
                        workspace_type_id: id,
                    },
                    transaction: t,
                }
            );

            if (!workspaceType) {
                return reject("Workspace type not found");
            }
            if (!workspace) {
                return reject("Workspace not found");
            }
            await t.commit();

            resolve({
                err: 0,
                message: "Workspace type deleted successfully",
            });
        } catch (error) {
            await t.rollback();
            reject(error);
        }
    });
