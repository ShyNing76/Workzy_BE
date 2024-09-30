export const handleSortOrder = (order, defaultValue) => {
    // Nếu order là null hoặc undefined, trả về mặc định
    if (order === null || order === undefined) {
        return [defaultValue, 'asc'];
    }

    // Nếu order chỉ có 1 phần tử | 2 case là 'asc' hoặc 'desc' | 1 case là defaultValue
    if (order.length === 1) {
        if (order[0] === 'asc' || order[0] === 'desc') {
            return [defaultValue, order[0]];
        }
        return [order[0], 'asc'];
    }

    // Nếu order có 2 phần tử
    return order.sort((a, b) => {
        if (a === 'asc' || a === 'desc') {
            return 1;
        }
        if (b === 'asc' || b === 'desc') {
            return -1;
        }
        return 0;
    });
};

export const handleLimit = (limit) => {
    if (limit === null || limit === undefined || limit <= 0) {
        return 10;
    }
    return parseInt(limit) || 10;
}

export const handleOffset = (page, limit) => {
    if (page === null || page === undefined || page <= 0) {
        return 0;
    }
    return (parseInt(page) - 1) * parseInt(limit) || 0;
}
