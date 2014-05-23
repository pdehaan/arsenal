// throttle.test.js

if (typeof expect === "undefined") { global.expect = require("expect.js"); }
if (typeof Arsenal === "undefined") { global.Arsenal = require("../arsenal.js"); }

// TEST CASE: Throttle mechanism
describe("Throttle", function () {

    this.timeout(0);

    before(function () {

        this.Throttle = Arsenal.Throttle;

    });

    it("initialized successfully", function () {

        expect(this.Throttle).to.be.ok();

        var throttle = new this.Throttle();

        expect(throttle).to.be.an(Object);

        expect(throttle.setupWorker).to.be.a(Function);
        expect(throttle.runWorker).to.be.a(Function);
        expect(throttle.setPrecision).to.be.a(Function);
        expect(throttle.setThreshold).to.be.a(Function);
        expect(throttle.check).to.be.a(Function);
        expect(throttle.process).to.be.a(Function);

        expect(throttle.setup).to.be(throttle.setupWorker);
        expect(throttle.run).to.be(throttle.runWorker);
        expect(throttle.precision).to.be(throttle.setPrecision);
        expect(throttle.threshold).to.be(throttle.setThreshold);

    });

    describe("Test.1", function () {

        before(function () {

            this.throttle = new this.Throttle();

        });

        it("basic function", function (done) {

            var counter = 0;

            var worker = function (a, b) {
                    counter++;
                    expect(a).to.be(1);
                    expect(b).to.be(2);
                };

            this.throttle.setup(worker);
            this.throttle.precision(1000);
            this.throttle.threshold(1);

            this.throttle.run(1, 2);
            this.throttle.run(3, 4);

            expect(counter).to.be(1);

            setTimeout(function () {
                expect(counter).to.be(1);
                done();
            }, 20);

            this.timeout(100);

        });

    });

});
