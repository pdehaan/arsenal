// ### Sequence Mechanism
//
// Stablity: **UNSTABLE**
//
// Run functions and callbacks in sequence.
//
// The functions runs in serial order.
//
(function (Arsenal) {

    // * **Constructor**
    //
    //     ```var sequence = new Arsenal.Sequence()```
    //
    function Sequence() {

        /* Funciton sequence */
        this._functions = [];

        /* Function context */
        this._context = {
            push: this.pushFunction.bind(this),
            pop: this.popFunction.bind(this),
            shift: this.shiftFunction.bind(this),
            unshift: this.unshiftFunction.bind(this),
            count: this.countFunctions.bind(this),
            next: this.next.bind(this)
        };

        /* Execution index */
        this._index = 0;

    }

    // * **binding.pushFunction(func)**
    // * **binding.push(func)**
    //
    //     Push one or more functions at the end of the sequence
    //
    //     Parameters:
    //
    //     - `func` *function|Array* A function or an array of functions to be pushed into the sequence
    //
    function pushFunction(func) {

        if (Arsenal.isArray(func)) {
            Array.prototype.push.apply(this._functions, func);

        } else {
            this._functions.push(func);
        }

    }

    // * **binding.popFunction()**
    // * **binding.pop()**
    //
    //     Remove one function from the end of the sequence
    //
    //     Returns:
    //
    //     - *function* The function pop from the end of the sequence
    //
    function popFunction() {

        return this._functions.pop();

    }

    // * **binding.shiftFunction()**
    // * **binding.shift()**
    //
    //     Remove one function from the beginning of the sequence
    //
    //     Returns:
    //
    //     - *function* The function shift from the beginning of the sequence
    //
    function shiftFunction() {

        return this._functions.shift();

    }

    // * **binding.unshiftFunction(func)**
    // * **binding.unshift(func)**
    //
    //     Insert one or more functions at the beginning of the sequence
    //
    //     Parameters:
    //
    //     - `func` *function|Array* A function or an array of functions to be inserted into the sequence
    //
    function unshiftFunction(func) {

        if (Arsenal.isArray(func)) {
            Array.prototype.unshift.apply(this._functions, func);

        } else {
            this._functions.unshift(func);
        }

    }

    // * **binding.countFunctions()**
    // * **binding.count()**
    //
    //     Return the number of functions in the sequence
    //
    //     Returns:
    //
    //     - *number* The number of functions in the sequence
    //
    function countFunctions() {

        return this._functions.length;

    }

    // * **binding.setContext(obj)**
    // * **binding.context(obj)**
    //
    //     Set/get the context object of the sequence
    //
    //     Parameters:
    //
    //     - `obj` *object* Optional, the context object for the functions
    //
    //     Returns:
    //
    //     - *object* Current context object
    //
    function setContext(obj) {

        if (Arsenal.isObject(obj)) {
            this._context = obj;
            this._context.push = this.pushFunction.bind(this);
            this._context.pop = this.popFunction.bind(this);
            this._context.shift = this.shiftFunction.bind(this);
            this._context.unshift = this.unshiftFunction.bind(this);
            this._context.count = this.countFunctions.bind(this);
            this._context.next = this.next.bind(this);
        }

        return this._context;

    }

    // * **binding.next(func)**
    //
    //     Run to the next function
    //
    //     Can be used as a callback, which will pass directly to the next function
    //
    //     Parameters will forward to the next function
    //
    function next() {

        var index = ++this._index;

        if (index < this._functions.length) {
            var func = this._functions[index];

            return func.apply(this._context, arguments);
        }

    }

    // * **binding.run(func)**
    //
    //     Start running the sequence
    //
    //     Parameters will forward to the next function
    //
    function run() {

        this._index = -1;

        return this.next.apply(this, arguments);

    }

    // **Primary functions**
    Sequence.prototype.pushFunction = pushFunction;
    Sequence.prototype.popFunction = popFunction;
    Sequence.prototype.shiftFunction = shiftFunction;
    Sequence.prototype.unshiftFunction = unshiftFunction;
    Sequence.prototype.countFunctions = countFunctions;
    Sequence.prototype.setContext = setContext;
    Sequence.prototype.next = next;
    Sequence.prototype.run = run;

    // **Accessibility functions**
    Sequence.prototype.push = pushFunction;
    Sequence.prototype.pop = popFunction;
    Sequence.prototype.shift = shiftFunction;
    Sequence.prototype.unshift = unshiftFunction;
    Sequence.prototype.count = countFunctions;
    Sequence.prototype.context = setContext;

    /* Export the Sequence mechanism */
    Arsenal.Sequence = Sequence;
    return Sequence;

})(this);
