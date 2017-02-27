var express = require('express');
var app = express();
var sql = require("mssql");
var bodyparser = require('body-parser');
app.listen(process.env.PORT || 1234);
app.use(bodyparser.json())
var db;
    // config for your database
    var config = {
        'user': 'sa',
        'password': 'infobiz$$',
        'server': '125.19.66.82\\SQLEXPRESS', 
        'database': 'CFMSNLSCFDATA'
    };
	sql.connect(config, function (err) {
	if(err){
		console.log("connection error "+err);
		sql.connect(config,function(err){
			if(err){
				console.log("second time conection err "+err);
			}else{
				console.log("Connection established 2nd time");
			}
		});
	}else{
		console.log("connection established");
		console.log("sql "+sql);
		db=sql;
		console.log("db  "+db);
		module.exports = db;
	}
	});
app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});
/* var server = app.listen(5000, function () {
    console.log('Server is running..');
	
    // config for your database
    var config = {
        'user': 'sa',
        'password': 'infobiz$$',
        'server': '192.168.0.5\\SQLEXPRESS', 
        'database': 'CFMSNLSCFDATA'
    };
	//console.log("config "+config);
    sql.connect(config, function (err) {
    
        if (err){
			console.log("ervvv "+err);
		}else{
		console.log("connection etalished");
		var request = new sql.Request();
           
        // query to the database and get the records
        request.query('select grp_name_vc from tblmastchitgroup', function (err, recordset) {
            
            if (err) console.log("er   "+err);
			console.log("vv "+recordset);
            // send records as a response
            //res.send(recordset);
            
        });
		}
}); 
		
}); */

app.get('/get',function(req,res){
	console.log("db=== "+db);
var request = new db.Request();
           console.log("bsdc "+request);
        // query to the database and get the records
        request.query('select grp_name_vc from tblmastchitgroup', function (err, recordset) {
            
            if (err) console.log("er   "+err);
			//console.log("vv "+recordset);
            // send records as a response
            res.send(recordset);
            
        });		
});
		
app.post('/login',function(req,res){
		var username=req.body.username;
		var password=req.body.password;
		console.log("us "+username);
		console.log("sd "+password);	
		var request = new db.Request();
		//var request=new db.Request()
    request.input('user_id_vc', sql.VarChar(20), username);
	request.query('select mob_password_vc from tbl_users where user_id_vc =@user_id_vc').then(function(recordset) {
		//console.log("pass "+recordset[0].mob_password_vc);
	if(recordset==null || recordset.lenth ==0){
			res.send({"message":"Invalid username","status":202});
		}
        if(recordset[0].mob_password_vc===password){
			res.send({"message":"successfully valid user","status":200});
		}else{
			res.send({"message":"Invalid password","status":201});
		}
		
    }).catch(function(err) {
		console.log("fetching err "+err);
    });
		
});
app.get('/getUsers',function(req,res){
	var request = new db.Request();
	request.query('select * from tbl_users').then(function(recordset) {
		//console.log("pass "+recordset[0].mob_password_vc);
	res.json(recordset);
		
    }).catch(function(err) {
		console.log("fetching err "+err);
    });
});

app.get('/getBranches',function(req,res){
	var request=new db.Request();
	request.query('select brn_id_vc from tblmastbranch').then(function(recordset) {
		//console.log("pass "+recordset[0].mob_password_vc);
		res.json(recordset);
		
		
    }).catch(function(err) {
		console.log("fetching err "+err);
    });
});


app.get('/getGroups/:branch',function(req,res){
	var request=new db.Request();
	console.log("branch "+req.params.branch);
	request.input('brn_id_vc', sql.VarChar(20), req.params.branch);
	request.query('select grp_name_vc from tblmastchitgroup where brn_id_vc=@brn_id_vc').then(function(recordset) {
		//console.log("pass "+recordset[0].mob_password_vc);
		res.json(recordset);
		
		
    }).catch(function(err) {
		console.log("fetching err "+err);
    });
});

app.get('/getSubscribers/:branch/:group',function(req,res){
	var request=new db.Request();
	console.log("branch "+req.params.branch);
	request.input('brn_id_vc', sql.VarChar(20), req.params.branch);
	request.input('grp_name_vc', sql.VarChar(20), req.params.group);
	request.query('select subr_no_i from tblmastsubscriber where brn_id_vc=@brn_id_vc AND grp_name_vc=@grp_name_vc').then(function(recordset) {
		//console.log("pass "+recordset[0].mob_password_vc);
		res.json(recordset);
		
		
    }).catch(function(err) {
		console.log("fetching err "+err);
    });
});
app.get('/getSubscriber/:branch/:group/:sub',function(req,res){
	var request=new db.Request();
	request.input('brn_id_vc', sql.VarChar(20), req.params.branch);
	request.input('grp_name_vc', sql.VarChar(20), req.params.group);
	request.input('subr_no_i', sql.Int(20), req.params.sub);
	request.query('select * from tblmastsubscriber where brn_id_vc=@brn_id_vc AND grp_name_vc=@grp_name_vc AND subr_no_i=@subr_no_i').then(function(recordset) {
		//console.log("pass "+recordset[0].mob_password_vc);
		res.json(recordset);
		
		
    }).catch(function(err) {
		console.log("fetching err "+err);
    });
});
app.get('/getsub/:id',function(req,res){
	var request=new db.Request();
	request.input('subr_no_i', sql.Int(20), req.params.id);
	request.query('select * from tblmastsubscriber where subr_no_i=@subr_no_i').then(function(recordset) {
		//console.log("pass "+recordset[0].mob_password_vc);
		res.json(recordset);
		
		
    }).catch(function(err) {
		console.log("fetching err "+err);
    });
});