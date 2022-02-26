const path = require("path"),
    exp = require("express"),
    UglifyJS = require("uglify-js"),
    swaggerUi = require("swagger-ui-express"),
    swaggerDocument = require("./swagger.json"),
    app = exp();

function minify(code) {
    const obj = UglifyJS.minify(code, {
        annotations: true,
        parse: {},
        compress: {
            annotations: true,
            arguments: true,
            arrows: true,
            assignments: true,
            awaits: true,
            booleans: true,
            collapse_vars: true,
            comparisons: true,
            conditionals: true,
            dead_code: true,
            default_values: true,
            directives: true,
            drop_console: false,
            drop_debugger: true,
            evaluate: true,
            expression: true,
            functions: false,
            global_defs: {},
            hoist_exports: true,
            hoist_funs: false,
            hoist_props: true,

            hoist_vars: false,

            if_return: true,

            imports: true,

            inline: 4,
            join_vars: false,
            keep_fargs: false,
            keep_infinity: true,
            loops: true,
            merge_vars: true,
            negate_iife: true,
            objects: true,
            passes: 2,
            properties: true,
            pure_funcs: null,
            pure_getters: "strict",
            reduce_funcs: true,
            reduce_vars: true,
            rests: true,
            sequences: true,
            side_effects: true,
            spreads: true,
            strings: true,
            switches: true,
            templates: true,
            top_retain: null,
            toplevel: false,
            typeofs: true,
            unsafe: false,
            unsafe_comps: false,
            unsafe_Function: false,
            unsafe_math: false,
            unsafe_proto: false,
            unsafe_regexp: false,
            unsafe_undefined: false,
            unused: true,
            varify: true,
            yields: true
        },
        mangle: {
            properties: {},
        },
        output: {},
        sourceMap: {
            url: "out.js.map"
        },
        
        ie: true,
        keep_fargs: false,
        keep_fnames: false,
        nameCache: null,
        toplevel: false,
        v8: false,
        warnings: false,
        webkit: false
    })
    return Object.assign(obj, {
        code: `${obj.code.substring(0, obj.code.length - 10)}data:application/json,${obj.map}`
    });
};

app.disable("x-powered-by");
app.use(exp.static(__dirname + "/docs/"));
app.all("/", (e, r) => r.redirect("https://minify.cybemachine.repl.co"));
app.use("/api-docs", (e,r)=>r.redirect("https://minify.cybemachine.repl.co"));
app.route("/api").get((e, r) => {
    if (!e.query.code && !e.query.input) return r.send("no input/code detected");
    r.send(minify(e.query.code || e.query.input))
}).post((e, r) => {
    let i = "";
    e.query.code || e.query.input ? i = minify(e.query.code || e.query.input) : e.body ? i = minify(e.body) : r.send("no body detected"), r.send(i)
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
