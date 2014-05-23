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
