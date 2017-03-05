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

app.get('/getsubscribers',function(req,res){
	var request=new db.Request();
	//request.input('subr_no_i', sql.Int(20), req.params.id);
	request.query('select brn_id_vc ,grp_name_vc ,isnull(subr_no_i,0) as subr_no_i ,isnull(subr_name_vc,0) as subr_name_vc,isnull(subr_mobile_vc,subr_phno_vc) as subr_mobile_vc from tblmastsubscriber').then(function(recordset) {
		//console.log("pass "+recordset[0].mob_password_vc);
		res.json(recordset);
		
		
    }).catch(function(err) {
		console.log("fetching err "+err);
    });
});

app.post('/getinstallments',function(req,res){
	var request=new db.Request();
	request.input('brn_id_vc', sql.VarChar(20), req.body.selectedbranch);
	request.input('grp_name_vc', sql.VarChar(20), req.body.selectedgroup);
	request.input('subr_no_i', sql.Int(20), req.body.selectedsub);
	
	request.query('select max(adj_end_inst_i) as adj_end_inst_i from tbltrnreceipts where brn_id_vc =@brn_id_vc AND grp_name_vc =@grp_name_vc AND subr_no_i =@subr_no_i').then(function(recordset) {
		console.log("kjn "+recordset[0].adj_end_inst_i);
		request.input('auc_no_i', sql.Int(20), recordset[0].adj_end_inst_i);
		request.query('select convert(varchar(10), auc_date_d,103) as auc_date_d,auc_no_i,auc_intamount_n from tbltrnauctions where brn_id_vc =@brn_id_vc AND grp_name_vc =@grp_name_vc AND auc_no_i>@auc_no_i').then(function(record){
				//res.send(record);
				request.query('select isnull(sum(isnull(auc_intamount_n,0)),0) as auc_intamount_n from tbltrnauctions where brn_id_vc =@brn_id_vc AND grp_name_vc =@grp_name_vc AND auc_no_i>@auc_no_i').then(function(count){
				//res.send(record);
					res.json({"data":record,"count":count});
				}).catch(function(err){
					console.log("er "+err);
				}); 
		}).catch(function(err){
			console.log("er "+err);
		}); 
		//res.send(recordset);
	}).catch(function(err) {
		console.log("fetching err "+err);
    });
});

app.post('/getinstallments1',function(req,res){
	var request=new db.Request();
	request.input('brn_id_vc', sql.VarChar(20), req.body.selectedbranch);
	request.input('grp_name_vc', sql.VarChar(20), req.body.selectedgroup);
	request.input('subr_no_i', sql.Int(20), req.body.selectedsub);
	request.query('select max(adj_end_inst_i) as adj_end_inst_i from tbltrnreceipts where brn_id_vc =@brn_id_vc AND grp_name_vc =@grp_name_vc AND subr_no_i =@subr_no_i').then(function(recordset) {
		console.log("auc "+recordset[0].adj_end_inst_i);
		request.input('auc_no_i', sql.Int(20), recordset[0].adj_end_inst_i);
	request.query('select count(*) from tbltrnauctions where brn_id_vc =@brn_id_vc AND grp_name_vc =@grp_name_vc AND subr_no_i =@subr_no_i').then(function(recordset1) {
		console.log("kjn "+recordset1[0]);
		request.input('auc_no_i', sql.Int(20), recordset[0].adj_end_inst_i);
		if(recordset1==0){
			request.query('select convert(varchar(10),auc_duedate_d,103) as auc_duedate_d,auc_no_i,convert(int,auc_intamount_n) as auc_intamount_n ,penalty  from npspenalty where brn_id_vc =@brn_id_vc AND grp_name_vc =@grp_name_vc AND auc_no_i >@auc_no_i').then(function(record) {
				//res.json(re);
				request.query('select isnull(sum(isnull(auc_intamount_n,0)),0) as auc_intamount_n from tbltrnauctions where brn_id_vc =@brn_id_vc AND grp_name_vc =@grp_name_vc AND auc_no_i>@auc_no_i').then(function(amount){
					request.query('select isnull(dbo.subrpaidamount (@brn_id_vc,@grp_name_vc,@subr_no_i),0) as subrcramount').then(function(credit){
						var penalityamount=0;
						record.forEach(function(re){
							penalityamount=penalityamount+re.penalty;
						});
						res.json({"data":record,"count":amount,"creditamount":credit,"penalityamount":penalityamount});
					}).catch(function(err){
						console.log("err "+err);
					});
					
				}).catch(function(err){
					console.log("scsk "+err);
				});
			}).catch(function(err){
				console.log("err"+err);
			});
		}else{
			request.query('select convert(varchar(10),auc_duedate_d,103) as auc_duedate_d,auc_no_i,convert(int,auc_intamount_n) as auc_intamount_n ,penalty  from pspenalty where brn_id_vc =@brn_id_vc AND grp_name_vc =@grp_name_vc AND auc_no_i >@auc_no_i').then(function(record) {
				//console.log("jj");
				//res.json(re);
				request.query('select isnull(sum(isnull(auc_intamount_n,0)),0) as auc_intamount_n from tbltrnauctions where brn_id_vc =@brn_id_vc AND grp_name_vc =@grp_name_vc AND auc_no_i>@auc_no_i').then(function(amount){
					//res.json({"data":record,"count":amount});
					request.query('select isnull(dbo.subrpaidamount (@brn_id_vc,@grp_name_vc,@subr_no_i),0) as subrcramount').then(function(credit){
						var penalityamount=0;
						record.forEach(function(re){
							penalityamount=penalityamount+re.penalty;
						});
						res.json({"data":record,"count":amount,"creditamount":credit,"penalityamount":penalityamount});
					}).catch(function(err){
						console.log("err "+err);
					});
				}).catch(function(err){
					console.log("scsk "+err);
				});
			}).catch(function(err){
				console.log("err"+err);
			});
		}
		//res.send(recordset);
	}).catch(function(err) {
		console.log("fetching err "+err);
    });
	}).catch(function(err){
		console.log("hbj "+err);
	});
});

