// trigger.test.js

if (typeof expect === "undefined") { global.expect = require("expect.js"); }
if (typeof Arsenal === "undefined") { global.Arsenal = require("../arsenal.js"); }

// TEST CASE: Trigger mechanism
describe("Trigger", function () {

    this.timeout(0);

    before(function () {

        this.Trigger = Arsenal.Trigger;

    });

    it("initialize successfully", function () {

        expect(this.Trigger).to.be.ok();

        var trigger = new this.Trigger();

        expect(trigger).to.be.an(Object);

        expect(trigger.setCallback).to.be.a(Function);
        expect(trigger.addCondition).to.be.a(Function);
        expect(trigger.removeCondition).to.be.a(Function);
        expect(trigger.getContext).to.be.a(Function);
        expect(trigger.setContext).to.be.a(Function);
        expect(trigger.unsetContext).to.be.a(Function);
        expect(trigger.inspector).to.be.a(Function);

        expect(trigger.hook).to.be(trigger.setCallback);
        expect(trigger.watch).to.be(trigger.addCondition);
        expect(trigger.neglect).to.be(trigger.removeCondition);
        expect(trigger.get).to.be(trigger.getContext);
        expect(trigger.set).to.be(trigger.setContext);
        expect(trigger.unset).to.be(trigger.unsetContext);

    });

    describe("Test.1", function () {

        before(function () {

            this.trigger = new this.Trigger();

        });

        it("basic function", function () {

            var counter = 0,
                counter1 = 0,
                counter2 = 0;

            var condition1 = function () {
                    counter1++;
                    return (this.var1 === 123);
                },
                condition2 = function () {
                    counter2++;
                    return (this.var2 === "abc");
                },
                callback = function () {
                    counter++;
                };

            this.trigger.hook(callback);

            this.trigger.set("var1", 123);
            expect(this.trigger.get("var1")).to.be(123);
            expect(counter1).to.be(0);
            expect(counter2).to.be(0);
            expect(counter).to.be(1);

            this.trigger.watch(condition1);
            expect(counter1).to.be(1);
            expect(counter2).to.be(0);
            expect(counter).to.be(2);

            this.trigger.watch(condition2);
            expect(counter1).to.be(2);
            expect(counter2).to.be(1);
            expect(counter).to.be(2);

            counter = 0;
            counter1 = 0;
            counter2 = 0;

            this.trigger.set("var2", "ABC");
            expect(counter1).to.be(1);
            expect(counter2).to.be(1);
            expect(counter).to.be(0);

            this.trigger.set("var2", "abc");
            expect(counter1).to.be(2);
            expect(counter2).to.be(2);
            expect(counter).to.be(1);

            this.trigger.set("var1", 456);
            expect(counter1).to.be(3);
            expect(counter2).to.be(2);
            expect(counter).to.be(1);

            this.trigger.neglect(condition1);
            expect(counter).to.be(2);

            this.trigger.unset("var2");
            expect(this.trigger.get("var2")).not.to.be.ok();

            this.trigger.unset();
            expect(this.trigger.get("var1")).not.to.be.ok();

        });

    });

});
