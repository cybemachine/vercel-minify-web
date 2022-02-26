const path = require("path"),
    exp = require("express"),
    UglifyJS = require("uglify-js"),
    swaggerUi = require("swagger-ui-express"),
    swaggerDocument = require("./swagger.json"),
    app = exp();
app.disable("x-powered-by");
app.use(exp.static(__dirname + "/docs/"));
app.all("/", (e, r) => r.redirect(302, "api-docs"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument)), app.route("/api").get((e, r) => {
    if (!e.query.code && !e.query.input) return r.send("no input/code detected");
    r.send(UglifyJS.minify(e.query.code || e.query.input))
}).post((e, r) => {
    let i = "";
    e.query.code || e.query.input ? i = UglifyJS.minify(e.query.code || e.query.input) : e.body ? i = UglifyJS.minify(e.body) : r.send("no body detected"), r.send(i)
});
app.listen(8080);