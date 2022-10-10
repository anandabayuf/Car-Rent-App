const schema = require("./schema");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

exports.save = (data) => {
	data.salt = crypto.randomBytes(16).toString("hex");
	data.password = crypto
		.pbkdf2Sync(data.password, data.salt, 1000, 64, `sha512`)
		.toString(`hex`);

	return new Promise((resolve, reject) => {
		new schema.UserSchema(data).save((err, response) => {
			if (err) {
				reject(err);
			} else {
				let { password, salt, ...result } = data;

				resolve(result);
			}
		});
	});
};

exports.authenticate = (data) => {
	let { username, password } = data;

	return new Promise((resolve, reject) => {
		schema.UserSchema.findOne({ username }, (err, response) => {
			if (err) {
				reject(err);
			}

			if (response) {
				let passwordFromDB = response.password;
				let passwordFromUser = crypto
					.pbkdf2Sync(password, response.salt, 1000, 64, `sha512`)
					.toString(`hex`);

				if (passwordFromDB == passwordFromUser) {
					const data = {
						id: response._id,
						username: response.username,
						email: response.email,
						role: response.role,
					};
					const token = jwt.sign(data, process.env.SECRET_KEY, {
						expiresIn: "86400s",
						algorithm: "HS256",
					});
					resolve({ token });
				} else {
					reject({ message: "Wrong Password!" });
				}
			} else {
				reject({ message: "Wrong Username!" });
			}
		});
	});
};