app.get('/search/:text',function(req,res){
	var request=new db.Request();
	console.log('dcds '+req.params.text);
	request.input('text', sql.VarChar(20), req.params.text);
	var value=req.params.text;
	var query="select brn_id_vc ,grp_name_vc ,isnull(subr_no_i,0) as subr_no_i ,isnull(subr_name_vc,0) as subr_name_vc,isnull(subr_mobile_vc,subr_phno_vc) as subr_mobile_vc from tblmastsubscriber where (subr_mobile_vc LIKE '%"+req.params.text+"%' OR subr_name_vc LIKE '%"+req.params.text+"%' OR subr_phno_vc LIKE '%"+req.params.text+"%')";
	request.query(query).then(function(re){
		res.send(re);
	}).catch(function(err){
		console.log("err "+err);
	});
});

app.post('/pay',function(req,res){
	var request=new db.Request();
	var d = new Date();
    var n = d.toLocaleString();
	console.log("err "+req.body.amount);
	//console.log('dcds '+req.params.text);
	request.input('brn_id_vc', sql.VarChar(20), req.body.branch);
	request.input('grp_name_vc', sql.VarChar(20), req.body.group);
	request.input('subr_no_i', sql.Int(20), req.body.sub);
	request.input('rec_date_d',sql.Date,n);
	request.input('ent_date_d',sql.Date,n);
	request.input('rec_amount_n',sql.Numeric,req.body.amount);
	//var value=req.params.text;
	request.query('select (isnull(max(isnull(rec_number_n,0)),0) + 1) as rec_number_n from tblmobiledata').then(function(primary){
		console.log("sc "+primary[0].rec_number_n)
		request.input('rec_number_n',sql.Numeric,primary[0].rec_number_n);
		var query='insert into tblmobiledata (brn_id_vc ,grp_name_vc ,subr_no_i ,subr_part_i ,rec_date_d ,ent_date_d ,rec_amount_n ,rec_otheramount_n,coll_id_n,rec_number_n) values (@brn_id_vc,@grp_name_vc,@subr_no_i,0,@rec_date_d,@ent_date_d,@rec_amount_n,0,1,@rec_number_n)';
	request.query(query).then(function(re){
		console.log("statusCode: ", res.statusCode);
		if(res.statusCode='200'){
			res.json({"message":"Payment is success","status":200});
		}else{
			res.json({"message":"Payment failed","status":202});
		}
		res.send(re);
	}).catch(function(err){
		console.log("errn "+err);
	});
	}).catch(function(err){
		console.log("errk "+err);
	});
	
});

app.get('/getpayments',function(req,res){
	var request=new db.Request();
	request.query('select * from tblmobiledata').then(function(re){
		res.send(re);
	}).catch(function(err){
		console.log("err "+err);
	});
});