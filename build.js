// # Build script for Arsenal
//

var fs = require('fs'),
    path = require('path'),
    optimist = require('optimist'),
    Arsenal = require('./src/arsenal');

var version = Arsenal.version,
    basePath = __dirname + '/',
    srcPath = basePath + 'src/',
    mecPath = srcPath + 'mechanism/',
    buildPath = basePath,
    argv = optimist
        .usage(
            'Usage: node build MECHANISM1 [MECHANISM2 ...] [OPTIONS]\n\n' +
            'Arsenal ' + version
        )
        .option('m', {
            alias: 'minify',
            'default': false,
            describe: 'Whether to minify the output file'
        })
        .option('o', {
            alias: 'output',
            'default': buildPath + 'arsenal.js',
            describe: 'Set path to the output file'
        })
        .option('q', {
            alias: 'quiet',
            'default': false,
            describe: 'Do not print any messages.'
        })
        .option('h', {
            alias: 'help',
            describe: 'Show this help message and exit.'
        })
        .option('V', {
            alias: 'version',
            describe: 'Print version number and exit.'
        })
        .wrap(80)
        .argv,
    names = argv._
    ;

try {
    if (argv.help) {
        throw 1;
    }

    if (names.length > 0) {
        var mecs = [];

        if (names.indexOf('all') !== -1) {
            fs.readdirSync(mecPath).forEach(function (e) {
                mecs.unshift(
                    fs.readFileSync(mecPath + e, 'UTF-8')
                );
            });

        } else {
            names.forEach(function (e) {
                try {
                    mecs.unshift(
                        fs.readFileSync( mecPath + e.toLowerCase() + '.js', 'UTF-8' )
                    );
                } catch (err) {}
            });
        }

        var output = fs.readFileSync(srcPath + 'arsenal.js', 'UTF-8'),
            signature = '// Arsenal ' + version + '\n' +
                '// https://github.com/DJ-NotYet/arsenal\n' +
                '// (c) 2014, DJ-NotYet <dj.notyet@gmail.com>\n' +
                '// Licensed under the Apache License, version 2.0\n'
        ;

        output = output.replace(
            new RegExp('Version [0-9]+.[0-9]+.[0-9]+'),
            'Version ' + version
        );

        fs.writeFileSync(srcPath + 'arsenal.js', output, 'UTF-8');

        output = output.replace(
            '/*{CONTENT}*/',
            function () { return mecs.join('\n\n\n'); }
        );

        if (argv.minify) {
            output = signature + require('uglify-js').minify(output, { fromString: true }).code;
        }

        if (argv.output[0] !== '/') {
            argv.output = path.resolve(process.cwd() + '/' + argv.output);
        }

        fs.writeFileSync(argv.output, output, 'UTF-8');

        fs.writeFileSync(
            basePath + 'package.json',
            fs.readFileSync(basePath + 'package.json', 'UTF-8')
                .replace(
                    /'[0-9]+.[0-9]+.[0-9]+'/,
                    '"' + version + '"'
                ),
            'UTF-8'
        );

        fs.writeFileSync(basePath + 'VERSION', version, 'UTF-8');

        if (! argv.quiet) {
            console.log('Built with ' + version);
        }

        process.exit(0);

    } else {
        throw 1;
    }

} catch (e) {
    if (e === 1) {
        console.log(optimist.help());
        process.exit(1);

    } else {
        throw e;
    }
}
