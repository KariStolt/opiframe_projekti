const express = require("express");
const con = require("../db");


let router = express.Router();



router.get("/shopping",function(req,res) {
	let sql = "SELECT * FROM shoppingitems WHERE currentuser='"+req.session.user+"' OR shared='"+req.session.user+"'";
	con.query(sql,function(err,items) {
		if(err) {
			res.status(500).json({message:"database failure"})
			throw err;
		}
		return res.status(200).json(items.rows);
	})
})

router.post("/shopping",function(req,res) {
	let sql = "INSERT INTO shoppingitems (type,count,price,currentuser,shared) VALUES ('"+req.body.type+"',"+req.body.count+","+req.body.price+",'"+req.session.user+"', '"+req.body.shared+"')";
	con.query(sql,function(err) {
		if(err) {
			res.status(500).json({message:"database failure"})
			throw err;
		}
		return res.status(200).json({message:"success"})
	})
	
})

router.delete("/shopping/:id",function(req,res) {
	let tempId = parseInt(req.params.id,10);
	let sql = "DELETE FROM shoppingitems WHERE _id="+tempId+" AND currentuser='"+req.session.user+"' OR _id="+tempId+" AND shared='"+req.session.user+"'";
	con.query(sql,  function(err,result) {
		if(err) {
			res.status(500).json({message:"database failure"})
			throw err;			
		}
		if(result.affectedRows === 0) {
			return res.status(404).json({message:"not found"})
		}
		return res.status(200).json({message:"success"})
	})
})

router.put("/shopping/:id",function(req,res) {
	let tempId = parseInt(req.params.id,10);
	let sql = "UPDATE shoppingitems SET type='"+req.body.type+"',count="+req.body.count+",price="+req.body.price+" WHERE _id="+tempId+" AND currentuser='"+req.session.user+"' OR shared='"+req.session.user+"'";
	con.query(sql,  function(err,result) {
		if(err) {
			res.status(500).json({message:"database failure"})
			throw err;			
		}
		if(result.affectedRows === 0) {
			return res.status(404).json({message:"not found"})
		}
		return res.status(200).json({message:"success"})
	})
})

module.exports = router;