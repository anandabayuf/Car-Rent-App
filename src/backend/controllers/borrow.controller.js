const express = require("express");
const router = express.Router();

const borrowModel = require("../models/borrow.model");
const carModel = require("../models/car.model");

router.get("", async (req, res) => {
	try {
		res.status(200).json({
			message: "Successfully get all borrows data",
			status: "200 OK",
			data: await borrowModel.getAll(req.query),
		});
	} catch (err) {
		res.status(404).json({
			message: "Error to get all borrows data",
			status: "404 NOT FOUND",
			err,
		});
	}
});

router.get("/:id", async (req, res) => {
	try {
		let borrow = await borrowModel.getById(req.params.id);

		if (borrow) {
			const {
				carPlateNo,
				unixBookDate,
				unixDepartDate,
				unixReturnDate,
				...rest
			} = borrow;

			borrow = rest;

			borrow["car"] = await carModel.getAll({
				plateNo: borrow["carPlateNo"],
			})[0];

			borrow["bookDate"] = new Date(0).setUTCSeconds(unixBookDate);
			borrow["departDate"] = new Date(0).setUTCSeconds(unixDepartDate);
			borrow["returnDate"] = new Date(0).setUTCSeconds(unixReturnDate);
		}

		res.status(200).json({
			message: "Successfully get borrow data",
			status: "200 OK",
			data: borrow,
		});
	} catch (err) {
		res.status(404).json({
			message: "Error to get borrow data",
			status: "404 NOT FOUND",
			err,
		});
	}
});

router.get("/car/:carPlateNo", async (req, res) => {
	try {
		const data = await borrowModel.getBookedOrOnDoingOrDone(
			req.params.carPlateNo
		);

		res.status(200).json({
			message: "Successfully get borrow car data",
			status: "200 OK",
			data: data,
		});
	} catch (err) {
		res.status(404).json({
			message: "Error to get borrow data",
			status: "404 NOT FOUND",
			err,
		});
	}
});

router.post("/", async (req, res) => {
	try {
		/*
	    dari user nerima:
	    customer,
	    carPlateNo,
	    daysToBorrow,
		hoursToBorrow,
	    departdate,
		returnDate,
	    downpayment,
		totalCost,
		remains
	    */

		let { departDate, returnDate, carId, ...payload } = req.body;

		payload["user"] = {
			username: req.user.username,
			email: req.user.email,
		};

		payload["unixBookDate"] = new Date().getTime() / 1000;
		payload["unixDepartDate"] = new Date(departDate).getTime() / 1000;
		payload["unixReturnDate"] = new Date(returnDate).getTime() / 1000;

		res.status(201).json({
			status: "201 Create",
			message: "Successfully create borrow data",
			data: await borrowModel.create(payload, carId),
		});
	} catch (err) {
		res.status(404).json({
			status: "404 NOT FOUND",
			message: "Error to create borrow data",
			err,
		});
	}
});

router.put("/status/:id", async (req, res) => {
	try {
		res.status(201).json({
			message: "Successfully edit borrow status",
			status: "201 OK",
			data: await borrowModel.editBorrowStatus(req.params.id),
		});
	} catch (err) {
		res.status(404).json({
			message: "Error to edit borrow status",
			status: "404 NOT FOUND",
			err,
		});
	}
});

module.exports = router;
