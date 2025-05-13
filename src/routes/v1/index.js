import { notFound } from "../../middlewares/handle_error";
import swaggerUi from "swagger-ui-express";
import basicAuth from "express-basic-auth";

function initWebRoutes(app) {
    app.use(
        "/api/v1/auth",
        require("./auth")
        // #swagger.tags = ['Auth']
    );

    app.use(
        "/api/v1/voucher",
        require("./voucher")
        // #swagger.tags = ['Voucher']
    );

    app.use(
        "/api/v1/booking",
        require("./booking")
        // #swagger.tags = ['Booking']
    );

    app.use(
        "/api/v1/bookingType",
        require("./bookingType")
        // #swagger.tags = ['Booking Type']
    );

    app.use(
        "/api/v1/user",
        require("./user")
        // #swagger.tags = ['User']
    );

    app.use(
        "/api/v1/customer",
        require("./customer")
        // #swagger.tags = ['Customer']
    );

    app.use(
        "/api/v1/manager",
        require("./manager")
        // #swagger.tags = ['Manager']
    );

    app.use(
        "/api/v1/building",
        require("./building")
        // #swagger.tags = ['Building']
    );

    app.use(
        "/api/v1/workspace",
        require("./workspace")
        // #swagger.tags = ['Workspace']
    );

    app.use(
        "/api/v1/workspace-type",
        require("./workspaceType")
        // #swagger.tags = ['Workspace Type']
    );

    app.use(
        "/api/v1/notification",
        require("./notification")
        // #swagger.tags = ['Notification']
    );
    app.use(
        "/api/v1/workspaceImage",
        require("./workspaceImage")
        // #swagger.tags = ['Workspace Image']
    );

    app.use(
        "/api/v1/staff",
        require("./staff")
        // #swagger.tags = ['Staff']
    );

    app.use(
        "/api/v1/amenity",
        require("./amenity")
        // #swagger.tags = ['Amenities']
    );

    app.use(
        "/api/v1/amenityWorkspace",
        require("./amenityWorkspace")
        // #swagger.tags = ['Amenities Workspace']
    );

    app.use(
        "/api/v1/wishList",
        require("./wishList")
        // #swagger.tags = ['WishList']
    );

    app.use(
        "/api/v1/review",
        require("./review")
        // #swagger.tags = ['Review']
    );

    app.use(
        "/api/v1/search",
        require("./search")
        // #swagger.tags = ['Search']
    );

    app.use(
        "/api-docs",
        basicAuth({
            users: { admin: process.env.SWAGGER_PASSWORD || "admin123" }, // Bạn có thể đổi tên user và pass
            challenge: true, // Hiện popup đăng nhập của browser
        }),
        swaggerUi.serve,
        swaggerUi.setup(require("../../config/swagger-output.json"))
    );
    // Import Swagger UI
    app.use(notFound);
}

export default initWebRoutes;
