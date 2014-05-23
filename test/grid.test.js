// grid.test.js

if (typeof expect === "undefined") { global.expect = require("expect.js"); }
if (typeof Arsenal === "undefined") { global.Arsenal = require("../arsenal.js"); }

// TEST CASE: Grid mechanism
describe("Grid", function () {

    this.timeout(0);

    before(function () {

        this.Grid = Arsenal.Grid;

    });

    it("initialized successfully", function () {

        expect(this.Grid).to.be.ok();

        var grid = new this.Grid();

        expect(grid).to.be.an(Object);

        expect(grid.addElements).to.be.a(Function);
        expect(grid.pushElements).to.be.a(Function);
        expect(grid.getCurrentProgress).to.be.a(Function);
        expect(grid.setupHandler).to.be.a(Function);
        expect(grid.runGrid).to.be.a(Function);
        expect(grid.done).to.be.a(Function);
        expect(grid.next).to.be.a(Function);

        expect(grid.add).to.be(grid.addElements);
        expect(grid.push).to.be(grid.pushElements);
        expect(grid.count).to.be(grid.getCurrentProgress);
        expect(grid.setup).to.be(grid.setupHandler);
        expect(grid.run).to.be(grid.runGrid);

    });

    describe("Test.1", function () {

        before(function () {

            this.grid = new this.Grid();

        });

        it("run with normal elements in pattern 1-2-1-3-4-1", function (done) {

            var counter = 0;

            var a = "this is a grid running one column a time as a matrix",
                b = "",
                matrix = [
                    [ "this" ],
                    [ "is", "a" ],
                    [ "grid" ],
                    [ "running", "one", "column"],
                    [ "a", "time", "as", "a" ],
                    [ "matrix" ]
                ],
                handler = function (element, next) {
                    counter++;

                    if (next) {
                        b = b.trim() + " " + element;
                        next();

                    } else {
                        expect(b).to.be(a);
                        done();
                    }
                };

            this.grid.add(matrix[0][0]);
            this.grid.push(matrix[1][0], matrix[1][1]);
            this.grid.push(matrix[2][0]);
            this.grid.push();
            this.grid.add(matrix[3][0], matrix[3][1], matrix[3][2]);
            this.grid.push(matrix[4][0], matrix[4][1], matrix[4][2], matrix[4][3]);
            this.grid.push(matrix[5][0]);

            this.grid.setup(handler);
            this.grid.run();

            expect(counter).to.be(0);

        });

    });

    describe("Test.2", function () {

        before(function () {

            this.grid = new this.Grid();

        });

        it("run with function elements in pattern 2-2-3", function (done) {

            var counter = 0;

            var a = "functions can also be the grid elements",
                b = "",
                matrix = [
                    [
                        function () { return "functions"; },
                        function () { return "can"; }
                    ],
                    [
                        function () { return "also"; },
                        function () { return "be"; }
                    ],
                    [
                        function () { return "the"; },
                        function () { return "grid"; },
                        function () { return "elements"; }
                    ]
                ],
                handler = function (element, next) {
                    counter++;

                    if (next) {
                        b = b.trim() + " " + element();
                        next();

                    } else {
                        expect(b).to.be(a);
                        done();
                    }
                };

            this.grid.push(matrix[0][0], matrix[0][1]);
            this.grid.push(matrix[1][0], matrix[1][1]);
            this.grid.push(matrix[2][0], matrix[2][1], matrix[2][2]);

            this.grid.setup(handler);
            this.grid.run();

            expect(counter).to.be(0);

        });

    });

});
