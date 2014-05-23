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

/*{CONTENT}*/

    }).call(Arsenal);


}).call({}, this);
