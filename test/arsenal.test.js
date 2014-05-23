// Arsenal.test.js

if (typeof expect === "undefined") { global.expect = require("expect.js"); }
if (typeof Arsenal === "undefined") { global.Arsenal = require("../arsenal.js"); }

// TEST CASE: Arsenal
describe("Arsenal", function () {

    this.timeout(0);

    it("should be loaded successfully", function () {

        expect(Arsenal).to.be.ok();

    });

});
