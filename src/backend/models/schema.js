const mongoose = require("mongoose");

mongoose
	.connect("mongodb://localhost:27017/CarRentAppDB")
	.then(() => {
		console.log("MongoDB connection has been established successfully.");
	})
	.catch((error) => {
		console.log("Unable to connect to MongoDB: ", error);
	});

exports.UserSchema = mongoose.model("User", {
	username: {
		type: String,
		unique: true,
		required: true,
		dropDups: true,
	},
	password: String,
	email: String,
	salt: String,
	role: {
		type: String,
		enum: ["operator", "admin"],
		require: true,
		default: "operator",
	},
});

exports.CarSchema = mongoose.model("Car", {
	plateNo: {
		type: String,
		unique: true,
		required: true,
		dropDups: true,
	},
	brand: String,
	type: String,
	year: Number,
	rentPrice: {
		perDay: Number,
		perHour: Number,
	},
	status: {
		type: String,
		enum: ["Available", "Not Available"],
		require: true,
		default: "Available",
	},
	user: {
		username: String,
		email: String,
	},
});

exports.BorrowSchema = mongoose.model("Borrow", {
	date: { type: Date, default: Date.now }, //when they do book
	customer: {
		name: String,
		ID: String,
		address: String,
		phoneNumber: String,
	},
	carId: String,
	daysToBorrow: Number,
	totalCost: Number,
	downPayment: Number,
	remains: Number,
	status: {
		type: String,
		enum: ["On Doing", "Done"],
		require: true,
		default: "On Doing",
	},
	departDate: { type: Date, default: Date.now }, //when they book
	user: {
		username: String,
		email: String,
	},
});

exports.ReturnSchema = mongoose.model("Return", {
	returnDate: { type: Date, default: Date.now },
	borrowId: String,
	lost: {
		isLost: Boolean,
		fine: Number,
		information: String,
	},
	broken: {
		isBroken: Boolean,
		fine: Number,
		information: String,
	},
	late: {
		isLate: Boolean,
		fine: Number,
		information: String,
	},
	totalPrice: Number,
	repayment: Number,
	change: Number,
	user: {
		username: String,
		email: String,
	},
});
