const schema = require("./schema");

exports.create = (data) => {
	return new Promise((resolve, reject) => {
		new schema.CarSchema(data).save((err, response) => {
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

	return new Promise((resolve, reject) => {
		schema.CarSchema.find(search, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
		//.limit(limit ? limit : 10)
	});
};

exports.getById = (id) => {
	return new Promise((resolve, reject) => {
		schema.CarSchema.findById(id, (err, result) => {
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
		schema.CarSchema.findByIdAndUpdate(id, data, (err, result) => {
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

exports.editCarStatus = (id) => {
	return new Promise((resolve, reject) => {
		this.getById(id)
			.then((findByIdRes) => {
				let data = {
					status:
						findByIdRes.status == "Not Available"
							? "Available"
							: "Not Available",
				};

				this.edit(id, data)
					.then((result) => {
						resolve(result);
					})
					.catch((err) => reject(err));
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
