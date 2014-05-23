// ### Event Mechanism
//
// Stablity: **STABLE**
//
// Implementation of the well-known *Event* mechanism.
//
// Compatible to the events.EventEmitter in node.js.
//
(function (Arsenal) {

    // * **Constructor**
    //
    //     ```var event = new Arsenal.Event()```
    //
    function Event() {

        /* Listeners map */
        this._listeners = {};
        /* Listener contexts */
        this._contexts = {};
        /* One-off listeners' name list */
        this._removals = [];
        /* Max listeners per each event */
        this._max = 10;
        /* Continue to next event listener (default) */
        this.DISPATCH_NEXT = true;
        /* Stop event bubbling */
        this.DISPATCH_STOP = false;

    }

    // * **event.getListeners(name)**
    // * **event.listeners(name)**
    //
    //     Get all listerners binding on the specific event
    //
    //     Parameters:
    //
    //     - `name` *string* Name of the event
    //
    //     Returns:
    //
    //     - *Array* List of the event listeners
    //
    function getListeners(name) {

        return this._listeners[name];

    }

    // * **event.addListener(name, listener, [context])**
    // * **event.on(name, listener, [context])**
    //
    //     Add a listener on the specific event
    //
    //     Parameters:
    //
    //     - `name` *string* Event name to listen to
    //
    //     - `listener` *function* Listener function
    //
    //     - `context` *object* Optional, the context object of the listener function to be called in
    //
    //     Returns:
    //
    //     - *boolean* Whether the listener count have reach the cap
    //
    function addListener(name, listener, context) {

        if (! Arsenal.isFunction(listener)) {
            return false;
        }

        var listeners = this._listeners[name];

        if (listeners &&
            this._max > 0 &&
            listeners.length >= this._max) {

            return false;
        }

        if (Arsenal.isArray(listeners)) {
            /* Check for duplication */
            var index = listeners.indexOf(listener);

            if (index === -1) {
                this._listeners[name].push(listener);
                this._contexts[name].push(context);
            }

        } else {
            this._listeners[name] = [ listener ];
            this._contexts[name] = [ context ];
        }

        return true;

    }

    // * **event.addListenerOnce(name, listener, [context])**
    // * **event.once(name, listener, [context])**
    //
    //     Add a listener on the specific event for only once
    //
    //     Parameters:
    //
    //     - `name` *string* Event name to listen to
    //
    //     - `listener` *function* Listener function
    //
    //     - `context` *object* Optional, the context object of the listener function to be called in
    //
    //     Returns:
    //
    //     - *boolean* Whether the listener count have reach the cap
    //
    function addListenerOnce(name, listener, context) {

        if (this.addListener(name, listener, context)) {
            this._removals.push(listener);
            return true;
        }

        return false;

    }

    // * **event.removeListener(name, [listener])**
    // * **event.off(name, [listener])**
    //
    //     Remove one/all listener off the specific event
    //
    //     Parameters:
    //
    //     - `name` *string* Event name to listen to
    //
    //     - `listener` *function* Listener function, omit to remove all event listeners
    //
    function removeListener(name, listener) {

        var listeners = this._listeners[name],
            index;

        /* Remove multi/all listeners */
        if (Arsenal.isUndefined(listener)) {
            if (name) {
                delete this._listeners[name];
                delete this._contexts[name];

                for (var i = 0; i < listeners.length; i++) {
                    index = this._removals.indexOf(listeners[i]);

                    if (index !== -1) {
                        this._removals.splice(index, 1);
                    }
                }

            } else {
                this._listeners = {};
                this._contexts = {};
                this._removals = [];
            }

        /* Remove one listener */
        } else if (Arsenal.isArray(listeners)) {
            /* Check for existance */
            index = listeners.indexOf(listener);

            if (index !== -1) {
                this._listeners[name].splice(index, 1);
                this._contexts[name].splice(index, 1);
            }

            index = this._removals.indexOf(listener);

            if (index !== -1) {
                this._removals.splice(index, 1);
            }
        }

    }

    // * **event.dispatchSync(name, [arg1], [arg2], [...])**
    // * **event.dispatch(name, [arg1], [arg2], [...])**
    //
    //     Dispatch event to listeners, synchronously
    //
    //     Multi arguments acceptable
    //
    //     This function will iterate into all event listeners until one returns false
    //
    //     Parameters:
    //
    //     - `name` *string* Name of the event to dispatch to
    //
    //     - `arg1, arg2, ...` *ANY* Optional, arguments pass to the event listeners
    //
    function dispatchSync(name) {

        var listeners = this._listeners[name],
            args = Array.prototype.slice.call(arguments);

        if (Arsenal.isArray(listeners)) {
            listeners.some(function (e, i) {
                var context = this._contexts[name][i];

                if (e && this._removals.indexOf(e) !== -1) {
                    this.removeListener(name, e);
                }

                if (e.apply(context, args.slice(1)) ===
                    this.DISPATCH_STOP) {

                    return true;

                } else {
                    return false;
                }
            }, this);
        }

    }

    // * **event.dispatchAsync(name, [arg1], [arg2], [...])**
    // * **event.emit(name, [arg1], [arg2], [...])**
    //
    //     Dispatch event to listeners, synchronously
    //
    //     Multi arguments acceptable
    //
    //     This function will iterate into all event listeners, without stopping
    //
    //     Parameters:
    //
    //     - `name` *string* Name of the event to dispatch to
    //
    //     - `arg1, arg2, ...` *ANY* Optional, arguments pass to the event listeners
    //
    function dispatchAsync(name) {

        var listeners = this._listeners[name],
            args = Array.prototype.slice.call(arguments);

        if (Arsenal.isArray(listeners)) {
            listeners.forEach(function (e, i) {
                var context = this._contexts[name][i];

                Arsenal.async(function () {
                    e.apply(context, args.slice(1));
                });
            }, this);
        }

    }

    // * **event.setMaxListeners(number)**
    // * **event.limit(number)**
    //
    //     Set maximum number of listeners per event
    //
    //     Set to zero for unlimited
    //
    //     Parameters:
    //
    //     - `number` *number* Max number of listeners per event
    //
    function setMaxListeners(number) {

        if (Arsenal.isNumber(number) && number >= 0) {
            this._max = number;
        }

    }

    // **Primary functions**
    Event.prototype.getListeners = getListeners;
    Event.prototype.addListener = addListener;
    Event.prototype.addListenerOnce = addListenerOnce;
    Event.prototype.removeListener = removeListener;
    Event.prototype.removeAllListeners = removeListener;
    Event.prototype.dispatchSync = dispatchSync;
    Event.prototype.dispatchAsync = dispatchAsync;
    Event.prototype.setMaxListeners = setMaxListeners;

    // **Accessibility functions**
    Event.prototype.listeners = getListeners;
    Event.prototype.on = addListener;
    Event.prototype.once = addListenerOnce;
    Event.prototype.off = removeListener;
    Event.prototype.dispatch = dispatchSync;
    Event.prototype.emit = dispatchSync;
    Event.prototype.emitAsync = dispatchAsync;
    Event.prototype.limit = setMaxListeners;

    /* Export the Event mechanism */
    Arsenal.Event = Event;
    return Event;

})(this);
