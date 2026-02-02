const { expect } = require("chai");
const calculator = require("../app/calculator");

describe("Calculator Test Cases", () => {

  describe("ADD", () => {
    it("PASS: add(5,2) should be 7", () => {
      const result = calculator.add(5, 2);
      expect(result).to.equal(7);
      console.log("ADD PASS");
    });

    it("FAIL: add(5,2) should be 8", () => {
      const result = calculator.add(5, 2);
      expect(result).to.equal(8);
      console.log("ADD FAIL");
    });
  });

  describe("SUB", () => {
    it("PASS: sub(5,2) should be 3", () => {
      const result = calculator.sub(5, 2);
      expect(result).to.equal(3);
      console.log("SUB PASS");
    });

    it("FAIL: sub(5,2) should be 5", () => {
      const result = calculator.sub(5, 2);
      expect(result).to.equal(5);
      console.log("SUB FAIL");
    });
  });

  describe("MUL", () => {
    it("PASS: mul(5,2) should be 10", () => {
      const result = calculator.mul(5, 2);
      expect(result).to.equal(10);
      console.log("MUL PASS");
    });

    it("FAIL: mul(5,2) should be 12", () => {
      const result = calculator.mul(5, 2);
      expect(result).to.equal(12);
      console.log("MUL FAIL");
    });
  });

  describe("DIV", () => {
    it("PASS: div(10,2) should be 5", () => {
      const result = calculator.div(10, 2);
      expect(result).to.equal(5);
      console.log("DIV PASS");
    });

    it("FAIL: div(10,2) should be 2", () => {
      const result = calculator.div(10, 2);
      expect(result).to.equal(2);
      console.log("DIV FAIL");
    });
  });

});
