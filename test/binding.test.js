// binding.test.js

if (typeof expect === "undefined") { global.expect = require("expect.js"); }
if (typeof Arsenal === "undefined") { global.Arsenal = require("../arsenal.js"); }

// TEST CASE: Binding mechanism
describe("Binding", function () {

    this.timeout(0);

    before(function () {

        this.Binding = Arsenal.Binding;

    });

    it("initialized successfully", function () {

        expect(this.Binding).to.be.ok();

        var binding = new this.Binding();

        expect(binding).to.be.an(Object);

        expect(binding.bindTarget).to.be.a(Function);
        expect(binding.unbindTarget).to.be.a(Function);
        expect(binding.clearBindings).to.be.a(Function);
        expect(binding.updateSource).to.be.a(Function);
        expect(binding.getData).to.be.a(Function);

        expect(binding.bind).to.be(binding.bindTarget);
        expect(binding.unbind).to.be(binding.unbindTarget);
        expect(binding.clear).to.be(binding.clearBindings);
        expect(binding.update).to.be(binding.updateSource);
        expect(binding.get).to.be(binding.getData);

    });

    describe("Test.1", function () {

        before(function () {

            this.binding = new this.Binding();

        });

        it("basic function", function () {

            var data = {
                    a: 1,
                    b: 22,
                    c: 333,
                    d: {
                        x: 4,
                        y: 5
                    }
                };

            this.binding.update(null, data);
            expect(data.a).to.be(1);
            expect(data.b).to.be(22);
            expect(data.c).to.be(333);
            expect(data.d.x).to.be(4);
            expect(data.d.y).to.be(5);

        });

    });

    describe("Test.2", function () {

        before(function () {

            this.data = {
                a: 1,
                b: 22,
                c: 333,
                d: {
                    x: 4,
                    y: 5
                },
                e: {
                    x: { v: 0 },
                    y: { v: 1 }
                },
                f: [
                    0, 1, 2, 3, 4
                ],
                g: [
                    { v: 0 },
                    { v: 1 },
                    { v: 2 }
                ]
            };

            this.binding = new this.Binding(this.data);

        });

        it("bind to self nodes", function () {

            var data = this.data;

            this.binding.bind("a", "zzzz");
            this.binding.update("a", 123);
            expect(data.a).to.be(123);
            expect(data.zzzz).to.be(123);

            this.binding.unbind("a", "zzzz");
            this.binding.update("a", 456);
            expect(data.a).to.be(456);
            expect(data.zzzz).to.be(123);

        });

        it("bind to functions", function () {

            var counter = 0;

            var data = this.data,
                handler = function (value, key, handler, former, path) {
                    counter++;
                    expect(value).to.be(123);
                    expect(key).to.be("b");
                    expect(handler).to.be(undefined);
                    expect(former).to.be(22);
                    expect(path).to.be("b");
                };

            this.binding.bind("b", handler);
            this.binding.update("b", 123);
            expect(counter).to.be(1);

            this.binding.unbind("b", handler);
            this.binding.update("b", 456);
            expect(counter).to.be(1);

        });

        it("bind to properties", function () {

            var data = this.data,
                object = {
                    X: 0,
                    Y: 1
                },
                property = [ object, "X" ];

            this.binding.bind("c", property);
            this.binding.update("c", 123);
            expect(object.X).to.be(123);

            this.binding.unbind("c", property);
            this.binding.update("c", 456);
            expect(object.X).to.be(123);

        });

        it("bind via object path", function () {

            var data = this.data;

            this.binding.bind("d.x", "d.y");
            this.binding.update("d.x", 123);
            expect(data.d.x).to.be(123);
            expect(data.d.y).to.be(123);

            this.binding.unbind("d.x", "d.y");
            this.binding.update("d.x", 456);
            expect(data.d.x).to.be(456);
            expect(data.d.y).to.be(123);

        });

        it("bind via object entry wildcard", function () {

            var data = this.data;

            this.binding.bind("d.*", "dd");
            this.binding.update("d.x", 123);
            expect(data.d.x).to.be(123);
            expect(data.dd).to.be(123);

            this.binding.unbind("d.*", "dd");
            this.binding.update("d.x", 456);
            expect(data.d.x).to.be(456);
            expect(data.dd).to.be(123);

        });

        it("bind via object wildcard with more deeper level", function () {

            var data = this.data;

            this.binding.bind("e.*.v", "ee");
            this.binding.update("e.x.v", 123);
            expect(data.e.x.v).to.be(123);
            expect(data.ee).to.be(123);

            this.binding.unbind("e.*.v", "ee");
            this.binding.update("e.x.v", 456);
            expect(data.e.x.v).to.be(456);
            expect(data.ee).to.be(123);

        });

        it("bind via array index", function () {

            var data = this.data;

            this.binding.bind("f[3]", "f[2]");
            this.binding.update("f[3]", 123);
            expect(data.f[3]).to.be(123);
            expect(data.f[2]).to.be(123);

            this.binding.unbind("f[3]", "f[2]");
            this.binding.update("f[3]", 456);
            expect(data.f[3]).to.be(456);
            expect(data.f[2]).to.be(123);

        });

        it("bind via array element wildcard", function () {

            var data = this.data;

            this.binding.bind("f[*]", "ff");
            this.binding.update("f[4]", 123);
            expect(data.f[4]).to.be(123);
            expect(data.ff).to.be(123);

            this.binding.unbind("f[*]", "ff");
            this.binding.update("f[4]", 456);
            expect(data.f[4]).to.be(456);
            expect(data.ff).to.be(123);

        });

        it("bind via array wildcard with more deeper level", function () {

            var data = this.data;

            this.binding.bind("g[*].v", "gg");
            this.binding.update("g[1].v", 123);
            expect(data.g[1].v).to.be(123);
            expect(data.gg).to.be(123);

            this.binding.unbind("g[*].v", "gg");
            this.binding.update("g[1].v", 456);
            expect(data.g[1].v).to.be(456);
            expect(data.gg).to.be(123);

        });

    });

    describe("Test.3", function () {

        before(function () {

            this.data = {
                a: 1,
                b: {
                    x: 2,
                    y: 3
                },
                c: [
                    0, 1, 2
                ]
            };

            this.binding = new this.Binding(this.data);

        });

        it("get data by path", function () {

            var data = this.data;

            expect(this.binding.get("a")).to.be(data.a);
            expect(this.binding.get("b")).to.be(data.b);
            expect(this.binding.get("b.y")).to.be(data.b.y);
            expect(this.binding.get("b.z")).to.be(undefined);
            expect(this.binding.get("c")).to.be(data.c);
            expect(this.binding.get("c[0]")).to.be(data.c[0]);
            expect(this.binding.get("c[3]")).to.be(undefined);
            expect(this.binding.get("c.1")).to.be(data.c[1]);
            expect(this.binding.get("c.2")).to.be(data.c[2]);

        });

    });

    describe("Test.4", function () {

        before(function () {

            this.data = {
                a: [
                    0, 1, 2
                ],
                b: {
                    c: 4,
                    d: 5
                }
            };

            this.binding = new this.Binding(this.data);

        });

        it("handler in number as indicator", function () {

            var data = this.data;

            expect(this.binding.get("a[2]")).to.be(2);
            expect(this.data.a).to.have.length(3);

            this.binding.update("a", 5, -3);
            expect(this.binding.get("a[2]")).to.be(5);
            expect(this.data.a).to.have.length(4);

            this.binding.update("a", 6, 2);
            expect(this.binding.get("a[2]")).to.be(6);
            expect(this.data.a).to.have.length(4);

            this.binding.update("a", undefined, 2);
            expect(this.binding.get("a[2]")).to.be(2);
            expect(this.data.a).to.have.length(3);

        });

        it("handler in null as indicator", function () {

            var data = this.data;

            this.binding.update("a", 5, null);
            expect(this.binding.get("a[3]")).to.be(5);
            expect(this.data.a).to.have.length(4);

            this.binding.update("a", undefined, 3);
            expect(this.data.a).to.have.length(3);

        });

        it("handler in string as indicator", function () {

            var data = this.data;

            expect(this.binding.get("b.c")).to.be(4);
            this.binding.update("b", 5, "c");
            expect(this.binding.get("b.c")).to.be(5);

            this.binding.update("b", undefined, "c");
            expect(this.binding.get("b")).to.not.have.property("c");

            this.binding.update("b", 4, "c");
            expect(this.binding.get("b.c")).to.be(4);

        });

        it("handler as the array of Data-Synchronize-Notation", function () {

            var data = this.data;

            expect(this.binding.get("a[2]")).to.be(2);
            expect(this.data.a).to.have.length(3);

            this.binding.update("a", 16, [ -3, 5 ]);
            expect(this.binding.get("a[2]")).to.be(5);
            expect(this.data.a).to.have.length(4);

            this.binding.update("a", 27, [ 2, 6 ]);
            expect(this.binding.get("a[2]")).to.be(6);
            expect(this.data.a).to.have.length(4);

            this.binding.update("a", 33, [ 2 ]);
            expect(this.binding.get("a[2]")).to.be(2);
            expect(this.data.a).to.have.length(3);

            expect(this.binding.get("b.c")).to.be(4);
            this.binding.update("b", 48, [ "c", 5 ]);
            expect(this.binding.get("b.c")).to.be(5);

            this.binding.update("b", 55, [ "c" ]);
            expect(this.binding.get("b")).to.not.have.property("c");

            this.binding.update("b", 69, [ "c", 4 ]);
            expect(this.binding.get("b.c")).to.be(4);

        });

        it("customize updation handler", function () {

            var data = this.data;

            expect(this.binding.get("a[3]")).to.be(undefined);
            this.binding.update("a", 4, function (source, value) {
                source.push(value);
                return source;
            });
            expect(this.binding.get("a[3]")).to.be(4);

        });

    });

    describe("Test.5", function () {

        before(function () {

            this.data = {
                a: {
                    x: 0,
                    y: 1
                },
                b: {
                    x: { v: 3 },
                    y: { v: 4 }
                },
                c: [
                    0, 1, 2
                ],
                d: [
                    { v: 4 },
                    { v: 5 },
                    { v: 6 }
                ]
            };

            this.binding = new this.Binding(this.data);

        });

        it("update a bucket of entries in an object", function () {

            var data = this.data;

            this.binding.update("a.*", 2);
            expect(data.a.x).to.be(2);
            expect(data.a.y).to.be(2);

            this.binding.update("b.*.v", 2);
            expect(data.b.x.v).to.be(2);
            expect(data.b.y.v).to.be(2);

        });

        it("update a bucket of elements in an array", function () {

            var data = this.data;

            this.binding.update("c[*]", 3);
            expect(data.c[0]).to.be(3);
            expect(data.c[1]).to.be(3);
            expect(data.c[2]).to.be(3);

            this.binding.update("d[*].v", 3);
            expect(data.d[0].v).to.be(3);
            expect(data.d[1].v).to.be(3);
            expect(data.d[2].v).to.be(3);

        });

    });
/*
    describe("Test.6", function () {

        before(function () {

            this.data = {
                a: {
                    'x.v': 0,
                    'y.v': 1
                },
                b: {
                    '' : 2
                },
                c: {
                    '' : 3
                }
            };

            this.binding = new this.Binding(this.data);

        });

        it("node name within quotes", function () {

            var data = this.data;

            this.binding.update("a.'x.v'", 123);
            this.binding.update("a.\"y.v\"", 456);
            expect(data.a.x).to.be(123);
            expect(data.a.y).to.be(456);
            expect(this.binding.get("a.'x.v'")).to.be(123);
            expect(this.binding.get("a.\"y.v\"")).to.be(456);

            this.binding.update("b.''", 123);
            expect(data.b['']).to.be(123);
            expect(this.binding.get("b.''")).to.be(123);

            this.binding.update("c.\"\"", 456);
            expect(data.c[""]).to.be(456);
            expect(this.binding.get("c.\"\"")).to.be(456);

        });

    });
*/
});
