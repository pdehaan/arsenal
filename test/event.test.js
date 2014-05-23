// event.test.js

if (typeof expect === "undefined") { global.expect = require("expect.js"); }
if (typeof Arsenal === "undefined") { global.Arsenal = require("../arsenal.js"); }

// TEST CASE: Event mechanism
describe("Event", function () {

    this.timeout(0);

    before(function () {

        this.Event = Arsenal.Event;

    });

    it("initialized successfully", function () {

        expect(this.Event).to.be.ok();

        var event = new this.Event();

        expect(event).to.be.an(Object);

        expect(event).to.have.property("DISPATCH_NEXT");
        expect(event).to.have.property("DISPATCH_STOP");

        expect(event.getListeners).to.be.a(Function);
        expect(event.addListener).to.be.a(Function);
        expect(event.addListenerOnce).to.be.a(Function);
        expect(event.removeListener).to.be.a(Function);
        expect(event.removeAllListeners).to.be.a(Function);
        expect(event.dispatchSync).to.be.a(Function);
        expect(event.dispatchAsync).to.be.a(Function);
        expect(event.setMaxListeners).to.be.a(Function);

        expect(event.listeners).to.be(event.getListeners);
        expect(event.on).to.be(event.addListener);
        expect(event.once).to.be(event.addListenerOnce);
        expect(event.off).to.be(event.removeListener);
        expect(event.dispatch).to.be(event.dispatchSync);
        expect(event.emit).to.be(event.dispatchSync);
        expect(event.emitAsync).to.be(event.dispatchAsync);
        expect(event.limit).to.be(event.setMaxListeners);

    });

    describe("Test.1", function () {

        before(function () {

            this.event = new this.Event();

        });

        it("dispatch synchronously (using dispatch)", function () {

            var counter = 0;

            var name = "sync test",
                data = "test data",
                listener = function (eventData) {
                    counter++;
                    expect(eventData).to.be(data);
                };

            this.event.on(name, listener);
            this.event.dispatch(name, data);
            expect(counter).to.be(1);

            this.event.off(name, listener);
            this.event.dispatch(name, data);
            expect(counter).to.be(1);

        });

        it("dispatch synchronously (using emit)", function () {

            var counter = 0;

            var name = "sync test",
                data = "test data",
                listener = function (eventData) {
                    counter++;
                    expect(eventData).to.be(data);
                };

            this.event.on(name, listener);
            this.event.emit(name, data);
            expect(counter).to.be(1);

            this.event.off(name, listener);
            this.event.emit(name, data);
            expect(counter).to.be(1);

        });

    });

    describe("Test.2", function () {

        before(function () {

            this.event = new this.Event();

        });

        it("dispatch asynchronously phase.1", function (done) {

            var name = "async test p1",
                data = "test data p1",
                listener = function (eventData) {
                    expect(eventData).to.be(data);
                    done();
                };

            this.event.on(name, listener);
            this.event.emitAsync(name, data);

            this.timeout(100);

        });

        it("dispatch asynchronously phase.2", function (done) {

            var name = "async test p2",
                data = "test data p2",
                listener = function (eventData) {
                    expect(eventData).to.be(data);
                    done();
                };

            this.event.on(name, listener);
            this.event.emitAsync(name, data);

            this.event.off(name, listener);
            this.event.emitAsync(name, data);

            this.timeout(100);

        });

    });

    describe("Test.3", function () {

        before(function () {

            this.event = new this.Event();

        });

        it("dispatch once only", function () {

            var counter = 0;

            var name = "once test",
                data = "test data",
                listener = function (eventData) {
                    counter++;
                    expect(eventData).to.be(data);
                };

            this.event.once(name, listener);
            this.event.dispatch(name, data);
            expect(counter).to.be(1);

            this.event.dispatch(name, data);
            expect(counter).to.be(1);

        });

    });

});
