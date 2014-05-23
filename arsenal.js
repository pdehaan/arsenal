// # Arsenal
//
// **Version 1.4.0**
//
// A collection of various useful mechanisms for javascript applications.
//
//
// ## Summary
//
// * **Binding** A mechanism implements the Data Binding.
//
// * **Event** The implementation of the well-known *Event* mechanism.
//
// * **Functional** For improving the programming style of asynchronous, mainly in node.js, In a functional style.
//
// * **Grid** Implementation of the two-dimensional grid flow algorithm.
//
// * **Hatch** Proxy callbacks for asynchronous functions.
//
// * **Sequence** Run functions and callbacks in sequence.
//
// * **Throttle** Limit the specific procedure to be run in a certain frequency.
//
// * **Trigger** Invokes a specified function when all the given conditions were satisfied.
//
// * **Pipeline** (Deprecated) A functional pipeline mechanism, by utilizing the Event and Functional mechanisms.
//
// * **Impulse** (Deprecated) A data-driven mechanism base on Binding and Trigger mechanisms.
//
//
// ## Installation
//
// ```bash
// npm install arsenal
// ```
//
// * for nodejs:
//
// ```javascript
// var Arsenal = require('arsenal');
// ```
//
// * for browsers:
//
// ```javascript
// <script type='text/javascript' src='arsenal.js'></script>
// ```
//
// * for browsers in production:
//
// ```javascript
// <script type='text/javascript' src='arsenal.min.js'></script>
// ```
//
//
// ## Customization
//
// Use the `build.js` script for your customization.
//
//     Usage: node build MECHANISM1 [MECHANISM2 ...] [OPTIONS]
//
//     Options:
//       -m, --minify   Whether to minify the output file              [default: false]
//       -o, --output   Set path to the output file
//                                [default: '/source/lab/osp/arsenal/build/arsenal.js']
//       -q, --quiet    Do not print any messages.                     [default: false]
//       -h, --help     Show this help message and exit.
//       -V, --version  Print version number and exit.
//
// Build only with some mechanisms, just pass the mechanism names to the script:
//
// ```bash
// node build event functional
// ```
//
// To build all mechanisms, just pass `all` as the mechanism name:
//
// ```bash
// node build all
// ```
//
// By default, the result file is place in the `build/` directory, you can designate yours with `-o FILE` option:
//
// ```bash
// node build all -o /path/to/your/output/file.js
// ```
//
// The build script ships with the minification via UglifyJS, to minify the result file, use `-m` option:
//
// ```bash
// node build all -m
// ```
//
//
// ## Browser Compatibility
//
// For old browsers have no supports for javascript 1.8.5,
// e.g. IE series below IE9.
// use `iesucks` or other js1.8 shives:
//
// ```javascript
// <script type='text/javascript' src='iesucks.min.js'></script>
// <script type='text/javascript' src='arsenal.min.js'></script>
// ```
//
// Hint: Use `test/index.html` to check for the compatibility of your browser.
//

/******************************************************************************

  Arsenal

  https://github.com/DJ-NotYet/arsenal

  Copyright (c) 2012-2014, DJ-NotYet <dj.notyet@gmail.com>

  Licensed under the Apache License, Version 2.0 (the 'License');
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an 'AS IS' BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

  THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

 *****************************************************************************/

(function (root) {

    /* Version tag */
    var _VERSION_ = '1.4.0';

    /* Initialize context */
    var Arsenal = {},
        previousArsenal = root.Arsenal;

    /* Version info */
    Arsenal.version = _VERSION_;

    /* Whether running in node.js or browsers */
    Arsenal.inNode = (
        typeof process === 'object' &&
        process.version &&
        typeof require === 'object' &&
        typeof module === 'object' &&
        require.main === module
    );
    /* Compatibility */
    Arsenal.node = Arsenal.inNode;

    /* Export the Arsenal object for node.js and/or browsers */
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Arsenal;

        } else {
            exports.Arsenal = Arsenal;
        }

    } else {
        root.Arsenal = Arsenal;
        Arsenal.noConflict = function () {
            root.Arsenal = previousArsenal;
            return Arsenal;
        };
    }


