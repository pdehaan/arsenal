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
