var express = require('express');
var router = express.Router();

const mariadb = require('mariadb');


router.get('/',  function(req, res, next) {

    if(req.query.userId === undefined){
        res.send(" Please define a userId to get request");
    }else{

        var queryTxt ="";

        queryTxt +=' SELECT o.apexValue as obsvLabel, o.date as obsvDateInMs, o.latitude as obsvLat, o.longitude as obsvLng'
        queryTxt +=' , s.nomParcelle as parcelName, u.name as ownerName, s.globalLatitude as parcelLat, s.globalLongitude as parcelLng'
        queryTxt +=' , s.moyenne as sessionAvgGrowth, s.date as sessionDateInSec'
        queryTxt +=' , u.name as userName' 
        queryTxt +=' FROM User u, Session s, Observation o'
        queryTxt +=' WHERE s.userId = u.idUser and s.idSession = o.sessionId'
        queryTxt +=' and o.latitude != 0 and o.longitude != 0 and s.globalLatitude !=0 and s.globalLongitude !=0'
        queryTxt +=' and u.id =  '+req.query.userId;


        let dbDriver = createApexDBDriver ();

        dbDriver.query(queryTxt)
            .then(rows => {
                console.log("user.id: "+req.query.userId);
                // console.log(rows); 
                // res.send(rows);
                res.json(rows);
                deleteApexDBDriver(dbDriver);

            }).catch(err => {
                console.log("not connected due to error: " + err);
                deleteApexDBDriver(dbDriver);

            });

        
           
    }

});


function createApexDBDriver(){
    
    return mariadb.createPool({ socketPath: '/tmp/mysql.sock', database: 'agrotic_apex', user: 'varmant', password: "varmant" });
}

function deleteApexDBDriver(pool){
    pool.end().then(() => {
        console.log("connections have been ended properly");
    }).catch(err => console.error);	
}


module.exports = router;
