const jwt = require("jsonwebtoken");

exports.isAuthenticated = (req, res, next) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];

	jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
		if (err) {
			return res.status(401).json({
				status: "401 Unauthorized",
				message:
					"A client is forbidden from accessing a valid resource",
			});
		} else {
			req.user = user;
			next();
		}
	});
};

exports.operatorAdmin = (req, res, next) => {
	if (req.user) {
		if (req.user.role === "Admin") {
			next();
		} else {
			return res.status(403).json({
				status: "403 Forbidden",
				message: "Only Admin can access this resource",
			});
		}
	}
};
