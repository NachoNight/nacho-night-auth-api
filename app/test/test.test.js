const { expect } = require("chai");
const apiTestingUtility = require("../utils/apiTestingUtility");

const testingAccount = {
  email: "testing@account.com",
  password: "test1234",
  confirmPassword: "test1234"
};

describe("Testing Suite", () => {
  describe("Registration", () => {
    it("should return the user object", async () => {
      const res = await apiTestingUtility("post", "/register", testingAccount);
      expect(res.data).to.include.all.keys(
        "email",
        "password",
        "id",
        "updatedAt",
        "createdAt",
        "verified",
        "banned"
      );
    });
  });
});
