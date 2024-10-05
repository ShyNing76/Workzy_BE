"use strict";

/** @type {function(*, *): *} */
const hashSync = require("bcrypt").hashSync;
const { v4 } = require("uuid");

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.bulkInsert(
                "Role",
                [
                    {
                        role_id: 1,
                        role_name: "Admin",
                        status: "active",
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                    {
                        role_id: 2,
                        role_name: "Manager",
                        status: "active",
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                    {
                        role_id: 3,
                        role_name: "Staff",
                        status: "active",
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                    {
                        role_id: 4,
                        role_name: "Customer",
                        status: "active",
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                ],
                { transaction }
            );

            await queryInterface.bulkInsert(
                "User",
                [
                    {
                        user_id: v4(),
                        name: "Admin",
                        email: "admin@gmail.com",
                        password: hashSync(
                            "admin",
                            process.env.SALT_ROUNDS || 10
                        ),
                        role_id: 1,
                        status: "active",
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                ],
                { transaction }
            );

            await queryInterface.bulkInsert(
                "BookingType",
                [
                    {
                        type: "Hourly",
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                    {
                        type: "Daily",
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                    {
                        type: "Monthly",
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                ],
                { transaction }
            );

            const building = [
                {
                    building_id: v4(),
                    building_name: "Workzy FPTU",
                    address:
                        "Trường Đại học FPT TP.HCM, Lô E2a-7, Đường D1, Phường Long Thạnh Mỹ, Thành phố Thủ Đức, Thành phố Hồ Chí Minh, 71216, Việt Nam",
                    location: "HCM",
                    status: "active",
                    description:
                        "Workzy FPTU là một trong những văn phòng chia sẻ đầu tiên tại Việt Nam, được thiết kế theo phong cách hiện đại, tạo nên một môi trường làm việc chuyên nghiệp và sáng tạo.",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    building_id: v4(),
                    building_name: "Workzy Nhà Văn Hóa",
                    address:
                        "Nhà Văn hóa Sinh viên, Quảng trường sáng tạo, Phường Đông Hoà, Dĩ An, Tỉnh Bình Dương, 00848, Việt Nam",
                    status: "active",
                    location: "HCM",
                    description:
                        "Workzy Nhà Văn Hóa là một trong những văn phòng chia sẻ đầu tiên tại Việt Nam, được thiết kế theo phong cách hiện đại, tạo nên một môi trường làm việc chuyên nghiệp và sáng tạo.",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    building_id: v4(),
                    building_name: "Workzy Hòa Lạc",
                    address:
                        "Trường Đại học FPT, Quốc lộ 21, Thạch Hoà, Huyện Thạch Thất, Hà Nội, Việt Nam",
                    status: "active",
                    description:
                        "Workzy Hòa Lạc là một trong những văn phòng chia sẻ đầu tiên tại Việt Nam, được thiết kế theo phong cách hiện đại, tạo nên một môi trường làm việc chuyên nghiệp và sáng tạo.",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ];

            await queryInterface.bulkInsert("Building", building, {
                transaction,
            });
            await queryInterface.bulkInsert(
                "BuildingImage",
                [
                    {
                        building_image_id: v4(),
                        building_id: building[0].building_id,
                        image: "https://www.dummyimage.com/600x400/000/fff",
                        status: "active",
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                    {
                        building_image_id: v4(),
                        building_id: building[1].building_id,
                        image: "https://www.dummyimage.com/600x400/000/fff",
                        status: "active",
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                    {
                        building_image_id: v4(),
                        building_id: building[2].building_id,
                        image: "https://www.dummyimage.com/600x400/000/fff",
                        status: "active",
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                ],
                { transaction }
            );

            const workspaceType = [
                {
                    workspace_type_id: v4(),
                    workspace_type_name: "Quad POD",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_type_id: v4(),
                    workspace_type_name: "Single POD",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_type_id: v4(),
                    workspace_type_name: "Double POD",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_type_id: v4(),
                    workspace_type_name: "Event Space",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_type_id: v4(),
                    workspace_type_name: "Meeting Room",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_type_id: v4(),
                    workspace_type_name: "Working Room",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ];

            await queryInterface.bulkInsert("WorkspaceType", workspaceType, {
                transaction,
            });

            const workspace = [
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[0].workspace_type_id,
                    building_id: building[0].building_id,
                    workspace_name: "Quad POD 1",
                    price_per_hour: 10,
                    price_per_day: 50,
                    price_per_month: 200,
                    capacity: 4,
                    description: "Quad POD 1",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[1].workspace_type_id,
                    building_id: building[0].building_id,
                    workspace_name: "Single POD 1",
                    price_per_hour: 5,
                    price_per_day: 30,
                    price_per_month: 100,
                    capacity: 1,
                    description: "Single POD 1",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[2].workspace_type_id,
                    building_id: building[0].building_id,
                    workspace_name: "Double POD 1",
                    price_per_hour: 8,
                    price_per_day: 40,
                    price_per_month: 150,
                    capacity: 2,
                    description: "Double POD 1",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[3].workspace_type_id,
                    building_id: building[0].building_id,
                    workspace_name: "Event Space 1",
                    price_per_hour: 100,
                    price_per_day: 500,
                    price_per_month: 2000,
                    capacity: 100,
                    description: "Event Space 1",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[4].workspace_type_id,
                    building_id: building[0].building_id,
                    workspace_name: "Meeting Room 1",
                    price_per_hour: 20,
                    price_per_day: 100,
                    price_per_month: 400,
                    capacity: 10,
                    description: "Meeting Room 1",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[5].workspace_type_id,
                    building_id: building[0].building_id,
                    workspace_name: "Working Room 1",
                    price_per_hour: 15,
                    price_per_day: 80,
                    price_per_month: 300,
                    capacity: 5,
                    description: "Working Room 1",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                // Building 1
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[0].workspace_type_id,
                    building_id: building[1].building_id,
                    workspace_name: "Hot Desk 1",
                    price_per_hour: 5,
                    price_per_day: 30,
                    price_per_month: 100,
                    capacity: 1,
                    description: "Hot Desk 1",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[1].workspace_type_id,
                    building_id: building[1].building_id,
                    workspace_name: "Dedicated Desk 1",
                    price_per_hour: 8,
                    price_per_day: 40,
                    price_per_month: 150,
                    capacity: 1,
                    description: "Dedicated Desk 1",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[2].workspace_type_id,
                    building_id: building[1].building_id,
                    workspace_name: "Double POD 1",
                    price_per_hour: 10,
                    price_per_day: 50,
                    price_per_month: 180,
                    capacity: 2,
                    description: "Double POD 1",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[3].workspace_type_id,
                    building_id: building[1].building_id,
                    workspace_name: "Event Space 1",
                    price_per_hour: 100,
                    price_per_day: 500,
                    price_per_month: 2000,
                    capacity: 100,
                    description: "Event Space 1",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[4].workspace_type_id,
                    building_id: building[1].building_id,
                    workspace_name: "Meeting Room 1",
                    price_per_hour: 20,
                    price_per_day: 100,
                    price_per_month: 400,
                    capacity: 10,
                    description: "Meeting Room 1",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[5].workspace_type_id,
                    building_id: building[1].building_id,
                    workspace_name: "Working Room 1",
                    price_per_hour: 15,
                    price_per_day: 80,
                    price_per_month: 300,
                    capacity: 5,
                    description: "Working Room 1",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[0].workspace_type_id,
                    building_id: building[1].building_id,
                    workspace_name: "Hot Desk 2",
                    price_per_hour: 5,
                    price_per_day: 30,
                    price_per_month: 100,
                    capacity: 1,
                    description: "Hot Desk 2",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[1].workspace_type_id,
                    building_id: building[1].building_id,
                    workspace_name: "Dedicated Desk 2",
                    price_per_hour: 8,
                    price_per_day: 40,
                    price_per_month: 150,
                    capacity: 1,
                    description: "Dedicated Desk 2",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[2].workspace_type_id,
                    building_id: building[1].building_id,
                    workspace_name: "Double POD 2",
                    price_per_hour: 10,
                    price_per_day: 50,
                    price_per_month: 180,
                    capacity: 2,
                    description: "Double POD 2",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[4].workspace_type_id,
                    building_id: building[1].building_id,
                    workspace_name: "Meeting Room 2",
                    price_per_hour: 20,
                    price_per_day: 100,
                    price_per_month: 400,
                    capacity: 10,
                    description: "Meeting Room 2",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                // Building 2
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[0].workspace_type_id,
                    building_id: building[2].building_id,
                    workspace_name: "Hot Desk 1",
                    price_per_hour: 6,
                    price_per_day: 35,
                    price_per_month: 120,
                    capacity: 1,
                    description: "Hot Desk 1",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[1].workspace_type_id,
                    building_id: building[2].building_id,
                    workspace_name: "Dedicated Desk 1",
                    price_per_hour: 9,
                    price_per_day: 45,
                    price_per_month: 170,
                    capacity: 1,
                    description: "Dedicated Desk 1",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[2].workspace_type_id,
                    building_id: building[2].building_id,
                    workspace_name: "Double POD 1",
                    price_per_hour: 12,
                    price_per_day: 60,
                    price_per_month: 200,
                    capacity: 2,
                    description: "Double POD 1",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[3].workspace_type_id,
                    building_id: building[2].building_id,
                    workspace_name: "Event Space 1",
                    price_per_hour: 110,
                    price_per_day: 550,
                    price_per_month: 2200,
                    capacity: 120,
                    description: "Event Space 1",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[4].workspace_type_id,
                    building_id: building[2].building_id,
                    workspace_name: "Meeting Room 1",
                    price_per_hour: 22,
                    price_per_day: 110,
                    price_per_month: 440,
                    capacity: 12,
                    description: "Meeting Room 1",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[5].workspace_type_id,
                    building_id: building[2].building_id,
                    workspace_name: "Working Room 1",
                    price_per_hour: 17,
                    price_per_day: 90,
                    price_per_month: 330,
                    capacity: 6,
                    description: "Working Room 1",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[0].workspace_type_id,
                    building_id: building[2].building_id,
                    workspace_name: "Hot Desk 2",
                    price_per_hour: 6,
                    price_per_day: 35,
                    price_per_month: 120,
                    capacity: 1,
                    description: "Hot Desk 2",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[1].workspace_type_id,
                    building_id: building[2].building_id,
                    workspace_name: "Dedicated Desk 2",
                    price_per_hour: 9,
                    price_per_day: 45,
                    price_per_month: 170,
                    capacity: 1,
                    description: "Dedicated Desk 2",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[2].workspace_type_id,
                    building_id: building[2].building_id,
                    workspace_name: "Double POD 2",
                    price_per_hour: 12,
                    price_per_day: 60,
                    price_per_month: 200,
                    capacity: 2,
                    description: "Double POD 2",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    workspace_id: v4(),
                    workspace_type_id: workspaceType[4].workspace_type_id,
                    building_id: building[2].building_id,
                    workspace_name: "Meeting Room 2",
                    price_per_hour: 22,
                    price_per_day: 110,
                    price_per_month: 440,
                    capacity: 12,
                    description: "Meeting Room 2",
                    status: "active",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ];

            await queryInterface.bulkInsert("Workspace", workspace, {
                transaction,
            });
            await queryInterface.bulkInsert(
                "WorkspaceImage",
                [
                    {
                        workspace_image_id: v4(),
                        workspace_id: workspace[0].workspace_id,
                        image: "https://www.dummyimage.com/600x400/000/fff",
                        status: "active",
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                    {
                        workspace_image_id: v4(),
                        workspace_id: workspace[1].workspace_id,
                        image: "https://www.dummyimage.com/600x400/000/fff",
                        status: "active",
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                    {
                        workspace_image_id: v4(),
                        workspace_id: workspace[2].workspace_id,
                        image: "https://www.dummyimage.com/600x400/000/fff",
                        status: "active",
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                    {
                        workspace_image_id: v4(),
                        workspace_id: workspace[3].workspace_id,
                        image: "https://www.dummyimage.com/600x400/000/fff",
                        status: "active",
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                    {
                        workspace_image_id: v4(),
                        workspace_id: workspace[4].workspace_id,
                        image: "https://www.dummyimage.com/600x400/000/fff",
                        status: "active",
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                    {
                        workspace_image_id: v4(),
                        workspace_id: workspace[5].workspace_id,
                        image: "https://www.dummyimage.com/600x400/000/fff",
                        status: "active",
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                ],
                { transaction }
            );
            transaction.commit();
        } catch (error) {
            transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete("Customer", null, {});
        await queryInterface.bulkDelete("Role", null, {});
        await queryInterface.bulkDelete("User", null, {});
        await queryInterface.bulkDelete("WorkspaceImage", null, {});
        await queryInterface.bulkDelete("Workspace", null, {});
        await queryInterface.bulkDelete("BuildingImage", null, {});
        await queryInterface.bulkDelete("Building", null, {});
        await queryInterface.bulkDelete("BookingType", null, {});
        await queryInterface.bulkDelete("WorkspaceType", null, {});
    },
};
