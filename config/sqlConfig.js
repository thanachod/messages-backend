const sql = require('mssql')
// config for database
var config = {
    user: 'sa',
    password: '',
    server: 'localhost/MSSQLSERVER01',
    database: 'testDB'
}

// connect to your database
sql.connect(config, function (err) {
    
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();
       
    // query to the database and get the records
    request.query('select * from Student', function (err, recordset) {
        
        if (err) console.log(err)

        // send records as a response
        res.send(recordset);
        
    });
});