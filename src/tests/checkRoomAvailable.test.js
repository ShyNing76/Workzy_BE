import { expect } from "chai";
import sinon from "sinon";
import * as checkRoomAvailabilityModule from "./index";
import db from "../models";

describe("checkRoomAvailability", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return false if a confirmed booking exists within the time range", async () => {
    const mockBooking = {
      id: 1,
      workspace_id: 1,
      start_time: "2023-10-01T10:00:00Z",
      end_time: "2023-10-01T12:00:00Z",
    };
    sandbox.stub(db.Booking, "findOne").resolves(mockBooking);

    const result = await checkRoomAvailabilityModule.checkRoomAvailability({
      workspace_id: 1,
      start_time: "2023-10-01T11:00:00Z",
      end_time: "2023-10-01T13:00:00Z",
    });

    expect(result).to.be.false;
  });

  it("should return true if no confirmed booking exists within the time range", async () => {
    sandbox.stub(db.Booking, "findOne").resolves(null);

    const result = await checkRoomAvailabilityModule.checkRoomAvailability({
      workspace_id: 1,
      start_time: "2023-10-01T11:00:00Z",
      end_time: "2023-10-01T13:00:00Z",
    });

    expect(result).to.be.true;
  });

  it("should return false if an error occurs during the database query", async () => {
    sandbox.stub(db.Booking, "findOne").throws(new Error("Database error"));

    const result = await checkRoomAvailabilityModule.checkRoomAvailability({
      workspace_id: 1,
      start_time: "2023-10-01T11:00:00Z",
      end_time: "2023-10-01T13:00:00Z",
    });

    expect(result).to.be.false;
  });
});
