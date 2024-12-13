import { assert, expect } from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import db from "../models";
import * as loginService from "../services/auth";
import * as hashPassword from "../utils/hashPassword";

describe("Authentication Services", () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("loginService", () => {
        const mockUser = {
            user_id: "test-user-id",
            email: "test@example.com",
            password: "hashed-password",
            role_id: 4,
            status: "active",
        };

        it("should successfully login with correct credentials", async function () {
            this.timeout(5000); // Increase timeout to 5 seconds

            // Stub database findOne to return mock user
            const findOneStub = sandbox
                .stub(db.User, "findOne")
                .resolves(mockUser);

            // Stub password comparison to return true
            const comparePasswordStub = sandbox
                .stub(hashPassword, "comparePassword")
                .returns(true);

            // Stub jwt sign to return a token
            const jwtSignStub = sandbox.stub(jwt, "sign").returns("mock-token");

            const result = await loginService.loginService({
                email: "test@example.com",
                password: "correct-password",
            });

            expect(result).to.deep.equal({
                err: 0,
                message: "Login successful",
                accessToken: "Bearer mock-token",
            });

            // Verify stubs were called correctly
            expect(
                findOneStub.calledOnceWith({
                    where: {
                        email: "test@example.com",
                        status: "active",
                    },
                    raw: true,
                })
            ).to.be.true;
            expect(
                comparePasswordStub.calledOnceWith(
                    "correct-password",
                    "hashed-password"
                )
            ).to.be.true;
            expect(jwtSignStub.calledOnce).to.be.true;
        });

        it("should fail login when user is not found", async function () {
            this.timeout(5000);
            // Stub database findOne to return null (no user found)
            sandbox.stub(db.User, "findOne").resolves(null);

            const result = await loginService.loginService({
                email: "notfound@example.com",
                password: "somepassword",
            });

            expect(result).to.deep.equal({
                err: 1,
                message: "User not found",
                accessToken: "Bearer null",
            });
        });

        it("should fail login with incorrect password", async function () {
            this.timeout(5000);
            // Stub database findOne to return mock user
            const findOneStub = sandbox
                .stub(db.User, "findOne")
                .resolves(mockUser);

            // Stub password comparison to return false
            const comparePasswordStub = sandbox
                .stub(hashPassword, "comparePassword")
                .returns(false);

            const result = await loginService.loginService({
                email: "test@example.com",
                password: "wrong-password",
            });

            expect(result).to.deep.equal({
                err: 1,
                message: "Invalid password",
                accessToken: "Bearer null",
            });
        });

        it("should handle database errors", async function () {
            this.timeout(5000);
            // Stub database findOne to throw error
            sandbox
                .stub(db.User, "findOne")
                .rejects(new Error("Database error"));

            try {
                await loginService.loginService({
                    email: "test@example.com",
                    password: "password",
                });
                // Should not reach here
                expect.fail("Should have thrown error");
            } catch (error) {
                expect(error.message).to.equal("Database error");
            }
        });
    });

    describe("registerService", () => {
        const mockUserData = {
            email: "test@example.com",
            password: "password123",
            name: "Test User",
        };

        it("should successfully register new user", async function () {
            this.timeout(5000);
            // Stub transaction
            const mockTransaction = {
                commit: sandbox.stub(),
                rollback: sandbox.stub(),
            };
            sandbox.stub(db.sequelize, "transaction").resolves(mockTransaction);

            // Stub User.findOne to return null (no existing user)
            sandbox.stub(db.User, "findOne").resolves(null);

            // Stub password hashing
            const hashedPassword = "hashed-password-123";
            sandbox.stub(hashPassword, "hashPassword").returns(hashedPassword);

            // Stub User.create
            const createdUser = {
                user_id: "new-user-id",
                email: mockUserData.email,
                name: mockUserData.name,
                role_id: 4,
            };
            sandbox.stub(db.User, "create").resolves(createdUser);

            // Stub Customer.create
            sandbox.stub(db.Customer, "create").resolves({});

            // Stub jwt sign
            sandbox.stub(jwt, "sign").returns("mock-token");

            const result = await loginService.registerService(mockUserData);

            expect(result).to.deep.equal({
                err: 0,
                message: "User registered successfully!",
                accessToken: "Bearer mock-token",
            });

            expect(mockTransaction.commit.calledOnce).to.be.true;
            expect(mockTransaction.rollback.called).to.be.false;
        });
    });

    describe("loginGoogleService", () => {
        const mockGoogleProfile = {
            emails: [{ value: "google-user@example.com" }],
            displayName: "Google User",
            photos: [{ value: "profile-pic-url" }],
            phoneNumbers: [{ value: "1234567890" }],
            birthdays: [{ date: "1990-01-01" }],
            token: "google-access-token",
        };

        it("should successfully login/register with Google profile for new user", async function () {
            this.timeout(5000);
            // Stub transaction
            const mockTransaction = {
                commit: sandbox.stub(),
                rollback: sandbox.stub(),
            };
            sandbox.stub(db.sequelize, "transaction").resolves(mockTransaction);

            // Stub findOrCreate to return a new user
            const findOrCreateStub = sandbox
                .stub(db.User, "findOrCreate")
                .resolves([
                    {
                        user_id: "new-google-user-id",
                        email: "google-user@example.com",
                        role_id: 4,
                    },
                    true, // isNewUser flag
                ]);

            // Stub Customer.create
            const createCustomerStub = sandbox
                .stub(db.Customer, "create")
                .resolves({});

            // Stub jwt sign
            const jwtSignStub = sandbox.stub(jwt, "sign").returns("mock-token");

            const result = await loginService.loginGoogleService(
                mockGoogleProfile
            );

            expect(result).to.deep.equal({
                err: 0,
                message: "Login successful",
                accessToken: "Bearer mock-token",
            });

            // Verify stubs were called correctly
            expect(findOrCreateStub.calledOnce).to.be.true;
            expect(createCustomerStub.calledOnce).to.be.true;
            expect(mockTransaction.commit.calledOnce).to.be.true;
        });

        it("should successfully update existing user with Google profile", async function () {
            this.timeout(5000);
            // Stub transaction
            const mockTransaction = {
                commit: sandbox.stub(),
                rollback: sandbox.stub(),
            };
            sandbox.stub(db.sequelize, "transaction").resolves(mockTransaction);

            // Stub findOrCreate to return an existing user
            const findOrCreateStub = sandbox
                .stub(db.User, "findOrCreate")
                .resolves([
                    {
                        user_id: "existing-google-user-id",
                        email: "google-user@example.com",
                        role_id: 4,
                    },
                    false, // existing user flag
                ]);

            // Stub User.update
            const updateUserStub = sandbox.stub(db.User, "update").resolves({});

            // Stub jwt sign
            const jwtSignStub = sandbox.stub(jwt, "sign").returns("mock-token");

            const result = await loginService.loginGoogleService(
                mockGoogleProfile
            );

            expect(result).to.deep.equal({
                err: 0,
                message: "Login successful",
                accessToken: "Bearer mock-token",
            });

            // Verify stubs were called correctly
            expect(findOrCreateStub.calledOnce).to.be.true;
            expect(updateUserStub.calledOnce).to.be.true;
            expect(mockTransaction.commit.calledOnce).to.be.true;
        });

        it("should rollback transaction on error during Google login", async () => {
            // Stub transaction
            const mockTransaction = {
                commit: sandbox.stub(),
                rollback: sandbox.stub(),
            };
            sandbox.stub(db.sequelize, "transaction").resolves(mockTransaction);

            // Stub findOrCreate to throw error
            const findOrCreateError = new Error("Database error");
            sandbox.stub(db.User, "findOrCreate").rejects(findOrCreateError);

            try {
                await loginService.loginGoogleService(mockGoogleProfile);
                expect.fail("Expected rejection");
            } catch (error) {
                expect(error).to.equal(findOrCreateError);
                expect(mockTransaction.rollback.calledOnce).to.be.true;
                expect(mockTransaction.commit.called).to.be.false;
            }
        });
    });
});
