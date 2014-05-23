Arsenal
=======

[![NPM version](https://badge.fury.io/js/arsenal.png)](https://badge.fury.io/js/arsenal)
[![Build status](https://secure.travis-ci.org/DJ-NotYet/arsenal.png?branch=master)](https://travis-ci.org/DJ-NotYet/arsenal)

A collection of various useful mechanisms for javascript applications.


Summary
-------

* **Binding** A mechanism implements the Data Binding mechanism.

* **Event** The implementation of the well-known *Event* mechanism.

* **Functional** For improving the programming style of asynchronous, as node.js, In a functional style.

* **Grid** Implementation of the two-dimensional grid flow algorithm.

* **Sequence** Run functions and callbacks in sequence.

* **Throttle** Limit the specific procedure to be run in a certain frequency.

* **Trigger** Invokes a specified function when all the given conditions were satisfied.

* **Impulse** (Deprecated) A data-driven mechanism base on Binding and Trigger mechanisms.

* **Pipeline** (Deprecated) A functional pipeline mechanism, by utilizing the Event and Functional mechanism.


Installation
------------

```bash
npm install arsenal
```

* for nodejs:

```javascript
var arsenal = require('arsenal');
```

* for browsers:

```javascript
<script type='text/javascript' src='arsenal.js'></script>
```

* for browsers in production:

```javascript
<script type='text/javascript' src='arsenal.min.js'></script>
```


Customization
-------------

Use the `build.js` script for your customization.

    Usage: node build MECHANISM1 [MECHANISM2 ...] [OPTIONS]

    Options:
      -m, --minify   Whether to minify the output file              [default: false]
      -o, --output   Set path to the output file
                                                       [default: 'build/arsenal.js']
      -q, --quiet    Do not print any messages.                     [default: false]
      -h, --help     Show this help message and exit.
      -V, --version  Print version number and exit.

Build only with some mechanisms, just pass the mechanism names to the script:

```bash
node build event functional
```

To build all mechanisms, just pass `all` as the mechanism name:

```bash
node build all
```

By default, the result file is place under current directory, you can designate yours with `-o FILE` option:

```bash
node build all -o /path/to/your/output/file.js
```

The build script ships with the minification via UglifyJS, to minify the result file, use `-m` option:

```bash
node build all -m
```


Browser Compatibility
---------------------

For old browsers have no supports for javascript 1.8.5,
e.g. IE series below IE9.
use `iesucks` or other js1.8 shives:

```javascript
<script type='text/javascript' src='iesucks.min.js'></script>
<script type='text/javascript' src='arsenal.min.js'></script>
```

Hint: Use `test/index.html` to check for the compatibility of your browser.


API Reference
-------------

Please refer to `docs/arsenal.html` for details.


Basic Mechanisms
----------------

### Binding mechanism

Stablity: **STABLE**

Bind handlers or properties to a specific data-node.

Data changes will feed back to binded handlers (be invoked with) or properties.

#### Example

```javascript
var Binding = require('arsenal.js').Binding,
    binding = new Binding();

var data = {
        a: 1,
        b: {
            x: 4,
            y: 5
        },
        c: [ 0 ]
    };

// First update the binding object with the data
// passing null as the first param to update to root level
binding.update(null, data);

// Bind to self value (synchronize inside the data)
binding.bind('a', 'c[3]');

// Bind a function to the specific node
binding.bind('b.x', function (value) {
    console.log('b.x value: ', value);
});
binding.bind('c[5]', function (value) {
    console.log('c[5] value: ', value);
});

// Bind with wildcard for object/array
binding.bind('b.*', function (value, key) {
    console.log('object wildcard: ', value, key);
});
binding.bind('c[*]', function (value, key) {
    console.log('array wildcard: ', value, key);
});

// Update values by data-path
binding.update('a', 2);
binding.update('b.x', 5);
binding.update('c[5]', 10);

// Or you can use .get() to retrieve data by path (null for all data)
console.log('a value: ', binding.get('a'));
console.log('b.x value:', binding.get('b.x'));
console.log('c[5] value: ', binding.get('c[5]'));
console.log('root data:', binding.get(null));
```

The output will be:

    array wildcard:  2 3
    b.x value:  5
    object wildcard:  5 x
    c[5] value:  10
    array wildcard:  10 5
    a value:  2
    b.x value: 5
    c[5] value:  10
    root data: { a: 2, b: { x: 5, y: 5 }, c: [ 0, , , 2, , 10 ] }

- - -

### Event mechanism

Stablity: **STABLE**

Implementation of the well-known *Event* mechanism.

Compatible to the events.EventEmitter in node.js.

#### Example

```javascript
var Event = require('arsenal').Event,
    event = new Event();

// Listen on event 'test1'
event.on('test1', function (arg1) {
    console.log('event1 emit with %s', arg1);
});

// Listen on event 'test2'
event.on('test2', function (arg1, arg2) {
    console.log('event2 emit with %s, %s', arg1, arg2);
});

// Dispatch event asynchronously
event.emitAsync('test1', 'data1');

// Dispatch event synchronously
event.emit('test2', 'data2', 1234);
```

The output will be:
(asynchronous emit was deferred)

    event2 emit with data2, 1234
    event1 emit with data1

- - -

### Functional mechanism

Stablity: **STABLE**

The Functional mechanism is used for improving the programming style of asynchronous, mainly in node.js.

Inspired by the functional programming, the Functional mechanism has the following features:

* Whenever a callable value is returned, it will be invoked and return

* All registered functions will be invoked in a consistent context (the `this` context)

* Function returns with `F('name')` will return a callable value, with current context attached

* If the callback function is set, it will be invoked whenever a function returns a non-callable value (except undefined)

The Functional mechanism has only one interface:

`F(name, args, context, callback)`

Registers a function with:

`F('name', function () { ... });`

Get/return a consistent function with:

* `F('name');`
(name can be any context in string)

* `F('name', [ arg1, arg2 ]);`
(args must be an array)

* `F('name', null, { contextVar: 'value' });`
(function context will be replaced totally)

* `F('name', null, function (retval) { /* callback */ });`
(the context of the callback function is individual)

The return value above can also be called directly:

`F('name')(arg1, arg2);`

or:

`F('name', null, callback)(arg1, arg2);`

**NOTICE: Characters of the name cannot be pure numbers.**
(This issue is difficult to fix, maybe a future version would make it)

#### Example.1 Basic demo

```javascript
var Functional = require('arsenal').Functional,
    F = new Functional();

// Register function #1
F('func1', function (arg1) {
    this.a = arg1;
    console.log('func1: %d', this.a);
    return F('func2');
});

// Register function #2
F('func2', function () {
    this.a++;
    console.log('func2: %d', this.a);
    return F('func3', [ this.a + 1, 2 ]);
});

// Register function #3
F('func3', function (arg1, arg2) {
    this.a += arg1 + arg2;
    console.log('func3: %d', this.a);
    return this.a;
});

// Define callback function
var done = function (result) {
    console.log('The result is %d', result);
};

// Run functions from the start
F('func1', null, done)(10);
// the same as:
//F('func1', [ 10 ], done)();
```

The output will be:

    func1: 10
    func2: 11
    func3: 25
    The result is 25

#### Example.2 Use in database query

```javascript
var Functional = require('arsenal').Functional,
    F = new Functional(),
    MongoClient = require('mongodb').MongoClient;

var dsn = 'http://localhost:27017/test',
    selector = { id: 1 };

F('connection done', function (err, db) {
    db.query(selector, F('query done'));
});

F('query done', function (err, data) {
    return data;
});

MongoClient.connect(dsn, {}, F('connection done'));
```

- - -

### Grid mechanism

Stablity: **STABLE**

Implementation of the two-dimensional grid flow algorithm.
For resolving the difficulty of programming with the asynchronous node.js.

A grid consist of two dimension: the x and y axis.
The grid runs through the x axis synchronously, and handles the elements asynchronously in the y axis.
When all the elements in the y axis is handled, the grid will move to next line in x axis and go on.

Elements in the grid can be any type, even function (function will be called).

#### Example

```javascript
var Grid = require('arsenal').Grid,
    grid = new Grid();

// Grid elements can be any type, also as function
var r = function () { return 'r'; },
    d = function () { return 'd'; };

// Grid handler function, the second parameter is null when the grid has run out of elements.
var handler = function (element, next) {
        if (next) {
            if (typeof element === 'function') {
                result += element();

            } else {
                result += element.toString();
            }

            next();

        } else {
            console.log('All done: %s', result);
        }
    };

// Push elemnts into the grid
grid.push('Hell');
grid.push(0, ' ');
grid.push('W', 'o', r, 1, d);
grid.push('!');
// Equal to the following:
// grid.push();
// grid.add('Hell');
// grid.push();
// grid.add(0);
// grid.add(' ');
// grid.push();
// grid.add('W');
// grid.add('o');
// grid.add(r);
// grid.add(1);
// grid.add(d);
// grid.push();
// grid.add('!');

var result = '';

// Setup handler function for each grid elements
grid.setup(handler);

// Start running the grid
grid.run();

// Or pass handler directly to run():
// grid.run(handler);
```

The output will be:

    All done: Hell0 W0rld!

- - -

### Sequence mechanism

Stablity: **UNSTABLE**

Run functions and callbacks in sequence.

The functions runs in serial order.

#### Example

```javascript
var Sequence = require('arsenal').Sequence,
    sequence = new Sequence();

var func = function (a, b, callback) {
        callback(a + b);
    };

// Add functions in a batch
sequence.push([

    // function #1
    function (arg1, arg2) {
        console.log(arg1, arg2);

        this.c = arg1;
        this.d = arg2;

        this.next();
    },

    // function #2
    function () {
        console.log(this.c, this.d);

        this.next();
    },

    // function #3
    function () {
        // Remove function(s) in action
        this.shift();
        console.log('total functions: %d', this.count());
        this.pop();
        console.log('total functions: %d', this.count());

        this.next();
    },

    // function #4
    function () {
        // No way to run to here due to the removal at function #3
        console.log('Not run');

        this.next();
    },

    // function #5
    function () {
        func(this.a + this.b, this.c + this.d, this.next);
    },

    // function #6
    function (result) {
        console.log('the result from the callback: %s', result);

        this.next();
    },

    // function #7
    function () {
        // No way to run to here due to the removal at function #3
        console.log('Not run');

        this.next();
    }

]);

console.log('total functions: %d', sequence.count());

// Initialize sequence context
sequence.context({
    a: 1,
    b: 2
});

// Run functions in sequence
sequence.run(1, 5);
```

The output will be:

    total functions: 7
    1 5
    1 5
    total functions: 6
    total functions: 5
    the result from the callback: 9

- - -

### Throttle mechanism

Stablity: **STABLE**

Limit the specific procedure to be run in a certain frequency.

The running frequency is measured by the running count in a time interval.

When the running times of the procedure has reach the limit of the time interval,
it will be deferred to next cycle.

#### Example

```javascript
var Throttle = require('arsenal').Throttle,
    throttle = new Throttle();

// Precision: throttle time interval, in ms
throttle.precision(1000);
// Threshold: limited process in each time interval
throttle.threshold(2);

// Setup worker function
throttle.setup(function (arg1, arg2) {
    console.log('arguments are: ', arg1, arg2);
});

// Set a timeout limit to 500, lower than the throttle precision
setTimeout(process.exit, 500);

// Push arguments to the worker function to process
throttle.run(1, 2);
throttle.run(3, 4);
throttle.run(5, 6);
```

The output will be:

    arguments are: 1 2
    arguments are: 3 4

(Note that the last call with `5 6` is not output due to the throttle mechanism)

- - -

### Trigger mechanism

Stablity: **STABLE**

Invokes a specified function when all the given conditions were satisfied.

The conditions will be checked through everytime the context changes.
(includes adding, updating, removing)

### Example

```javascript
Trigger = require('arsenal').Trigger,
    trigger = new Trigger();

// Set the trigger callback as hook
trigger.hook(function () {
    console.log('triggered!');
});

// Set condition #1
trigger.watch(function () {
    return (this.a == 1);
});

// Set condition #2
trigger.watch(function () {
    return (this.b == 2);
});

// Variable 'b' does not meet the condition #2
trigger.set('a', 1);
trigger.set('b', 1);

// This will satisfy the conditions, the callback will be triggered
trigger.set('b', 2);
```

The output will be:

    triggered!


Stablity Tags
-------------

(Quoted from node.js)

* **LOCKED**

    Unless serious bugs are found, this code will not ever change. Please
    do not suggest changes in this area; they will be refused.

* **FROZEN**

    This API has been tested extensively in production and is unlikely to
    ever have to change.

* **STABLE**

    The API has proven satisfactory, but cleanup in the underlying code may
    cause minor changes. Backwards-compatibility is guaranteed.

* **UNSTABLE**

    The API is in the process of settling, but has not yet had sufficient
    real-world testing to be considered stable. Backwards-compatibility
    will be maintained if reasonable.

* **EXPERIMENTAL**

    This feature was introduced recently, and may change or be removed in
    future versions. Please try it out and provide feedback. If it
    addresses a use-case that is important to you, tell the node core team.

* **DEPRECATED**

    This feature is known to be problematic, and changes are planned. Do
    not rely on it. Use of the feature may cause warnings. Backwards
    compatibility should not be expected.


License
-------

(The Apache License 2.0)

Copyright (c) 2014, DJ-NotYet <dj.notyet@gmail.com>

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
