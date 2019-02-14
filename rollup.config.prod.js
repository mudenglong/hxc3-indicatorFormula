import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import progress from 'rollup-plugin-progress';
import strip from 'rollup-plugin-strip';
import pkg from './package.json';

export default {
    input: 'src/index.js',
    output: {
        file: pkg.main,
        format: 'umd',
        name: pkg.moduleName,
        sourcemap: true,
        banner: `/*\n * hxc3.IndicatorFormula\n * @version: ${pkg.version}\n * last modified: ${new Date().toLocaleString()}\n */`
    },
    plugins: [
        resolve(),
        commonjs({
            exclude: 'src/**',
            include: 'node_modules/**'
        }),
        babel({
            plugins: [
                'external-helpers'
            ]
        }),
        strip({
            // set this to `false` if you don't want to
            // remove debugger statements
            debugger: true,
    
            // defaults to `[ 'console.*', 'assert.*' ]`
            // functions: ['console.log', 'assert.*', 'debug', 'alert'],
    
            // set this to `false` if you're not using sourcemaps –
            // defaults to `true`
            sourceMap: true
        }),
        uglify({
            output: {
                comments: function (node, comment) {
                    var text = comment.value;
                    var type = comment.type;
                    if (type === 'comment2') {
                        // multiline comment
                        return /@version/i.test(text);
                    }
                }
            }
        }),
        filesize(),
        progress({
            clearLine: true // default: true
        })
    ]
};