const Pool = require("pg").Pool;

const con = new Pool({
    user:"test",
    password:"test",
    host:"localhost",
    port:5432,
    database:"shoppinglist"
})

module.exports = con;