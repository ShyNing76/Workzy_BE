import createError from "http-errors";

export const notFound = (req, res) => {
    const error = createError.NotFound(`The requested URL ${req.url} was not found on this server`);
    return res.status(error.status).json({err: error.status, message: error.message});
}