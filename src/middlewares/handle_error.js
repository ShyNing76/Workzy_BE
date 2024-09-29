import createError from "http-errors";

export const notFound = (req, res) => {
    const error = createError.NotFound(`The requested URL ${req.url} was not found on this server`);
    return res.status(error.status).json({err: 1, message: error.message});
}

export const badRequest = (res, message) => {
    const error = createError.BadRequest(message);
    return res.status(error.status).json({err: 1, message: error.message.toString().replaceAll("\"", "")});
}

export const notAuthorized = (message, res, isExpired) => {
    const error = isExpired ? createError.Unauthorized("Access token expired") : createError.Unauthorized(message);
    return res.status(error.status).json({err: 1, message: error.message});
}

export const internalServerError = (res, message) => {
    const error = createError.InternalServerError(message);
    return res.status(error.status).json({err: 1, message: error.message});
}

export const forbidden = (res, message) => {
    const error = createError.Forbidden(message);
    return res.status(error.status).json({err: 1, message: error.message});
}

export const conflict = (res, message) => {
    const error = createError.Conflict(message);
    return res.status(error.status).json({err: 1, message: error.message});
}

export const created = (res, data) => {
    const error = createError.Created(data);
    return res.status(error.status).json(data);
}

export const ok = (res, data) => {
    return res.status(200).json(data);
}

export const noContent = (res) => {
    return res.status(204).json();
}

export const accepted = (res, data) => {
    return res.status(202).json(data);
}

export const badGateway = (res, message) => {
    const error = createError.BadGateway(message);
    return res.status(error.status).json({err: 1, message: error.message});
}

export const serviceUnavailable = (res, message) => {
    const error = createError.ServiceUnavailable(message);
    return res.status(error.status).json({err: 1, message: error.message});
}

export const gatewayTimeout = (res, message) => {
    const error = createError.GatewayTimeout(message);
    return res.status(error.status).json({err: 1, message: error.message});
}