export const isDuplicate = async (model, field, value) => {
    const isDuplicated = await model.findOne({
        where: {
            [field]: value
        }
    });
    return !!isDuplicated;
}