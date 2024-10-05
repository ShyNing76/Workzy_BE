import {expect} from "chai";
import sinon from "sinon";
import * as buildingService from "../services/building/building.service";
import db from "../models";

describe("Building Service", () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("getBuildingService", () => {
        it("should return buildings when found", async () => {
            const mockBuildings = [
                {building_id: 1, building_name: "Building 1"},
                {building_id: 2, building_name: "Building 2"},
            ];
            const findAndCountAllStub = sandbox
                .stub(db.Building, "findAndCountAll")
                .resolves({
                    count: mockBuildings.length,
                    rows: mockBuildings,
                });

            const result = await buildingService.getBuildingService({});

            expect(result).to.deep.equal({
                err: 0,
                message: "Buildings found",
                data: mockBuildings,
            });
            expect(findAndCountAllStub.calledOnce).to.be.true;
        });

        it('should reject with "No building found" when no buildings are found', async () => {
            sandbox.stub(db.Building, "findAndCountAll").resolves({
                count: 0,
                rows: [],
            });

            try {
                await buildingService.getBuildingService({});
                expect.fail("Expected rejection");
            } catch (error) {
                expect(error).to.equal("No building found");
            }
        });
    });

    describe("getBuildingByIdService", () => {
        it("should return a building when found", async () => {
            const mockBuilding = {building_id: 1, building_name: "Test Building"};
            sandbox.stub(db.Building, "findOne").resolves(mockBuilding);

            const result = await buildingService.getBuildingByIdService(1);

            expect(result).to.deep.equal({
                err: 0,
                message: "Building found",
                data: mockBuilding,
            });
        });

        it('should reject with "Building not found" when building is not found', async () => {
            sandbox.stub(db.Building, "findOne").resolves(null);

            try {
                await buildingService.getBuildingByIdService(1);
                expect.fail("Expected rejection");
            } catch (error) {
                expect(error).to.equal("Building not found");
            }
        });
    });

    describe("createBuildingService", () => {
        it("should create a new building successfully", async () => {
            const mockBuilding = {building_id: 1, building_name: "New Building"};
            sandbox.stub(db.Building, "findOne").resolves(null);
            sandbox.stub(db.Building, "create").resolves(mockBuilding);
            sandbox.stub(db.BuildingImage, "findOrCreate").resolves([{}, true]);
            sandbox.stub(db.sequelize, "transaction").resolves({
                commit: sandbox.stub(),
                rollback: sandbox.stub(),
            });

            const result = await buildingService.createBuildingService({
                building_name: "New Building",
                images: ["image1.jpg"],
            });

            expect(result).to.deep.equal({
                err: 0,
                message: "Building created successfully",
                data: mockBuilding,
            });
        });

        it("should reject if building name already exists", async () => {
            sandbox.stub(db.Building, "findOne").resolves({building_id: 1});

            try {
                await buildingService.createBuildingService({
                    building_name: "Existing Building",
                });
                expect.fail("Expected rejection");
            } catch (error) {
                expect(error).to.equal("Building name already exists");
            }
        });
    });

    describe("createBuildingService", () => {
        it("should create a new building with image successfully", async () => {
            const mockBuilding = {building_id: 1, building_name: "New Building"};
            const mockImage = "image1.jpg";
            sandbox.stub(db.Building, "findOne").resolves(null);
            sandbox.stub(db.Building, "create").resolves(mockBuilding);
            sandbox.stub(db.BuildingImage, "create").resolves({building_id: 1, image: mockImage});
            sandbox.stub(db.sequelize, "transaction").resolves({
                commit: sandbox.stub(),
                rollback: sandbox.stub(),
            });

            const result = await buildingService.createBuildingService({
                building_name: "New Building",
                image: mockImage,
            });

            expect(result).to.deep.equal({
                err: 0,
                message: "Building created successfully",
                data: mockBuilding,
            });
            expect(db.BuildingImage.create.calledOnce).to.be.true;
            expect(db.BuildingImage.create.calledWith({
                building_id: mockBuilding.building_id,
                image: mockImage
            })).to.be.true;
        });

        it("should reject if image is not provided", async () => {
            try {
                await buildingService.createBuildingService({
                    building_name: "New Building",
                });
                expect.fail("Expected rejection");
            } catch (error) {
                expect(error).to.equal("Image is required for creating a building");
            }
        });

        it("should reject if building name already exists", async () => {
            sandbox.stub(db.Building, "findOne").resolves({building_id: 1});

            try {
                await buildingService.createBuildingService({
                    building_name: "Existing Building",
                    image: "image1.jpg",
                });
                expect.fail("Expected rejection");
            } catch (error) {
                expect(error).to.equal("Building name already exists");
            }
        });

        it("should rollback transaction if image creation fails", async () => {
            const mockBuilding = {building_id: 1, building_name: "New Building"};
            sandbox.stub(db.Building, "findOne").resolves(null);
            sandbox.stub(db.Building, "create").resolves(mockBuilding);
            sandbox.stub(db.BuildingImage, "create").rejects(new Error("Image creation failed"));
            const transactionStub = {
                commit: sandbox.stub(),
                rollback: sandbox.stub(),
            };
            sandbox.stub(db.sequelize, "transaction").resolves(transactionStub);

            try {
                await buildingService.createBuildingService({
                    building_name: "New Building",
                    image: "image1.jpg",
                });
                expect.fail("Expected rejection");
            } catch (error) {
                expect(error.message).to.equal("Image creation failed");
                expect(transactionStub.rollback.calledOnce).to.be.true;
            }
        });
    });
});
