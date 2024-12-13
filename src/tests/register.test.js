import { expect } from "chai";
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

    describe("registerService", () => {
        it("should successfully register a new user", async () => {
            // Stub transaction
            const mockTransaction = {
                commit: sandbox.stub(),
                rollback: sandbox.stub()
            };
            sandbox.stub(db.sequelize, "transaction").resolves(mockTransaction);

            // Stub findOne to return null (email not taken)
            sandbox.stub(db.User, "findOne").resolves(null);

            // Stub User.create
            const createUserStub = sandbox.stub(db.User, "create").resolves({
                user_id: "new-user-id",
                email: "newuser@example.com",
                name: "New User",
                role_id: 4
            });

            // Stub Customer.create
            const createCustomerStub = sandbox.stub(db.Customer, "create").resolves({});

            // Stub password hashing
            const hashPasswordStub = sandbox.stub(hashPassword, "hashPassword").returns("hashed-password");

            // Stub jwt sign
            const jwtSignStub = sandbox.stub(jwt, "sign").returns("mock-token");

            const result = await loginService.registerService({
                email: "newuser@example.com",
                password: "password123",
                name: "New User"
            });

            expect(result).to.deep.equal({
                err: 0,
                message: "User registered successfully!",
                accessToken: "Bearer mock-token"
            });

            // Verify stubs were called correctly
            expect(createUserStub.calledOnce).to.be.true;
            expect(createCustomerStub.calledOnce).to.be.true;
            expect(mockTransaction.commit.calledOnce).to.be.true;
        });

        it("should reject registration when email is already taken", async () => {
            // Stub transaction
            const mockTransaction = {
                commit: sandbox.stub(),
                rollback: sandbox.stub()
            };
            sandbox.stub(db.sequelize, "transaction").resolves(mockTransaction);

            // Stub findOne to return existing user
            sandbox.stub(db.User, "findOne").resolves({
                user_id: "existing-user-id",
                email: "existing@example.com"
            });

            try {
                await loginService.registerService({
                    email: "existing@example.com",
                    password: "password123",
                    name: "Existing User"
                });
                expect.fail("Expected rejection");
            } catch (error) {
                expect(error).to.equal("Email is already taken");
            }
        });
        it("should rollback transaction on error during user creation", async () => {
            // Stub transaction
            const mockTransaction = {
                commit: sandbox.stub(),
                rollback: sandbox.stub()
            };
            sandbox.stub(db.sequelize, "transaction").resolves(mockTransaction);

            // Stub findOne to return no existing user
            sandbox.stub(db.User, "findOne").resolves(null);

            // Stub User.create to throw error
            const createError = new Error("Database error");
            sandbox.stub(db.User, "create").rejects(createError);

            try {
                await loginService.registerService({
                    email: "newuser@example.com",
                    password: "password123",
                    name: "New User"
                });
                expect.fail("Expected rejection");
            } catch (error) {
                expect(error).to.equal(createError);
                expect(mockTransaction.rollback.calledOnce).to.be.true;
                expect(mockTransaction.commit.called).to.be.false;
            }
        });
    });
});