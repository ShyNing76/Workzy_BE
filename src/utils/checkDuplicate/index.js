import { Op } from "sequelize";

export const isDuplicate = async (model, field, value) => {
    const isDuplicated = await model.findOne({
        where: {
            [field]: value,
        },
    });
    return !!isDuplicated;
};

export const isDuplicateExcludeId = async (model, field, value, id) => {
    const isDuplicated = await model.findOne({
        where: {
            [field]: value,
            id: { [Op.ne]: id },
        },
    });
    return !!isDuplicated;
};
