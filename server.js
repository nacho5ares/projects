const express = require('express');
const bodyParser = require('body-parser');
const history = [];
let accounts = [];
const app = express();
app.use(bodyParser.json());
let cuenta1 = {
    "account": 987654321,
    "balance": 45450.00,
    "owner": 7612333392,
    "createdAt": new Date()
};
let cuenta2 = {
    "account": 123456789,
    "balance": 0.00,
    "owner": 7612333391,
    "createdAt": new Date()
};
accounts.push(cuenta1);
accounts.push(cuenta2);
app.set("accounts", accounts);
app.set('cuenta1', cuenta1);

app.set('history', history);
const port = 3000;
require('./app/routes')(app);
//Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const expressSwagger = require('express-swagger-generator')(app);
const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Time to document that Express API you built",
            version: "1.0.0",
            description: "A test project to understand how easy it is to document and Express API",
            license: {
                name: "MIT",
                url: "https://choosealicense.com/licenses/mit/"
            },
            contact: {
                name: "Swagger",
                url: "https://swagger.io",
                email: "Info@SmartBear.com"
            }
        },
        servers: [{

            url: "http://localhost:3000/"
        }]
    },
    apis: ['./app/routes/transfer.js']
};
const specs = swaggerJsdoc(options);
app.use("/docs", swaggerUi.serve);
app.get(
    "/docs",
    swaggerUi.setup(specs, {
        explorer: true
    })
);

//expressSwagger(options);
app.listen(port, () => console.log(`Backend Assignment - CP app listening at http://localhost:${port}`));