const userController = require("./user.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const carController = require("./car.controller");

module.exports = (app) => {
	app.use("/user", userController);
	app.use("/car", [isAuthenticated], carController);
};
