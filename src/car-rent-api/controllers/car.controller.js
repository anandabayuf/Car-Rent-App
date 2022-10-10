const express = require("express");
const router = express.Router();

const carModel = require("../models/car.model");

router.get("", async (req, res) => {
	try {
		res.status(200).json({
			message: "Successfully get all cars data",
			status: "200 OK",
			data: await carModel.getAll(req.query),
		});
	} catch (err) {
		res.status(404).json({
			message: "Error to get all cars data",
			status: "404 NOT FOUND",
			err,
		});
	}
});

router.get("/:id", async (req, res) => {
	try {
		res.status(200).json({
			message: "Successfully get car data",
			status: "200 OK",
			data: await carModel.getById(req.params.id),
		});
	} catch (err) {
		res.status(404).json({
			message: "Error to get car data",
			status: "404 NOT FOUND",
			err,
		});
	}
});

router.post("/", async (req, res) => {
	let payload = req.body;

	payload["user"] = {
		username: req.user.username,
		email: req.user.email,
	};

	try {
		res.status(201).json({
			message: "Successfully create car data",
			status: "201 OK",
			data: await carModel.create(payload),
		});
	} catch (err) {
		res.status(404).json({
			message: "Error to create car data",
			status: "404 NOT FOUND",
			err,
		});
	}
});

router.put("/:id", async (req, res) => {
	try {
		res.status(201).json({
			message: "Successfully edit car data",
			status: "201 OK",
			data: await carModel.edit(req.params.id, req.body),
		});
	} catch (err) {
		res.status(404).json({
			message: "Error to edit car data",
			status: "404 NOT FOUND",
			err,
		});
	}
});

router.put("/status/:id", async (req, res) => {
	try {
		res.status(201).json({
			message: "Successfully edit car status data",
			status: "201 OK",
			data: await carModel.editCarStatus(req.params.id),
		});
	} catch (err) {
		res.status(404).json({
			message: "Error to edit car status data",
			status: "404 NOT FOUND",
			err,
		});
	}
});

router.delete("/:id", async (req, res) => {
	console.log(req.params.id);
	try {
		res.status(204).json({
			message: "Successfully delete car data",
			status: "204 NO CONTENT",
			data: await carModel.delete(req.params.id),
		});
	} catch (err) {
		res.status(404).json({
			message: "Error to delete car data",
			status: "404 NOT FOUND",
			err,
		});
	}
});

module.exports = router;