// ## Functions
//

    Arsenal.isBoolean = function (value) {
        return typeof value === 'boolean';
    };

    Arsenal.isNumber = function (value) {
        return typeof value === 'number' && isFinite(value);
    };

    Arsenal.isString = function (value) {
        return typeof value === 'string';
    };

    Arsenal.isArray = function (value) {
        return typeof value === 'object' && value instanceof Array;
    };

    Arsenal.isDate = function (value) {
        return typeof value === 'object' && value instanceof Date;
    };

    Arsenal.isRegExp = function (value) {
        return typeof value === 'object' && value instanceof RegExp;
    };

    Arsenal.isFunction = function (value) {
        return typeof value === 'function';
    };

    Arsenal.isHash = function (value) {
        return value && typeof value === 'object' &&
            value.constructor === Object.prototype.constructor;
    };

    Arsenal.isObject = function (value) {
        return value === Object(value);
    };

    Arsenal.isNull = function (value) {
        return value === null;
    };

    Arsenal.isUndefined = function (value) {
        return typeof value === 'undefined';
    };

    Arsenal.isDefined = function (value) {
        return typeof value !== 'undefined';
    };

    Arsenal.isNumericString = function (value) {
        return (/^-?[0-9]+[0-9\.]*$/.test(value));
    };

    Arsenal.getKeys = function (object) {
        var keys = [], property;
        for (property in object) {
            keys.push(property);
        }
        return keys;
    };

    Arsenal.getValues = function (object) {
        var values = [], property;
        for (property in object) {
            values.push(object[property]);
        }
        return values;
    };

    Arsenal.extend = function (destination, source, recursive) {
        if (destination instanceof Array &&
            source instanceof Array) {
            for (var index = 0; index < source.length; index++) {
                if (recursive &&
                    typeof destination[index] === 'object' &&
                    typeof source[index] === 'object') {
                    Arsenal.extend(destination[index], source[index], recursive);
                } else {
                    destination[index] = source[index];
                }
            }
        } else {
            for (var property in source) {
                if (recursive &&
                    typeof destination[property] === 'object' &&
                    typeof source[property] === 'object') {
                    Arsenal.extend(destination[property], source[property], recursive);
                } else {
                    destination[property] = source[property];
                }
            }
        }
        return destination;
    };
/*
    Arsenal.equals = function (a, b) {
        if (Arsenal.isArray(a) && Arsenal.isArray(b)) {
            var result = true;
            for (var i = 0; i < a.length; i++) {
                result = result && Arsenal.equals(a[i], b[i]);
                if (! result) { return result; }
            }
            return result;
        } else if (Arsenal.isArray(a) || Arsenal.isArray(b)) {
            return false;
        } else if (Arsenal.isHash(a) && Arsenal.isHash(b)) {
            var result = true,
                checked = [],
                i, j;
            for (i in a) {
                result = result && Arsenal.equals(a[i], b[i]);
                if (! result) {
                    return result;
                }
                checked.push(i);
            }
            for (j in b) {
                result = result && (checked.indexOf(j) !== -1);
                if (! result) {
                    return result;
                }
            }
            return result;
        } else if (a === b) {
            return true;
        } else {
            return false;
        }
    };
*/
/*
    Arsenal.binarySearch = function (object, array, comparator) {
        var first = 0;
        var last = array.length - 1;
        while (first <= last) {
            var mid = (first + last) >> 1;
            var c = comparator(object, array[mid]);
            if (typeof c !== 'number') {
                return c;
            } else if (c > 0) {
                first = mid + 1;
            } else if (c < 0) {
                last = mid - 1;
            } else {
                return mid;
            }
        }
        // Return the nearest lesser index, '-1' means '0', '-2' means '1', etc.
        return -(first + 1);
    };
*/
    Arsenal.async = (Arsenal.inNode ?
        process.nextTick :
        function (func) {
            setTimeout(func, 0);
        }
    );


