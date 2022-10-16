const schema = require("./schema");
const carModel = require("./car.model");

exports.create = (data, carId) => {
	return new Promise((resolve, reject) => {
		new schema.BorrowSchema(data).save((err, response) => {
			if (err) {
				reject(err);
			} else {
				carModel
					.editCarStatus(carId)
					.then((res) => {
						resolve(response);
					})
					.catch((error) => reject(error));
			}
		});
	});
};

exports.getAll = (query) => {
	let { limit, ...search } = query;

	return new Promise((resolve, reject) => {
		schema.BorrowSchema.find(
			{ status: { $in: ["Booked", "On Doing", "Done"] } },
			(err, result) => {
				if (err) {
					reject(err);
				} else {
					let data = result.map(async (el) => {
						el = el.toObject();

						const {
							carPlateNo,
							unixBookDate,
							unixDepartDate,
							unixReturnDate,
							...rest
						} = el;

						const car = await carModel.getAll({
							plateNo: carPlateNo,
						});

						return {
							...rest,
							bookDate: new Date(unixBookDate * 1000),
							departDate: new Date(unixDepartDate * 1000),
							returnDate: new Date(unixReturnDate * 1000),
							car: car[0],
						};
					});
					Promise.all(data).then((res) => {
						resolve(res);
					});
				}
			}
		);
	});
};

exports.getBookedOrOnDoingOrDone = (carPlateNo) => {
	return new Promise((resolve, reject) => {
		schema.BorrowSchema.find(
			{
				status: { $in: ["Booked", "On Doing", "Done"] },
				carPlateNo: carPlateNo,
			},
			(error, result) => {
				if (error) {
					reject(error);
				} else {
					let data = result[0];
					data = data.toObject();

					let {
						carPlateNo,
						unixBookDate,
						unixDepartDate,
						unixReturnDate,
						...rest
					} = data;

					rest = {
						...rest,
						bookDate: new Date(unixBookDate * 1000),
						departDate: new Date(unixDepartDate * 1000),
						returnDate: new Date(unixReturnDate * 1000),
					};

					resolve(rest);
				}
			}
		);
	});
};

exports.getById = (id) => {
	return new Promise((resolve, reject) => {
		schema.BorrowSchema.findById(id, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};

exports.edit = (id, data) => {
	return new Promise((resolve, reject) => {
		schema.BorrowSchema.findByIdAndUpdate(id, data, (err, result) => {
			if (err) {
				reject(err);
			} else {
				this.getById(id)
					.then((res) => resolve(res))
					.catch((e) => reject(e));
			}
		});
	});
};

exports.editBorrowStatus = (id) => {
	return new Promise((resolve, reject) => {
		this.getById(id)
			.then((findByIdRes) => {
				const departDate = new Date(
					new Date(findByIdRes.unixDepartDate * 1000)
				);
				const returnDate = new Date(
					new Date(findByIdRes.unixReturnDate * 1000)
				);
				// console.log(new Date(departDate));
				// console.log(new Date("2022-10-14T17:24"));
				// console.log(
				// 	new Date(departDate).getTime() >= new Date().getTime()
				// );
				const isDepartDateGTEToNow =
					new Date(departDate).getTime() >= new Date().getTime();

				if (findByIdRes.status == "Booked" && isDepartDateGTEToNow) {
					this.edit(id, { status: "On Doing" })
						.then((result) => {
							resolve(result);
						})
						.catch((err) => reject(err));
				} else if (findByIdRes.status == "On Doing") {
					this.edit(id, { status: "Done" })
						.then((result) => {
							resolve(result);
						})
						.catch((err) => reject(err));
				} else if (findByIdRes.status == "Done") {
					this.edit(id, { status: "Returned" })
						.then(async (result) => {
							result = result.toObject();

							const car = await carModel.getAll({
								plateNo: result.carPlateNo,
							});

							await carModel.editCarStatus(car[0]._id);

							resolve(result);
						})
						.catch((err) => reject(err));
				}
			})
			.catch((findByIdErr) => reject(findByIdErr));
	});
};

exports.delete = (id) => {
	return new Promise((resolve, reject) => {
		schema.CarSchema.findByIdAndDelete(id, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};
