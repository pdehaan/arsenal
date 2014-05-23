// ### Trigger Mechanism
//
// Stablity: **STABLE**
//
// Invokes a specified function when all the given conditions were satisfied.
//
// The conditions will be checked through everytime the context changes.
// (includes adding, updating, removing)
//
(function (Arsenal) {

    // * **Constructor**
    //
    //     ```var trigger = new Arsenal.Trigger()```
    //
    function Trigger() {

        /* Context for conditions */
        this._context = {};
        /* Trigger conditions (functions) */
        this._conditions = [];
        /* The function to be trigged */
        this._callback = function () {};
        /* Context for the callback function */
        this._callbackContext = {};

    }

    // * **trigger.setCallback(callback, [context])**
    // * **trigger.hook(callback, [context])**
    //
    //     Set the callback function to be triggered
    //
    //     Parameters:
    //
    //     - `callback` *function* The callback function to be triggered
    //
    //     - `context` *object* Optional, The context the callback to be called in
    //
    function setCallback(callback, context) {

        if (Arsenal.isFunction(callback)) {
            this._callback = callback;
        }

        if (Arsenal.isObject(context)) {
            this._callbackContext = context;
        }

    }

    // * **trigger.addCondition(condition)**
    // * **trigger.watch(condition)**
    //
    //     Add a new condition
    //
    //     The condition is a function which will be executed in the *context* environment
    //     which preset by the *setCallback* function
    //
    //     NOTICE: this function activates the inspector procedure
    //
    //     Parameters:
    //
    //     - `condition` *string|function* The condition to be evaluated
    //
    //         + *string* Name of the context (inspector will check the value by the name)
    //
    //         + *function* Function to be invoked (inspector will check the return value of the function)
    //
    function addCondition(condition) {

        var conditions = this._conditions,
            index = conditions.indexOf(condition);

        /* Check for duplication */
        if (index === -1) {
            this._conditions.push(condition);
        }

        this.inspector();

    }

    // * **trigger.removeCondition(condition)**
    // * **trigger.neglect(condition)**
    //
    //     Remove the specified condition
    //
    //     NOTICE: this function activates the inspector procedure
    //
    //     Parameters:
    //
    //     - `condition` *string|function* The condition to be evaluated
    //
    //         + *string* Name of the context (inspector will check the value by the name)
    //
    //         + *function* Function to be invoked (inspector will check the return value of the function)
    //
    function removeCondition(condition) {

        var conditions = this._conditions,
            index = conditions.indexOf(condition);

        /* Check for existance */
        if (index !== -1) {
            this._conditions.splice(index, 1);
        }

        this.inspector();

    }

    // * **trigger.getContext(name)**
    // * **trigger.get(name)**
    //
    //     Get the condition context
    //
    //     Parameters:
    //
    //     - `name` *string* Name of the variable in the condition context
    //
    //     Returns:
    //
    //     - *ANY* Value of the context variable
    //
    function getContext(name) {

        return this._context[name];

    }

    // * **trigger.setContext(name)**
    // * **trigger.set(name)**
    //
    //     Change the condition context
    //
    //     NOTICE: this function activates the inspector procedure
    //
    //     Parameters:
    //
    //     - `name` *string* Name of the variable in the condition context
    //
    function setContext(name, value) {

        this._context[name] = value;
        this.inspector();

    }

    // * **trigger.unsetContext(name)**
    // * **trigger.unset(name)**
    //
    //     Unset condition context, one or all
    //
    //     NOTICE: this function activates the inspector procedure
    //
    //     Parameters:
    //
    //     - `name` *string* Name of the variable in the condition context
    //
    function unsetContext(name) {

        if (Arsenal.isUndefined(name)) {
            this._context = {};

        } else {
            delete this._context[name];
        }

        this.inspector();

    }

    // * **trigger.inspector()**
    //
    //     Inspection procedure
    //
    //     This will check all the conditions for trigging the callback
    //
    function inspector() {

        var conditions = this._conditions,
            semaphore = true;

        for (var i = 0; i < conditions.length; i++) {
            if (Arsenal.isString(conditions[i])) {
                semaphore = semaphore && !! this._context[conditions[i]];

            } else if (Arsenal.isFunction(conditions[i])) {
                semaphore = semaphore && !! conditions[i].call(this._context);
            }

            if (! semaphore) { return; }
        }

        if (semaphore) {
            this._callback.call(this._callbackContext);
        }

    }

    // **Primary functions**
    Trigger.prototype.setCallback = setCallback;
    Trigger.prototype.addCondition = addCondition;
    Trigger.prototype.removeCondition = removeCondition;
    Trigger.prototype.getContext = getContext;
    Trigger.prototype.setContext = setContext;
    Trigger.prototype.unsetContext = unsetContext;
    Trigger.prototype.inspector = inspector;

    // **Accessibility functions**
    Trigger.prototype.hook = setCallback;
    Trigger.prototype.watch = addCondition;
    Trigger.prototype.neglect = removeCondition;
    Trigger.prototype.get = getContext;
    Trigger.prototype.set = setContext;
    Trigger.prototype.unset = unsetContext;

    /* Export the Trigger mechanism */
    Arsenal.Trigger = Trigger;
    return Trigger;

})(this);
