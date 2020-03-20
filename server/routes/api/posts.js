const express = require('express')
const router = express.Router();

// bring a driver



require('dotenv').config()
const mariadb = require('mariadb')

// in old version I was dealing with db connection config file now we are using .env see after
// const dbConfig = require('./../../dbConfig.js');
// const pool = mariadb.createPool(dbConfig);

// // url package is a built-in Node.js package.
// const { URL } = require('url')

// const getDatabaseConnectionConfig = () => {
//     // Parse a database url, and destructure the result.
//     // The database url should be similar to this:
//     // mysql://root:somepassword@127.0.0.1:3306/database-name
//     const {
//       username: user,
//       password,
//       port,
//       hostname: host,
//       pathname = ''
//     } = new URL(process.env.DATABASE_URL)

//     console.log(user);
//     console.log(password);
//     console.log(port);
//     console.log(host);

//     console.log(new URL(process.env.DATABASE_URL));

//     // Prepare connection configuration for mysql.
//     return {
//       user,
//       password,
//       host,
//       port,
//       database: pathname.replace('/', '')
//     }
//   }

// const getSSLConfiguration = () => {
//     if (!process.env.SSL_CA || !process.env.SSL_CERT || !process.env.SSL_KEY) {
//       return {}
//     }
//     console.log('prepare SSL Connection');
    
//     return {
//       ssl: {
//         // This is an important step into making the keys work. When loaded into
//         // the environment the \n characters will not be actual new-line characters.
//         // so the .replace() calls fixes that.
//         // ca: fs.readFileSync(process.env.SSL_CA).replace(/\\n/g, '\n'),
//         ca: process.env.SSL_CA.replace(/\\n/g, '\n'),
//         cert: process.env.SSL_CERT.replace(/\\n/g, '\n'),
//         key: process.env.SSL_KEY.replace(/\\n/g, '\n')

//       }
//     }
// }

// url package is a built-in Node.js package.
const { URL } = require('url');
const fs = require("fs");
const sslConnectionConfig = () => {

    // urlElmts = new URL(process.env.DATABASE_URL); // "mysql://root:varmant@35.205.117.189:3306/postsDB"
    urlElmts = new URL("mysql://root:varmant@35.205.117.189:3306/postsDB");

    // const serverCert = [fs.readFileSync(process.env.SSL_CA, "utf8")];
    // const clientKey = [fs.readFileSync(process.env.SSL_KEY, "utf8")];
    // const clientCert = [fs.readFileSync(process.env.SSL_KEY, "utf8")];

    return {
        user: urlElmts.username,
        password: urlElmts.password,
        host: urlElmts.hostname,
        port: urlElmts.port,
        database: urlElmts.pathname.replace('/', ''),
        // ssl:{
        //     ca: serverCert,
	    //     cert: clientCert,
	    //     key: clientKey
        // }
    }
}
  

// const pool = mariadb.createPool(getDatabaseConnectionConfig(),getSSLConfiguration());
const pool = mariadb.createPool(sslConnectionConfig());

router.get('/', function(req, res, next) {
    
    const queryTxt = " SELECT * FROM posts ";
    const params =[req.body.userName];
    execQuery(queryTxt,params).then(rows => res.json(rows));

});



router.post('/', function(req, res, next) {

    if (req.body.transaction === "select")
        if (req.body.userName === undefined) {
            res.send(" Please specify a userName to the request");
        } else {
        const queryTxt = " SELECT * FROM posts WHERE UserName = ?";
        const params =[req.body.userName];
        execQuery(queryTxt,params).then(rows => res.json(rows));
    }

    if (req.body.transaction === "update") {

        if (req.body.postId === undefined) {
            res.send(" Please define a userName to get request");
        } else {
            const id = req.body.postId;

            let updateConditions = "";
            let params = [];
            
            if(req.body.userName!==undefined){
                updateConditions=updateConditions+ " UserName=?";
                params.push(req.body.userName);
            }

            if(req.body.text!==undefined){
                let possible_comma = (updateConditions ==="")?"":",";
                updateConditions=updateConditions+ possible_comma+" Text=?";
                params.push(req.body.text);
            }

            if(req.body.dateTimeInMs!==undefined){
                let possible_comma = (updateConditions ==="")?"":",";
                updateConditions=updateConditions+ possible_comma+" DateTimeInMs=?";
                params.push(req.body.dateTimeInMs);
            }
            
            if (updateConditions !== ""){
                const queryTxt = " UPDATE posts"
                + " SET "+updateConditions
                + " WHERE Id = " + id+" ;";

                console.log(queryTxt);
                console.log(`params userName:${req.body.userName} text:${req.body.text} dateInMs:${req.body.dateTimeInMs}`);

                execQuery(queryTxt,params).then(rows => res.json(rows));
            }

            

        }

    }

    if (req.body.transaction === "insert") {

        if (req.body.userName === undefined) {
            res.send(" Please define a userName ");
        } else {
            
            const userName = req.body.userName? req.body.userName:null;
            const text =  req.body.text?req.body.text:null;
            const dateInMs =  req.body.dateInMs?req.body.dateInMs:null;

            const queryTxt = " INSERT INTO posts VALUE (null,?,?,?)";
            const params = [userName,text,dateInMs];

            console.log(queryTxt);
            console.log(`params userName:${userName} text:${text} dateInMs:${dateInMs}`);

            execQuery(queryTxt,params).then(rows => res.json(rows));
        }

    }

    if (req.body.transaction === "callInsertPost") {

        if (req.body.userName === undefined) {
            res.send(" Please define a userName ");
        } else {
            
            const userName = req.body.userName? req.body.userName:null;
            const text =  req.body.text?req.body.text:null;
            const dateInMs =  req.body.dateInMs?req.body.dateInMs:null;


            const queryTxt = "CALL insertPost(?,?,?);";
            const params = [userName,text,dateInMs];

            console.log(queryTxt);
            console.log(`params userName:${userName} text:${text} dateInMs:${dateInMs}`);

            execQuery(queryTxt,params).then(rows => res.json(rows));
        }

    }

});

