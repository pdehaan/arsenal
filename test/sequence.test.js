// sequence.test.js

if (typeof expect === "undefined") { global.expect = require("expect.js"); }
if (typeof Arsenal === "undefined") { global.Arsenal = require("../arsenal.js"); }

// TEST CASE: Sequence mechanism
describe("Sequence", function () {

    this.timeout(0);

    before(function () {

        this.Sequence = Arsenal.Sequence;

    });

    it("initialized successfully", function () {

        expect(this.Sequence).to.be.ok();

        var sequence = new this.Sequence();

        expect(sequence).to.be.an(Object);

        expect(sequence.pushFunction).to.be.a(Function);
        expect(sequence.popFunction).to.be.a(Function);
        expect(sequence.shiftFunction).to.be.a(Function);
        expect(sequence.unshiftFunction).to.be.a(Function);
        expect(sequence.countFunctions).to.be.a(Function);
        expect(sequence.setContext).to.be.a(Function);
        expect(sequence.next).to.be.a(Function);
        expect(sequence.run).to.be.a(Function);

        expect(sequence.push).to.be(sequence.pushFunction);
        expect(sequence.pop).to.be(sequence.popFunction);
        expect(sequence.shift).to.be(sequence.shiftFunction);
        expect(sequence.unshift).to.be(sequence.unshiftFunction);
        expect(sequence.count).to.be(sequence.countFunctions);
        expect(sequence.context).to.be(sequence.setContext);

    });

    describe("Test.1", function () {

        before(function () {

            this.sequence = new this.Sequence();

        });

        it("basic function", function () {

            var context = {
                    a: 1,
                    b: 2
                },
                param1 = 1,
                param2 = 5,
                func = function (a, b, callback) {
                    callback(a + b);
                };

            // Add function one at a time
            // function #3
            this.sequence.push(function () {
                // Remove function(s) in action
                this.shift();
                expect(this.count()).to.be(6);
                this.pop();
                expect(this.count()).to.be(5);

                this.next();
            });
            // function #4
            this.sequence.push(function () {
                // No way to run to here due to the removal at function #3
                expect(1).to.be(2);

                this.next();
            });

            expect(this.sequence.count()).to.be(2);

            // Add functions in a batch
            this.sequence.push([

                // function #5
                function () {
                    func(this.a + this.b, this.c + this.d, this.next);
                },

                // function #6
                function (result) {
                    expect(result).to.be(9);

                    this.next();
                },

                // function #7
                function () {
                    // No way to run to here due to the removal at function #3
                    expect(1).to.be(2);

                    this.next();
                }

            ]);

            expect(this.sequence.count()).to.be(5);

            // Insert functions at the beginning
            // function #2
            this.sequence.unshift(function () {
                expect(this.c).to.be(param1);
                expect(this.d).to.be(param2);
                this.next();
            });

            this.sequence.unshift([

                // function #1
                function (arg1, arg2) {
                    expect(arg1).to.be(param1);
                    expect(arg2).to.be(param2);

                    this.c = arg1;
                    this.d = arg2;

                    this.next();
                }

            ]);

            expect(this.sequence.count()).to.be(7);

            // Initialize sequence context
            this.sequence.context({
                a: 1,
                b: 2
            });

            // Run functions in sequence
            this.sequence.run(param1, param2);

        });

    });

});
