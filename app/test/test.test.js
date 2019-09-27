const { expect } = require("chai");

describe("Testing Suite", () => {
  describe("Registration", () => {
    it("should return the user object", async () => {
      const res; // await API call
      expect(res.data).to.include.all.keys('email', 'pasword', 'createdAt')
    });
  });
});
