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
                        booking_type_id: v4(),
                        type: "Hourly",
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                    {
                        booking_type_id: v4(),
                        type: "Daily",
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                    {
                        booking_type_id: v4(),
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
                    google_address:
                        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7837.069521087764!2d106.80495229805298!3d10.846871464694706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuIEhDTQ!5e0!3m2!1svi!2s!4v1728357897887!5m2!1svi!2s",
                    description:
                        "Workzy FPTU là một trong những văn phòng chia sẻ tiên phong tại Việt Nam, được thiết kế theo phong cách hiện đại, kết hợp giữa sự tinh tế và sáng tạo trong từng chi tiết. Với vị trí thuận lợi ngay trong khuôn viên của Đại học FPT, Workzy FPTU không chỉ thu hút cộng đồng sinh viên và giảng viên mà còn là điểm đến lý tưởng cho các startup, freelancer, và những doanh nghiệp vừa và nhỏ. Không gian của Workzy FPTU được tối ưu hóa để khuyến khích sự sáng tạo và tinh thần đổi mới, từ các phòng làm việc cá nhân yên tĩnh đến các khu vực sinh hoạt chung, nơi mọi người có thể giao lưu và trao đổi ý tưởng. Đặc biệt, với cơ sở vật chất hiện đại, từ hệ thống máy chiếu, bảng trắng đến kết nối Internet tốc độ cao, Workzy FPTU tạo điều kiện thuận lợi cho các buổi họp, hội thảo và các sự kiện doanh nghiệp.",
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
                        "Workzy Nhà văn hóa là một tòa nhà mang đậm chất văn hóa, với kiến trúc pha trộn giữa hiện đại và truyền thống. Nằm ngay cạnh khu vực trung tâm của thành phố, tòa nhà này mang đến một không gian làm việc gần gũi, thân thiện và không kém phần chuyên nghiệp. Với các phòng làm việc được bố trí khoa học, ánh sáng tự nhiên chan hòa và nội thất tinh tế, Workzy Nhà văn hóa không chỉ là nơi làm việc mà còn là một không gian giao lưu văn hóa, nghệ thuật. Tại đây, các thành viên có thể tham gia vào các buổi hội thảo, triển lãm hoặc các sự kiện cộng đồng nhằm mở rộng kiến thức và kết nối. Với mục tiêu thúc đẩy sự phát triển sáng tạo của các cá nhân và doanh nghiệp, Workzy Nhà văn hóa mang đến nhiều dịch vụ hỗ trợ như phòng họp hiện đại, không gian tổ chức sự kiện, và cả các gói dịch vụ ảo giúp khách hàng tối ưu hóa hoạt động kinh doanh của mình.",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    building_id: v4(),
                    building_name: "Workzy Hòa Lạc",
                    location: "Hanoi",
                    address:
                        "Trường Đại học FPT, Quốc lộ 21, Thạch Hoà, Huyện Thạch Thất, Hà Nội, Việt Nam",
                    status: "active",
                    description:
                        "Workzy Hòa Lạc là một biểu tượng của sự kết hợp hoàn hảo giữa thiên nhiên và công nghệ. Nằm trong khu công nghệ cao Hòa Lạc, tòa nhà này được bao quanh bởi không gian xanh mát, mang lại cảm giác yên bình và thư giãn, rất phù hợp cho những ai muốn tìm kiếm sự tĩnh lặng để tập trung vào công việc. Workzy Hòa Lạc không chỉ nổi bật với các phòng làm việc hiện đại và đầy đủ tiện nghi, mà còn có những khu vực ngoài trời được thiết kế tinh tế để các thành viên có thể làm việc hoặc thư giãn giữa không gian thiên nhiên. Tòa nhà này cũng là nơi lý tưởng cho các công ty công nghệ, các tổ chức nghiên cứu phát triển sản phẩm, với các dịch vụ hỗ trợ đặc thù như không gian làm việc linh hoạt, phòng thí nghiệm nhỏ và phòng họp chuyên dụng. Hơn nữa, với sự gần gũi với các trường đại học và viện nghiên cứu trong khu vực, Workzy Hòa Lạc mang đến cơ hội kết nối, hợp tác giữa các nhà nghiên cứu, doanh nghiệp và các chuyên gia trong ngành.",
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
                    price_per_hour: 100000,
                    price_per_day: 500000,
                    price_per_month: 2000000,
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
                    price_per_hour: 50000,
                    price_per_day: 300000,
                    price_per_month: 1000000,
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
                    price_per_hour: 80000,
                    price_per_day: 400000,
                    price_per_month: 1500000,
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
                    price_per_hour: 100000,
                    price_per_day: 500000,
                    price_per_month: 2000000,
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
                    price_per_hour: 200000,
                    price_per_day: 1000000,
                    price_per_month: 4000000,
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
                    price_per_hour: 150000,
                    price_per_day: 800000,
                    price_per_month: 3000000,
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
                    price_per_hour: 50000,
                    price_per_day: 300000,
                    price_per_month: 1000000,
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
                    price_per_hour: 80000,
                    price_per_day: 400000,
                    price_per_month: 1500000,
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
                    price_per_hour: 100000,
                    price_per_day: 500000,
                    price_per_month: 1800000,
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
                    price_per_hour: 100000,
                    price_per_day: 500000,
                    price_per_month: 2000000,
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
                    price_per_hour: 200000,
                    price_per_day: 1000000,
                    price_per_month: 4000000,
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
                    price_per_hour: 150000,
                    price_per_day: 800000,
                    price_per_month: 3000000,
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
                    price_per_hour: 50000,
                    price_per_day: 300000,
                    price_per_month: 1000000,
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
                    price_per_hour: 80000,
                    price_per_day: 400000,
                    price_per_month: 1500000,
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
                    price_per_hour: 100000,
                    price_per_day: 500000,
                    price_per_month: 1800000,
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
                    price_per_hour: 200000,
                    price_per_day: 1000000,
                    price_per_month: 4000000,
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
                    price_per_hour: 60000,
                    price_per_day: 350000,
                    price_per_month: 1200000,
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
                    price_per_hour: 90000,
                    price_per_day: 450000,
                    price_per_month: 1700000,
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
                    price_per_hour: 120000,
                    price_per_day: 600000,
                    price_per_month: 2000000,
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
                    price_per_hour: 100000,
                    price_per_day: 500000,
                    price_per_month: 2000000,
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
                    price_per_hour: 220000,
                    price_per_day: 1100000,
                    price_per_month: 4400000,
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
                    price_per_hour: 170000,
                    price_per_day: 900000,
                    price_per_month: 3300000,
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
                    price_per_hour: 60000,
                    price_per_day: 350000,
                    price_per_month: 1200000,
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
                    price_per_hour: 90000,
                    price_per_day: 450000,
                    price_per_month: 1700000,
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
                    price_per_hour: 120000,
                    price_per_day: 600000,
                    price_per_month: 2000000,
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
                    price_per_hour: 220000,
                    price_per_day: 1100000,
                    price_per_month: 4400000,
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
        await queryInterface.bulkDelete("BookingStatus", null, {});
        await queryInterface.bulkDelete("Booking", null, {});
        await queryInterface.bulkDelete("Customer", null, {});
        await queryInterface.bulkDelete("Role", null, {});
        await queryInterface.bulkDelete("Staff", null, {});
        await queryInterface.bulkDelete("Manager", null, {});
        await queryInterface.bulkDelete("WorkspaceImage", null, {});
        await queryInterface.bulkDelete("Workspace", null, {});
        await queryInterface.bulkDelete("BuildingImage", null, {});
        await queryInterface.bulkDelete("Building", null, {});
        await queryInterface.bulkDelete("BookingType", null, {});
        await queryInterface.bulkDelete("WorkspaceType", null, {});
    },
};
