const express = require("express");
const router = express.Router();

const authModel = require("../models/auth.model");

router.post("/signin", async (req, res) => {
	authModel
		.authenticate(req.body)
		.then((result) => res.json(result))
		.catch((err) => res.status(401).json(err));
});

router.post("/signup", async (req, res) => {
	console.log(req.body);
	// try {
	// 	res.status(201).json({
	// 		status: "201 Create",
	// 		message: "Successfully sign up",
	// 		data: await authModel.save(req.body),
	// 	});
	// } catch (err) {
	// 	let message = "";
	// 	if (err.keyPattern.username === 1) {
	// 		message = "Error: Username has already taken";
	// 	}
	// 	res.status(400).json({
	// 		status: "400 NOT FOUND",
	// 		message,
	// 		err,
	// 	});
	// }
});

router.get("/authToken", async (req, res) => {
	// console.log("called");
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];

	try {
		res.status(200).json({
			status: "200 OK",
			message: "Token Is Valid",
			data: await authModel.authToken(token),
		});
	} catch (err) {
		res.status(401).json({
			status: "401 Unauthorized",
			message: "Token Is Not Valid",
			err,
		});
	}
});

module.exports = router;
