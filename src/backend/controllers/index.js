const authController = require("./auth.controller");
const {
	isAuthenticated,
	operatorAdmin,
} = require("../middlewares/auth.middleware");
const userController = require("./user.controller");
const carController = require("./car.controller");

module.exports = (app) => {
	app.use("/auth", authController);
	app.use("/user", [isAuthenticated, operatorAdmin], userController);
	app.use("/car", [isAuthenticated], carController);
};
