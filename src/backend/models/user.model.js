const schema = require("./schema");

exports.create = (data) => {
	return new Promise((resolve, reject) => {
		new schema.UserSchema(data).save((err, response) => {
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
		schema.UserSchema.find(search, (err, result) => {
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
		schema.UserSchema.findById(id, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};

exports.edit = (id, data, usernameLoggedIn) => {
	return new Promise((resolve, reject) => {
		this.getById(id)
			.then((findByIdRes) => {
				if (findByIdRes.username === usernameLoggedIn) {
					reject({ message: "Cannot update signed in user" });
				} else {
					schema.UserSchema.findByIdAndUpdate(
						id,
						data,
						(err, result) => {
							if (err) {
								reject(err);
							} else {
								this.getById(id)
									.then((res) => resolve(res))
									.catch((e) => reject(e));
							}
						}
					);
				}
			})
			.catch((err) => reject(err));
	});
};

exports.delete = (id, usernameLoggedIn) => {
	return new Promise((resolve, reject) => {
		this.getById(id).then((findByIdRes) => {
			if (findByIdRes.username === usernameLoggedIn) {
				reject({ message: "Cannot delete signed in user" });
			} else {
				schema.UserSchema.findByIdAndDelete(id, (err, result) => {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
				});
			}
		});
	});
};