router.delete('/', function(req, res, next) {

    if (req.body.transaction === "delete") {
        if(req.body.postId === undefined){
            res.send(" Please define a postId to be deleted");
        }else{
            const queryTxt ="DELETE FROM posts WHERE Id=?";
            const params = [req.body.postId];
            
            console.log(queryTxt);
            console.log(`params postId: ${req.body.postId}`);

            execQuery(queryTxt,params).then(rows => res.json(rows));

        }
    }
});


async function execQuery(queryTxt,params) {
    let conn;
    let rows;
    try {
        conn = await pool.getConnection();
        rows = await conn.query(queryTxt,params);

        if(rows.affectedRows !== undefined){
            console.log(rows);
        }else{
            console.log("Nunber of returned rows "+rows.length);
        }

    } catch (err) {
        throw err;
    } finally {
        if (conn){
            conn.end();
            return rows;
        }
    }
}



// export the router
module.exports = router;


/**
 * TESTS MADE with POSTMAN
 
POST QUERY SELECT
 select
{
	"transaction": "select",
	"userName": "vincent"
}
ANSWER
[
    {
        "Id": 1,
        "UserName": "vincent",
        "Text": "first post",
        "DateTimeInMs": "7654321"
    },
    {
        "Id": 2,
        "UserName": "vincent",
        "Text": "second post",
        "DateTimeInMs": "7654322"
    }, 
]

POST QUERY INSERT
{
	"transaction": "insert",
	"userName": "Danai",
	"text": "Kalinicta",
	"dateInMs": 765434
}
RESPONSE
{
    "affectedRows": 1,
    "insertId": 11,
    "warningStatus": 0
}


POST QUERY CALLINSERT (Stored Procedure)
{
	"transaction": "callInsertPost",
	"userName": "danana",
	"text": "Kalimera",
	"dateInMs": 765434
}
RESPONSE  Combined the Result of a Select and a Insert  
[
    [
        {
            "LAST_INSERT_ID()": 10
        }
    ],
    {
        "affectedRows": 1,
        "insertId": 0,
        "warningStatus": 0
    }
]


POST QUERY UPDATE
{
	"transaction": "update",
	"postId": 6,
	"userName": "Vincent",
	"text": "Badaboom",
	"dateTimeInMs": 987654
}
RESPONSE
{
    "affectedRows": 1,
    "insertId": 0,
    "warningStatus": 0
}


POST QUERY DELETE
{
	"transaction": "delete",
	"postId": 1
}
RESPONSE
{
    "affectedRows": 1,
    "insertId": 0,
    "warningStatus": 0
}

 
 DATABASE
 
 CREATE TABLE posts ( 
  Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY
  , UserName VARCHAR(50)
  , Text LONG VARCHAR
  , DateTimeInMs LONG
);
DESCRIBE posts;

GRANT ALL PRIVILEGES ON postsDB.* to varmant@'%' IDENTIFIED BY 'varmant';

# create new posts and return the gnerated id

DELIMITER $$

CREATE OR REPLACE PROCEDURE `insertPost`(
  IN uName VARCHAR(50)
  , IN text MEDIUMTEXT
  , IN dateTimeInMs MEDIUMTEXT
  )
BEGIN
    START TRANSACTION;
    INSERT posts VALUES (NULL, uName, text, dateTimeInMs);
    SELECT LAST_INSERT_ID();
    COMMIT;
END $$

DELIMITER ;
 
SHOW PROCEDURE STATUS;

 */