const UglifyJS = require("uglify-js");
const swaggerUi = require('swagger-ui-express');
const exp = require("express");
const path = require("path");
const app = exp();
const swaggerDocument = require('./swagger.json');

app.use(exp.static(__dirname + '/docs/'));

app.all('/', (req, res) => {
    res.redirect(302, 'api-docs')
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.disable('x-powered-by')

app.route('/api')
    .get((req, res) => {
        if (!(req.query.code || req.query.input)) return res.send("no input/code detected");
        res.send(UglifyJS.minify(req.query.code || req.query.input))
    })
    .post((req, res) => {
        let code = ''
        if (req.query.code || req.query.input) {
            code = UglifyJS.minify(req.query.code || req.query.input);
        } else {
            if (!req.body) {
                res.send("no body detected")
            } else {
                code = UglifyJS.minify(req.body)
            }
        }

        res.send(code)
    });

app.listen(8080)