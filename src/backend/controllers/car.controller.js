const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const carModel = require("../models/car.model");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads");
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage: storage });

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

router.post("/", upload.single("picture"), async (req, res) => {
	let payload = JSON.parse(req.body.data);
	// console.log();
	payload["picture"] = {
		data: fs.readFileSync(
			path.join(__dirname, "..", "/uploads/" + req.file.filename)
		),
		contentType: "image/png",
	};

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

router.put("/:id", upload.single("picture"), async (req, res) => {
	let payload = JSON.parse(req.body.data);
	// console.log(req.file);
	if (req.file) {
		payload["picture"] = {
			data: fs.readFileSync(
				path.join(__dirname, "..", "/uploads/" + req.file.filename)
			),
			contentType: "image/png",
		};
	}

	try {
		res.status(201).json({
			message: "Successfully edit car data",
			status: "201 OK",
			data: await carModel.edit(req.params.id, payload),
		});
	} catch (err) {
		res.status(404).json({
			message: "Error to edit car data",
			status: "404 NOT FOUND",
			err,
		});
	}
});

// router.put("/status/:id", async (req, res) => {
// 	try {
// 		res.status(201).json({
// 			message: "Successfully edit car status data",
// 			status: "201 OK",
// 			data: await carModel.editCarStatus(req.params.id),
// 		});
// 	} catch (err) {
// 		res.status(404).json({
// 			message: "Error to edit car status data",
// 			status: "404 NOT FOUND",
// 			err,
// 		});
// 	}
// });

router.delete("/:id", async (req, res) => {
	try {
		await carModel.delete(req.params.id);

		res.status(200).json({
			message: "Successfully delete car data",
			status: "204 NO CONTENT",
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