// ## Mechanisms
//

    (function () {

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



// ### Throttle Mechanism
//
// Stablity: **STABLE**
//
// Limit the specific procedure to be run in a certain frequency.
//
// The running frequency is measured by the running count in a time interval.
//
// When the running times of the procedure has reach the limit of the time interval,
// it will be deferred to next cycle.
//
(function (Arsenal) {

    // * **Constructor**
    //
    //     ```var throttle = new Arsenal.Throttle()```
    //
    function Throttle() {

        /* Worker function */
        this._worker = null;
        /* Context of the worker function */
        this._context = null;
        /* Precision of the threshold, in milliseconds */
        this._precision = 60000;
        /* Max running count of the worker per precision unit */
        this._threshold = 0;
        /* Arguments queue */
        this._queue = [];
        /* Timestamp of last running */
        this._timestamp = 0;
        /* Running count in current second */
        this._count = 0;
        /* Timeout handle of the queue process */
        this._handle = null;

    }

    // * **throttle.setupWorker(worker, [context])**
    // * **throttle.setup(worker, [context])**
    //
    //     Setup a function as the worker
    //
    //     Parameters:
    //
    //     - `worker` *function* The worker function to be throttled
    //
    //     - `context` *object* Optional, the invoke context of the worker function
    //
    function setupWorker(worker, context) {

        this._worker = worker;
        this._context = context;

    }

    // * **throttle.runWorker()**
    // * **throttle.run()**
    //
    //     Push the arguments to be called in the worker function
    //
    //     And trigger the process for trying to run the worker
    //
    function runWorker() {

        this._queue.push(Array.prototype.slice.call(arguments));
        this.process();

    }

    // * **throttle.setPrecision([precision])**
    // * **throttle.precision([precision])**
    //
    //     Get/set precision value of the threshold
    //
    //     Parameters:
    //
    //     - `pecision` *number* Optional, The time period the threshold be measured to
    //
    //     Returns:
    //
    //     - *number* Current precision value
    //
    function setPrecision(precision) {

        if (precision) {
            this._precision = precision >>> 0;
        }

        return this._precision;

    }

    // * **throttle.setThreshold([threshold])**
    // * **throttle.threshold([threshold])**
    //
    //     Get/set threshold value of the throttle
    //
    //     Parameters:
    //
    //     - `threshold` *number* Optional, The max running count of the worker per precision unit
    //
    //     Returns:
    //
    //     - *number* Current threshold value
    //
    function setThreshold(threshold) {

        if (Arsenal.isDefined(threshold)) {
            this._threshold = threshold >>> 0;
        }

        return this._threshold;

    }

    // * **throttle.check()**
    //
    //     Check if current status is below the threshold
    //
    //     Returns:
    //
    //     - *boolean* Whether the worker execution frequence is below the threshold
    //
    function check() {

        var timestamp = ((new Date()).getTime() / this._precision) >>> 0;

        if (this._timestamp < timestamp) {
            this._timestamp = timestamp;
            this._count = 0;

        } else if (this._timestamp === timestamp) {
            if (this._count >= this._threshold) {
                return false;
            }
        }

        this._count++;
        return true;
    }

    // * **throttle.process()**
    //
    //     Process the arguments queue, run with the worker function
    //
    function process() {

        clearTimeout(this._handle);

        if (! Arsenal.isFunction(this._worker)) {
            throw new Error('Worker function is null');
        }

        if (this.check()) {
            this._worker.apply(this._context, this._queue.shift());

            if (this._queue.length > 0) {
                Arsenal.async(this.process.bind(this));
            }

        } else {
            this._handle = setTimeout(this.process.bind(this), this._precision);
        }

    }

    // **Primary functions**
    Throttle.prototype.setupWorker = setupWorker;
    Throttle.prototype.runWorker = runWorker;
    Throttle.prototype.setPrecision = setPrecision;
    Throttle.prototype.setThreshold = setThreshold;
    Throttle.prototype.check = check;
    Throttle.prototype.process = process;

    // **Accessibility functions**
    Throttle.prototype.setup = setupWorker;
    Throttle.prototype.run = runWorker;
    Throttle.prototype.precision = setPrecision;
    Throttle.prototype.threshold = setThreshold;

    /* Export the Throttle mechanism */
    Arsenal.Throttle = Throttle;
    return Throttle;

})(this);



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



// ### Grid Mechanism
//
// Stablity: **STABLE**
//
// Implementation of the two-dimensional grid flow algorithm.
// For resolving the difficulty of programming in the asynchronous node.js.
//
// A grid consist of two dimension: the x and y axis.
// The grid runs through the x axis synchronously, and handles the elements asynchronously in the y axis.
// When all the elements in the y axis is handled, the grid will move to next line in x axis and go on.
//
// Elements in the grid can be any type, even function (function will be called).
//
//
(function (Arsenal) {

    // * **Constructor**
    //
    //     ```var grid = new Arsenal.Grid()```
    //
    function Grid() {

        /* two-dimensional dynamic grid */
        this._grid = [[]];
        /* always point to the last line of the grid */
        this._x = 0;
        /* completed elements count of current line */
        this._y = 0;

        /* default handler */
        this._handler = function (element, next) {
            if (Arsenal.isFunction(element)) { element(); }
            if (Arsenal.isFunction(next)) { next(); }
        };

    }

    // * **grid.addElements(element1, [element2], [...])**
    // * **grid.add(element1, [element2], [...])**
    //
    //     Add element(s) to current line (as y axis)
    //
    //     Parameters:
    //
    //     - `element1, element2, ...` *ANY* Elements to be processed, multi elements will be queued in one line
    //
    function addElements() {

        if (arguments.length === 0) {
            return;
        }

        this._grid[this._x] = this._grid[this._x].concat(Array.prototype.slice.call(arguments));

    }

    // * **grid.pushElements(element1, [element2], [...])**
    // * **grid.push(element1, [element2], [...])**
    //
    //     Shift cursor to next line (as x axis), and push the element(s) to the new line
    //
    //     Parameters:
    //
    //     - `element1, element2, ...` *ANY* Elements to be processed, multi elements will be queued in one line
    //
    function pushElements() {

        this._grid[++this._x] = [];

        this.add.apply(this, arguments);

    }

    // * **grid.getCurrentProgress()**
    // * **grid.count()**
    //
    //     Get processed elements count of current line
    //
    //     Returns:
    //
    //     - *number* Processed elements count of current line
    //
    function getCurrentProgress() {

        return this._grid[0].length;

    }

    // * **grid.setupHandler(handler)**
    // * **grid.setup(handler)**
    //
    //     Use the provided function for running handler
    //
    //     The handler function accepts two parameters:
    //
    //     * function (element, next)
    //
    //     The first param is the element which pushed to the grid previously
    //
    //     The second param is the callback function use to mark the current element has been done
    //     or *false* value when no elements left in the grid
    //
    //     Return value is no needed
    //
    //     Handler will be called asynchonously
    //
    //     Parameters:
    //
    //     - `handler` *function* Handler function for processing the grid elements
    //
    function setupHandler(handler) {

        if (Arsenal.isFunction(handler)) {
            this._handler = handler;
        }

    }

    // * **grid.runGrid([handler])**
    // * **grid.run([handler])**
    //
    //     Run through the grid with the handler function provided
    //
    //     Also sets current handler to the provided one
    //
    //     Parameters:
    //
    //     - `handler` *function* Optional, handler function for processing the grid elements
    //
    function runGrid(handler) {

        /* Empty bucket */
        if (! this._grid[0]) {
            /* Empty grid */
            if (this._grid.length === 0) {
                this._handler(undefined, false);
            }

            return;
        }

        /* Skip when already running */
        if (this._y > 0) {
            return;
        }

        /* Update handler */
        if (Arsenal.isFunction(handler)) {
            this._handler = handler;
        }

        /* Start handling grid elements */
        if (this._grid[0].length > 0) {
            if (Arsenal.isFunction(this._handler)) {
                var line = this._grid[0];

                for (var i = 0; i < line.length; i++) {
                    Arsenal.async(this._handler.bind(this, line[i], this.done.bind(this)));
                }
            }

        } else {
            this.next();
        }

    }

    // * **grid.done([number])**
    //
    //     Mark *number* of functions (on current line) as done
    //
    //     If the count of current line is reach the cap,
    //     then the grid will automatically move to the next line and reset the count
    //
    //     Parameters:
    //
    //     - `number` *number* Optional, number of elements to be marked as done, defaults to 1
    //
    function done(number) {

        if (! Arsenal.isNumber(number) || ! number) {
            number = 1;
        }

        this._y += number;

        if (this._y >= this._grid[0].length) {
            this.next();
        }

    }

    // * **grid.next()**
    //
    //     Shift to next line, reset the cursor, and continue on
    //
    function next() {

        this._x--;
        this._y = 0;
        this._grid.shift();

        Arsenal.async(this.runGrid.bind(this));

    }

    // **Primary functions**
    Grid.prototype.addElements = addElements;
    Grid.prototype.pushElements = pushElements;
    Grid.prototype.getCurrentProgress = getCurrentProgress;
    Grid.prototype.setupHandler = setupHandler;
    Grid.prototype.runGrid = runGrid;
    Grid.prototype.done = done;
    Grid.prototype.next = next;

    // **Accessibility functions**
    Grid.prototype.add = addElements;
    Grid.prototype.push = pushElements;
    Grid.prototype.count = getCurrentProgress;
    Grid.prototype.setup = setupHandler;
    Grid.prototype.run = runGrid;

    /* Export the Grid mechanism */
    Arsenal.Grid = Grid;
    return Grid;

})(this);



// ### Functional Mechanism
//
// Stablity: **STABLE**
//
// The Functional mechanism is used for improving the programming style of asynchronous, mainly in node.js.
//
// Inspired by the functional programming, the Functional mechanism has the following features:
//
// * Whenever a callable value is returned, it will be invoked and return
//
// * All registered functions will be invoked in a consistent context (the `this` context)
//
// * Function returns with `F('name')` will return a callable value, with current context attached
//
// * If the callback function is set, it will be invoked whenever a function returns a non-callable value (except undefined)
//
// The Functional mechanism has only one interface:
//
// `F(name, args, context, callback)`
//
// Registers a function by:
//
// `F('name', function () { ... });`
//
// Get/return a function with consistent context:
//
// * `F('name');`
// (name can be any context in string)
//
// * `F('name', [ arg1, arg2 ]);`
// (args must be an array)
//
// * `F('name', null, { contextVar: 'value' });`
// (function context will be replaced totally)
//
// * `F('name', null, function (retval) { /* callback */ });`
// (the context of the callback function is individual)
//
// The return value above can also be called directly:
//
// `F('name')(arg1, arg2);`
//
// or:
//
// `F('name', null, callback)(arg1, arg2);`
//
// **NOTICE: The content of the name cannot be pure numbers.**
// (This issure is difficult to fix, maybe a future version would make it)
//
(function (Arsenal) {

    // * **Constructor**
    //
    //     ```var F = new Arsenal.Functional(hook)```
    //
    //     About hook:
    //
    //     A hook function accepts three parameters,
    //     and MUST always returns the third param *result*, e.g.
    //
    //         function (err, snapshot, result) { return result; }
    //
    //     The hook function will be called when the named function
    //     is found and executed or not been found (then err is not null)
    //
    //     The argument *snapshot* contains the following elements:
    //
    //     ```
    //         snapshot = {
    //             name: '',  // String, name of the function to be called
    //             args: [],  // Array, arguments ready to pass to the function
    //             context: {},  // Object, the invoke context of the function
    //             callback: R,  // Function, the callback after current execution
    //             presented: false,  // Boolean, whether the required function exists
    //             nested: false  // Boolean, whether the R function is created as
    //                             // the return value of current function
    //         }
    //     ```
    //
    function Functional(hook) {

        /* Closure variables */
        var _functions = {},  /* function list */
            _instance = null,  /* the most recent created R instance */
            _creation = null,  /* the last created snapshot */
            _snapshot = {  /* snapshot content */
                name: '',
                args: [],
                context: {},
                callback: null,
                presented: false,
                nested: false
            };

        // Patterns:
        //
        // - new F({...});
        //
        // - F('name', function (...) { ... });
        //
        // - F('name');
        //
        // - F('name', [ arg1, arg2, ... ]);
        //
        // - F('name', [ arg1, arg2, ... ], { ... });
        //
        // - F('name', [ arg1, arg2, ... ], { ... }, function (result) { ... });
        //
        // - F('name', [ arg1, arg2, ... ], function (result) { ... });
        //
        // - F();
        //
        function F(name, args, context, callback) {

            if (Arsenal.isString(name)) {
                /* F('name', function (...) { ... }); */
                if (Arsenal.isFunction(args)) {
                    _functions[name] = args;

                /* F('name'); */
                /* F('name', [ arg1, arg2, ... ]); */
                /* F('name', [ arg1, arg2, ... ], { ... }); */
                /* F('name', [ arg1, arg2, ... ], { ... }, function (result) { ... }); */
                /* F('name', [ arg1, arg2, ... ], function (result) { ... }); */
                } else {
                    _creation = {
                        name: name,
                        args: (Arsenal.isArray(args) ? args : []),
                        context: (Arsenal.isHash(context) ? context : _snapshot.context),
                        callback: (Arsenal.isFunction(callback) ? callback
                            : (Arsenal.isFunction(context) ? context : null)
                        ),
                        presented: Arsenal.isFunction(_functions[name]),
                        nested: false
                    };

                    return new R(_creation);
                }

            /* F(); */
            } else {
                return _functions;
            }

        }

        // Patterns:
        //
        // - `new R(creation);`
        //
        // - `R(arg1, arg2, ...);`
        //
        function R() {

            /* new R(creation); */
            if (this instanceof R) {
                _instance = R.bind(arguments[0]);

                return _instance;

            /* R(arg1, arg2, ...); */
            } else {
                var result;

                _snapshot.name = this.name;
                _snapshot.args = this.args;
                _snapshot.context = this.context;
                _snapshot.callback = this.callback;
                _snapshot.presented = this.presented;
                _snapshot.nested = this.nested;

                /* Prefer preset arguments than the later */
                if (_snapshot.args.length === 0) {
                    _snapshot.args = Array.prototype.slice.call(arguments);
                }

                /* Execute wrapped function */
                if (Arsenal.isFunction(_functions[_snapshot.name])) {
                    result = _functions[_snapshot.name].apply(_snapshot.context, _snapshot.args);

                /* Forward to the hook if available */
                } else if (Arsenal.isFunction(hook)) {
                    return hook(new ReferenceError('No such function: ' + _snapshot.name), _snapshot);

                /* Throw exception */
                } else {
                    throw new Error('No such function: ' + _snapshot.name);
                }

                /* Continue nested execution */
                if (result === _instance) {
                    _creation.nested = true;

                    /* Attach last callback for invocation consistance */
                    if (! Arsenal.isFunction(_creation.callback) &&
                        Arsenal.isFunction(_snapshot.callback)) {

                        _creation.callback = _snapshot.callback;
                    }

                    result = new R(_creation);
                }

                /* Invoke the callable result */
                if (Arsenal.isFunction(result)) {
                    /* Non-sequential invocation only supports in node.js */
                    if (Arsenal.inNode) {
                        Arsenal.async(result);

                    } else {
                        return result();
                    }

                /* Check for the ending */
                } else if (Arsenal.isDefined(result)) {
                    /* Invoke callback function if available */
                    if (Arsenal.isFunction(_snapshot.callback)) {
                        _snapshot.callback(result);
                    }

                    /* Pass to the hook if provided */
                    if (Arsenal.isFunction(hook)) {
                        hook(null, _snapshot, result);
                    }

                    return result;
                }
            }

        }

        return F.bind({});

    }

    /* Export the Functional mechanism */
    Arsenal.Functional = Functional;
    return Functional;

})(this);



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



// ### Binding Mechanism
//
// Stablity: **STABLE**
//
// Bind handlers or properties to a specific data-node.
//
// Data changes will feed back to binded handlers (be invoked with) or properties.
//
(function (Arsenal) {

    // * **Constructor**
    //
    //     ```var binding = new Arsenal.Binding()```
    //
    //     ```var binding = new Arsenal.Binding(data)```
    //
    function Binding(data) {

        /* Source data */
        this._data = {};
        /* Bindings map */
        this._bindings = {};

        /* Initialize the whole source data */
        if (data) {
            this.updateSource(null, data);
        }

    }

    // * **binding.bindTarget(path, handler)**
    // * **binding.bind(path, handler)**
    //
    //     Bind a handler or property to the specific data-node
    //
    //     Parameters:
    //
    //     - `path` *string* Path to the data-node to be binded to
    //
    //     - `handler` *ANY* Can be one of the following values:
    //
    //         + *function* Handler function, as:
    //
    //             `function (value, key, handler, former)`
    //
    //             - `value` *ANY* The updated new data of the node
    //
    //             - `key` *number|string* Key name in the parent node
    //
    //             - `handler` *ANY* The DSN handler structure (see function `updateSource`)
    //
    //             - `former` *ANY* The former old data of the node
    //
    //             - `path` *string* Path to the node
    //
    //         + *Array* An array consist of [ object, key ]
    //
    //         + *string* Path to the data-node
    //
    function bindTarget(path, handler) {

        if (! path) { path = ''; }

        if (! Arsenal.isArray(this._bindings[path])) {
            this._bindings[path] = [ handler ];

        } else {
            this._bindings[path].push(handler);
        }

    }

    // * **binding.unbindTarget(path, handler)**
    // * **binding.unbind(path, handler)**
    //
    //     Unbind a handler or property from the specific data-node
    //
    //     Parameters:
    //
    //     - `path` *string* Path to the data-node to be unbinded from
    //
    //     - `handler` *ANY* Can be one of the following values:
    //
    //         + *function* Handler function, must be exactly the one binded
    //
    //         + *Array* An array consist of [ object, key ]
    //
    //         + *string* Path to the data-node
    //
    function unbindTarget(path, handler) {

        if (! path) { path = ''; }

        if (Arsenal.isArray(this._bindings[path])) {
            var index = this._bindings[path].indexOf(handler);

            if (index !== -1) {
                this._bindings[path].splice(index, 1);
            }
        }

    }

    // * **binding.clearBindings(path)**
    // * **binding.clear(path)**
    //
    //     Clear the binded handlers or properties to the specific data-node
    //
    //     Parameters:
    //
    //     - `path` *string* Optional, path to the data-node, omit to clear all the bindings
    //
    function clearBindings(path) {

        if (! path) { path = ''; }

        if (Arsenal.isDefined(path)) {
            delete this._bindings[path];

        } else {
            for (var i in this._bindings) {
                delete this._bindings[i];
            }
        }

    }

    // * **binding.getData(path, value)**
    // * **binding.get(path, value)**
    //
    //     Get node value by path
    //
    //     Parameters:
    //
    //     - `path` *string* Path to the data-node
    //
    //     Returns:
    //
    //     - *ANY* Node value
    //
    function getData(path) {

        if (path && Arsenal.isString(path)) {
            var re = /[^\.\[\]]+/g,
                matches, index, key, cursor, peek;

            while ((matches = re.exec(path)) !== null) {
                index = matches.index;
                key = matches[0];
                cursor = peek || this._data;
                peek = cursor[key];

                if (Arsenal.isUndefined(peek)) {
                    return undefined;
                }
            }

            /* Return the node data */
            return peek;

        } else {
            return this._data;
        }

    }

    // * **binding.updateSource(path, value, func)**
    // * **binding.update(path, value, func)**
    //
    //     Update the specific data-node with the value
    //
    //     The binded handler will be called with the data-node as the first parameter
    //
    //     The binded properties will be set with the data-node
    //
    //     Parent paths of the binded node, act as bubble-like event,
    //     which processes from current node to the root level,
    //     passing node data with the corresponding path as the parameter
    //
    //     Parameters:
    //
    //     - `path` *string* Path to the data-node to be updated
    //
    //     - `value` *ANY* The value for the data-node
    //
    //     - `modifier` *string|function|Array* Optional, a custom modifier for updating the specific data-node with the value,
    //       different type of modifier have individual function:
    //
    //         + *number* The indicator part of the Data-Synchronize-Notation (see after),
    //           using the value from arguments as the value part, for synchronizing array data-node,
    //           (undefined value for removing the element)
    //
    //         + *string* The indicator part of the Data-Synchronize-Notation (see after),
    //           using the value from arguments as the value part, for synchronizing object data-node,
    //           (undefined value for removing the element)
    //
    //         + *Array* An array represent as a Data-Synchronize-Notation (see after),
    //           using the second element in the array as the value part, and ignoring the former one from arguments,
    //           (undefined value for setting undefined to the element)
    //
    //         + *function* Custom modifier, the modifier recevies the data-node and the value as its paramters,
    //           return value of the modifier function will replace the data-node, as:
    //
    //             node = modifier(node, value);
    //
    //         Notice: paths use wildcard leaves do not receive elemental events (only the parent node does).
    //
    //     Returns:
    //
    //         - *ANY* Old value of the data-node before updating
    //
    //     About Data-Synchronize-Notation:
    //
    //     The Data-Synchronize-Notation (abbrev as DSN) is a conventional notation for representing partially data modification,
    //     usually use for synchronizing and updating data between distributed/cluster data repositories.
    //
    //     In Javascript, the DSN is an array consist of one or two elements, for modifying objects and arrays.
    //     For illustration, we assume that variable `source` is going to be updated with variable `value`.
    //
    //     The first element in the DSN array is the *indicator*.
    //     The optional second element is the *value* to be updated with.
    //     As:
    //
    //         [ indicator, value ]
    //
    //     + If the `source` is an *Array*, the `indicator` must be a *number*:
    //
    //         - When the `value` is present, and indicator >= 0, update item as: `source[indicator] = value;`
    //
    //         - When the `value` is present, and indicator < 0, insert item as: `source.splice(- indicator - 1, 0, value);`
    //
    //         - When the `value` is present, and indicator is null (must equals to *null*), append item as: `source.push(value);`
    //
    //         - When the `value` is not present (only `indicator` in DSN array), remove item as: `source.splice(indicator, 1);`
    //
    //     + If the `source` is an *Object*, the `indicator` must be a *string*:
    //
    //         - When the `value` is present, set item as: `source[indicator] = value;`
    //
    //         - When the `value` is not present (only `indicator` in DSN array), unset item as: `delete source[indicator];`
    //
    function updateSource(path, value, modifier) {

        if (path && Arsenal.isString(path)) {
            var re = /[^\.\[\]]+/g,
                hashSplit = '.',
                arrayFront = '[',
                arrayBack = ']',
                wildcard = '*',
                matches = null,
                index, key, prev, cursor, peek, former,
                nodeTag, nodeBack,
                bubbles = [], leaves = [], branches = [],
                targets, i, j;

            /* Add root path to the top of bubbles */
            bubbles.unshift([ '', this._data, '' ]);

            while ((matches = re.exec(path)) !== null) {
                index = matches.index;
                prev = key;
                key = matches[0];
                cursor = peek || this._data;

                if (key === wildcard) {
                    if (Arsenal.isArray(cursor)) {
                        for (i = 0; i < cursor.length; i++) {
                            this.updateSource(path.substr(0, index) + String(i) + path.substr(index + key.length), value, modifier);
                        }

                    } else if (Arsenal.isHash(cursor)) {
                        for (i in cursor) {
                            this.updateSource(path.substr(0, index) + String(i) + path.substr(index + key.length), value, modifier);
                        }
                    }

                    return cursor[key];
                }

                peek = cursor[key];
                former = cursor[key];

                if (! Arsenal.isHash(peek) && ! Arsenal.isArray(peek)) {
                    if (index < path.length - 1 &&
                        path.charAt(index + key.length) === arrayFront) {

                        cursor[key] = [];

                    } else {
                        cursor[key] = {};
                    }

                    peek = cursor[key];
                }

                leaves = [];

                if (Arsenal.isArray(cursor)) {
                    var nodeTag = arrayFront + key + arrayBack,
                        nodeBack = arrayBack;

                    key = +key;

                } else if (Arsenal.isHash(cursor)) {
                    var nodeTag = hashSplit + key,
                        nodeBack = '';
                }

                for (i = 0; i < branches.length; i++) {
                    branches[i][0] += nodeTag;
                    bubbles.push([
                        branches[i][0],
                        peek,
                        branches[i][1]
                    ]);
                    leaves.push(bubbles.length - 1);
                }

                branches.push([
                    path.substr(0, index) + wildcard + nodeBack,
                    key
                ]);

                bubbles.push([
                    path.substr(0, index) + wildcard + nodeBack,
                    peek,
                    key
                ]);
                bubbles.push([
                    path.substr(0, index) + key + nodeBack,
                    peek,
                    key
                ]);

                leaves.push(bubbles.length - 2);
                leaves.push(bubbles.length - 1);
            }

            /* Update data-node with DSN parameters */
            if (Arsenal.isNumber(modifier)) {
                if (Arsenal.isDefined(value)) {
                    if (modifier >= 0) {
                        cursor[key][modifier] = value;

                    } else {
                        cursor[key].splice(- modifier - 1, 0, value);
                    }

                } else {
                    cursor[key].splice(modifier, 1);
                }

            } else if (Arsenal.isNull(modifier)) {
                if (Arsenal.isDefined(value)) {
                    cursor[key].push(value);
                }

            } else if (Arsenal.isString(modifier)) {
                if (Arsenal.isDefined(value)) {
                    cursor[key][modifier] = value;

                } else {
                    delete cursor[key][modifier];
                }

            } else if (Arsenal.isArray(modifier)) {
                if (Arsenal.isArray(cursor[key])) {
                    if (Arsenal.isNumber(modifier[0])) {
                        if (modifier.length === 2) {
                            if (modifier[0] >= 0) {
                                cursor[key][modifier[0]] = modifier[1];

                            } else {
                                cursor[key].splice(- modifier[0] - 1, 0, modifier[1]);
                            }

                        } else if (modifier.length === 1) {
                            cursor[key].splice(modifier[0], 1);
                        }

                    } else if (Arsenal.isNull(modifier[0])) {
                        cursor[key].push(modifier[1]);
                    }

                } else if (Arsenal.isObject(cursor[key])) {
                    if (modifier.length === 2) {
                        cursor[key][modifier[0]] = modifier[1];

                    } else {
                        delete cursor[key][modifier[0]];
                    }
                }

            /* Update data-node with custom modifier */
            } else if (Arsenal.isFunction(modifier)) {
                cursor[key] = modifier(cursor[key], value);

            /* Update data-node normally */
            } else {
                cursor[key] = value;
            }

            /* Update value of the leaf nodes in the bubbles */
            for (i = 0; i < leaves.length; i++) {
                bubbles[leaves[i]][1] = cursor[key];
            }

            /* Transmit to the binded targets */
            for (i = bubbles.length - 1; i >= 0; i--) {
                targets = this._bindings[bubbles[i][0]];

                if (Arsenal.isArray(targets)) {
                    for (j = 0; j < targets.length; j++) {
                        if (Arsenal.isFunction(targets[j])) {
                            targets[j].call(null, bubbles[i][1], bubbles[i][2], modifier, former, path);

                        } else if (Arsenal.isArray(targets[j])) {
                            targets[j][0][targets[j][1]] = bubbles[i][1];

                        } else if (Arsenal.isString(targets[j])) {
                            this.updateSource(targets[j], bubbles[i][1]);
                        }
                    }
                }
            }

            return former;

        } else {
            var former = this._data,
                targets = this._bindings[''];

            this._data = value;

            if (Arsenal.isArray(targets)) {
                for (var i = 0; i < targets.length; i++) {
                    if (Arsenal.isFunction(targets[i])) {
                        targets[i].call(null, value, '', modifier, former, path);

                    } else if (Arsenal.isArray(targets[i])) {
                        targets[i][0][targets[i][1]] = value;

                    } else if (Arsenal.isString(targets[i])) {
                        this.updateSource(targets[i], value);
                    }
                }
            }

            return former;
        }

    }

    // **Primary functions**
    Binding.prototype.bindTarget = bindTarget;
    Binding.prototype.unbindTarget = unbindTarget;
    Binding.prototype.clearBindings = clearBindings;
    Binding.prototype.getData = getData;
    Binding.prototype.updateSource = updateSource;

    // **Accessibility functions**
    Binding.prototype.bind = bindTarget;
    Binding.prototype.unbind = unbindTarget;
    Binding.prototype.clear = clearBindings;
    Binding.prototype.get = getData;
    Binding.prototype.update = updateSource;

    /* Export the Binding mechanism */
    Arsenal.Binding = Binding;
    return Binding;

})(this);


    }).call(Arsenal);


}).call({}, this);
