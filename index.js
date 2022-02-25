const UglifyJS = require("uglify-js");
const exp = require("express");
const path = require("path");
const app = exp();

app.all('/', (req, res) => {
    res.sendFile(path.resolve("./index.html"))
})

app.route('/api')
    .get((req, res) => {
        if (!(req.query.code || req.query.input)) return res.send("no input/code detected");
        res.send(UglifyJS.minify(req.query.code || req.query.input))
    })
    .post((req, res) => {
        if (!req.body) return res.send("no body detected");
        res.send(UglifyJS.minify(req.body))
    });

app.listen(8080)