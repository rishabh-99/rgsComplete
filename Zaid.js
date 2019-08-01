var Jenkins =require('jenkins')({baseUrl: 'http://admin:Alfanzo001@localhost:8081',crumbIssuer: true});




// Jenkins.job.create('example', xml, function(err) {
//     if (err) throw err;
//     console.log("jkldshfkjsdfksjdf")
//   });

  
// Jenkins.info(function(err,data){

//     console.log('info',data);
//});
Jenkins.build.log('example', 1, function(err, data) {
    if (err) throw err;
   
    console.log('log', data);
  });