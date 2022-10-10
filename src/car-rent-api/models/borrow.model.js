const schema = require("./schema");

exports.create = (data) => {
	return new Promise((resolve, reject) => {
		new schema.BorrowSchema(data).save((err, response) => {
			if (err) {
				reject(err);
			} else {
				resolve(response);
			}
		});
	});
};

exports.getAll = (query) => {
	let { limit, ...search } = query;
	console.log(search);

	return new Promise((resolve, reject) => {
		schema.BorrowSchema.find(search, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		}).limit(limit ? limit : 10);
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
				if (findByIdRes.status == "On Doing") {
					this.edit(id, { status: "Done" })
						.then((result) => {
							resolve(result);
						})
						.catch((err) => reject(err));
				} else {
					resolve(findByIdRes);
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
