const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const userModel = require("../models/user.model");

router.get("", async (req, res) => {
	try {
		const users = await userModel.getAll(req.query);

		let data = [];

		if (users.length > 0) {
			data = users.map((el) => {
				const { password, salt, ...rest } = el.toObject();
				return rest;
			});
		}

		res.status(200).json({
			message: "Successfully get all users data",
			status: "200 OK",
			data: data,
		});
	} catch (err) {
		res.status(404).json({
			message: "Error to get all users data",
			status: "404 NOT FOUND",
			err,
		});
	}
});

router.get("/:id", async (req, res) => {
	try {
		const user = await userModel.getById(req.params.id);

		const { password, salt, ...rest } = user.toObject();

		res.status(200).json({
			message: "Successfully get user data",
			status: "200 OK",
			data: rest,
		});
	} catch (err) {
		res.status(404).json({
			message: "Error to get user data",
			status: "404 NOT FOUND",
			err,
		});
	}
});

router.post("/", async (req, res) => {
	let data = req.body;
	data.salt = crypto.randomBytes(16).toString("hex");
	data.password = crypto
		.pbkdf2Sync(data.password, data.salt, 1000, 64, `sha512`)
		.toString(`hex`);
	data.user = {
		username: req.user.username,
		email: req.user.email,
	};

	try {
		await userModel.create(data);

		const { password, salt, ...rest } = data;

		res.status(201).json({
			status: "201 Create",
			message: "Successfully create user",
			data: rest,
		});
	} catch (err) {
		let message = "";
		if (err.keyPattern.username === 1) {
			message = "Error: Username has already taken";
		}
		res.status(404).json({
			status: "404 NOT FOUND",
			message,
			err,
		});
	}
});

router.put("/:id", async (req, res) => {
	let data = req.body;

	if (data.password) {
		data.salt = crypto.randomBytes(16).toString("hex");
		data.password = crypto
			.pbkdf2Sync(data.password, data.salt, 1000, 64, `sha512`)
			.toString(`hex`);
	}

	try {
		const user = await userModel.edit(
			req.params.id,
			data,
			req.user.username
		);

		const { password, salt, ...rest } = user.toObject();
		res.status(201).json({
			message: "Successfully edit user data",
			status: "201 OK",
			data: rest,
		});
	} catch (err) {
		res.status(404).json({
			message: "Error to edit user data",
			status: "404 NOT FOUND",
			err,
		});
	}
});

router.delete("/:id", async (req, res) => {
	try {
		await userModel.delete(req.params.id, req.user.username);
		res.status(200).json({
			message: "Successfully delete user data",
			status: "204 NO CONTENT",
		});
	} catch (err) {
		res.status(404).json({
			message: "Error to delete user data",
			status: "404 NOT FOUND",
			err,
		});
	}
});

module.exports = router;
