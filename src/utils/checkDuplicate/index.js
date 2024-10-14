import { Op } from "sequelize";

export const isDuplicate = async (model, field, value) => {
    const isDuplicated = await model.findOne({
        where: {
            [field]: value,
        },
    });
    return !!isDuplicated;
};

export const isDuplicateExcludeId = async (model, field, value, key, id) => {
    const isDuplicated = await model.findOne({
        where: {
            [field]: value,
            [key]: { [Op.ne]: id },
        },
    });
    return !!isDuplicated;
};
