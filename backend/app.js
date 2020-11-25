const express = require("express");
const bodyParser = require("body-parser");
const apiroutes = require("./routes/apiroutes");
const con = require("./db");
const bcrypt = require("bcrypt");
const { connect } = require("./db");


let app = express();

app.use(bodyParser.json());

let ttl = 3600000;

con.connect(function (err) {
	if (err) throw err;
	let sql = "CREATE TABLE IF NOT EXISTS users (id BIGSERIAL PRIMARY KEY, username VARCHAR(50) UNIQUE, password VARCHAR(256))"
	con.query(sql, function (err, result) {
		if (err) throw err;
		//console.log("Created table users if did not exist before:",result);
	})
	sql = "CREATE TABLE IF NOT EXISTS sessions (id BIGSERIAL PRIMARY KEY, token VARCHAR(128), ttl BIGINT, currentuser VARCHAR(50))"
	con.query(sql, function (err, result) {
		if (err) throw err;
		//console.log("Created table sessions if did not exist before:",result)
	})
	sql = "CREATE TABLE IF NOT EXISTS shoppingitems (_id BIGSERIAL PRIMARY KEY, type VARCHAR(80), count INT, price NUMERIC(5,2), currentuser VARCHAR(50))"
	con.query(sql, function (err, result) {
		if (err) throw err;
		//console.log("Created table shoppingitems if did not exist before:",result)
	})
})

//middleware

isUserLogged = (req, res, next) => {
	let token = req.headers.token;
	if (!token) {
		return res.status(403).json({ message: "forbidden" })
	}
	let sql = "SELECT * FROM sessions WHERE token='" + token + "'";
	con.query(sql, function (err, sessions) {
		if (err) {
			res.status(500).json({ message: "database failure" })
			throw err;
		}
		if (sessions.length === 0) {
			return res.status(403).json({ message: "forbidden" })
		}
		let now = Date.now();
		//console.log(sessions.rows[0].currentuser)
		let session = sessions.rows[0];
		if (now > session.ttl) {
			sql = "DELETE FROM sessions WHERE token='" + token + "'";
			con.query(sql, function (err) {
				if (err) {
					console.log(err);
				}
				return res.status(403).json({ message: "forbidden" })
			})
		} else {
			req.session = {};
			req.session.user = session.currentuser;
			let tempttl = now + ttl;
			sql = "UPDATE sessions SET ttl=" + tempttl + " WHERE token='" + token + "'";
			con.query(sql, function (err) {
				if (err) {
					console.log(err);
				}
				return next();
			})
		}
	})
}

createToken = () => {
	const letters = "abcdefghijABCDEFGHIJ0123456789";
	let token = "";
	for (let i = 0; i < 128; i++) {
		let temp = Math.floor(Math.random() * 30);
		token = token + letters[temp];
	}
	return token;
}

//LOGIN API

app.post("/register", function (req, res) {
	if (!req.body) {
		return res.status(422).json({ message: "Please enter proper credentials" })
	}
	if (!req.body.username || !req.body.password) {
		return res.status(422).json({ message: "Please enter proper credentials" })
	}
	if (req.body.username.length < 4 || req.body.password.length < 8) {
		return res.status(422).json({ message: "Username must be atleast 4 and password 8 characters long" })
	}
	bcrypt.hash(req.body.password, 10, function (err, hash) {
		if (err) {
			console.log("Failed to hash password:", err);
			return res.status(422).json({ message: "Please enter proper credentials" })
		}
		let sql = "INSERT INTO users (username,password) VALUES ('" + req.body.username + "','" + hash + "')";
		con.query(sql, function (err, result) {
			if (err) {
				if (err.code == 23505) {
					console.log("Postgres error code:", err.code)
					return res.status(409).json({ message: "Username is already in use" });
				}
				res.status(500).json({ message: "database failure" })
				throw err;
			}
			return res.status(200).json({ message: "success" });
		})
	})
})

app.post("/login", function (req, res) {
	if (!req.body) {
		return res.status(422).json({ message: "Please enter proper credentials" })
	}
	if (!req.body.username || !req.body.password) {
		return res.status(422).json({ message: "Please enter proper credentials" })
	}
	if (req.body.username.length < 4 || req.body.password.length < 8) {
		return res.status(422).json({ message: "Username must be atleast 4 and password 8 characters long" })
	}
	let sql = "SELECT * FROM users WHERE username='" + req.body.username + "'";
	con.query(sql, function (err, result) {
		if (err) {
			res.status(500).json({ message: "database failure" })
			throw err;
		}
		if (result.length === 0) {
			return res.status(403).json({ message: "forbidden" })
		}
		bcrypt.compare(req.body.password, result.rows[0].password, function (err, success) {
			if (err) {
				console.log("Failed to compare passwords", err);
				return res.status(403).json({ message: "forbidden" });
			}
			if (!success) {
				return res.status(403).json({ message: "forbidden" });
			}
			let token = createToken();
			let time_to_live = Date.now() + ttl;
			sql = "INSERT INTO sessions (currentuser,token,ttl) VALUES ('" + result.rows[0].username + "','" + token + "'," + time_to_live + ")";
			con.query(sql, function (err) {
				if (err) {
					res.status(500).json({ message: "database failure" })
					throw err;
				}
				return res.status(200).json({ token: token })
			})
		})
	})
})

app.post("/logout", function (req, res) {
	let token = req.headers.token;
	if (!token) {
		return res.status(404).json({ message: "forbidden" })
	}
	let sql = "DELETE FROM sessions WHERE token='" + token + "'";
	con.query(sql, function (err) {
		if (err) {
			res.status(500).json({ message: "database failure" })
			throw err;
		}
		return res.status(200).json({ message: "success" })
	})
})

app.use("/api", isUserLogged, apiroutes);


let port = process.env.PORT || 3001

app.listen(port);

console.log("Running in port:" + port);