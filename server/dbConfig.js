let config ={
    host    : '35.205.117.189', // 35.205.117.189 localhost
    user    : 'root', // root varmant
    password: 'varmant', 
    database: 'postsDB'
}

// mysql://root:somepassword@127.0.0.1:3306/database-name


// local   : mysql -h localhost -P 3306 -u varmant -D postsDB -pvarmant

// CLOUD SQL    : mysql -h 35.205.117.189 -u root -D postsDB -pvarmant 
    // Authorized IP added to CLOUD : https://whatismyipaddress.com/ -> 82.253.55.113
    /* Using SSL certificate
        -> generate SSL CA, server and client certificiates from CLOUD SQL
        TESTING the keys
        -> download CA and client certificate to /server/certs/
        -> cd server/certs/
        -> mysql -uroot -p -h 35.205.117.189 \
            --ssl-ca=server-ca.pem \ 
            --ssl-cert=client-cert.pem \
            --ssl-key=client-key.pem


            
            mysql -uroot -pvarmant -D postsDB -h 35.205.117.189 --ssl-ca=server-ca.pem --ssl-cert=client-cert.pem --ssl-key=client-key.pem
            mysql -uroot -pvarmant -D postsDB -h 35.205.117.189
    */


// jawsdb  : mysql -h u3r5w4ayhxzdrw87.cbetxkdyhwsb.us-east-1.rds.amazonaws.com -P 3306 -u o26g9d9n0d5gxrh0 -D b7uimgpe4vm79q7f -pl9cvgav6big68k5p // Authorized IP at home given

// mysql://root:somepassword@127.0.0.1:3306/database-name
// mysql://h43qfmx5xdiv13h2:xe6o175ezzi5kt9v@qbhol6k6vexd5qjs.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/p3kpiyf0lhk32jt9
// mysql -h qbhol6k6vexd5qjs.cbetxkdyhwsb.us-east-1.rds.amazonaws.com -u h43qfmx5xdiv13h2 -pxe6o175ezzi5kt9 -D p3kpiyf0lhk32jt9 --ssl-ca=server/JAWS_DB_certs/rds-combined-ca-bundle.pem
// mysql 


module.exports =config;