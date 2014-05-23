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
