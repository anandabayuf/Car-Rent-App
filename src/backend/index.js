const express = require("express");
const bodyParser = require("body-parser");
const { config } = require("dotenv");
const controllers = require("./controllers");
var cors = require("cors");

config();

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

controllers(app);

app.listen(port, () => {
	console.log(`Rent Car App API listening on http://localhost:${port}`);
});
