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
