// functional.test.js

if (typeof expect === "undefined") { global.expect = require("expect.js"); }
if (typeof Arsenal === "undefined") { global.Arsenal = require("../arsenal.js"); }

// TEST CASE: Functional mechanism
describe("Functional", function () {

    this.timeout(0);

    before(function () {

        this.Functional = Arsenal.Functional;

    });

    it("initialized successfully", function () {

        expect(this.Functional).to.be.ok();

        var F = new this.Functional();

        expect(F).to.be.a(Function);

    });

    describe("Test.1", function () {

        before(function () {

            this.F = new this.Functional();

        });

        it("function functions in chain", function (done) {

            var F = this.F,
                counter = 0;

            var n = Math.random(),
                func1 = function (n) {
                    counter++;
                    this.n = n;
                    return F("func2");
                },
                func2 = function () {
                    counter++;
                    return F("func3");
                },
                func3 = function () {
                    counter++;
                    expect(counter).to.be(3);
                    expect(this.n).to.be(n);
                    return n;
                };

            F("func1", func1);

            F("func2", func2);

            F("func3", func3);

            F("func1", [], function (result) {
                expect(result).to.be(n);
                done();
            })(n);

            this.timeout(1000);

        });

    });

    describe("Test.2", function () {

        before(function () {

            this.F = new this.Functional();

        });

        it("function functions with arguments and context", function (done) {

            var F = this.F,
                counter = 0;

            var n = Math.random(),
                k = Math.random(),
                r = n * k,
                func1 = function (n) {
                    counter++;
                    this.n = n;
                    return F("func2", [ n * k ]);
                },
                func2 = function (x) {
                    counter++;
                    this.x = x;
                    return F("func3", [], { y: x });
                },
                func3 = function () {
                    counter++;
                    expect(counter).to.be(3);
                    expect(this.n).not.to.be.ok();
                    expect(this.x).not.to.be.ok();
                    expect(this.y).to.be(r);
                    return true;
                };

            F("func1", func1);

            F("func2", func2);

            F("func3", func3);

            F("func1", [], function (result){
                expect(result).to.be(true);
                done();
            })(n);

            this.timeout(1000);

        });

    });

});
