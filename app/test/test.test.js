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
  describe("Login", () => {
    it("should return a token", async () => {
      const res = await apiTestingUtility("post", "/login", testingAccount);
      expect(res.data).to.include.all.keys("loggedIn", "token");
    });
  });
  describe("Get current user", () => {
    it("should return the non-sensitive user information", async () => {
      const token = await apiTestingUtility("post", "/login", testingAccount);
      const res = await apiTestingUtility("get", "/login", null, token);
      expect(res.data).to.include.all.keys(
        "email",
        "id",
        "updatedAt",
        "createdAt",
        "banned"
      );
    });
  });
});
