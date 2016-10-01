var express = require('express');
var app = express();



// sanity check 
app.get('/', function (req, res) {
  res.send('Hello World!');
});


// need a resource endpoint for westclinic
// returns json in HL7 format that includes health conditions, meds, allergies, genetic testing labs results 


// need a resource GET endpoint for east clinic 
// returns json in HL7 format that includes health conditions, meds, allergies, genetic testing labs results 


// need a resource GET endpoint for north clinic 
// returns json in HL7 format that includes health conditions, meds, allergies, genetic testing labs results 


// need a resource GET endpoint for south clinic 
// returns json in HL7 format that includes health conditions, meds, allergies, genetic testing labs results 


// need a post that takes the user address, private key, and claim 


// need a get endpoint that takes a user's email and fetches the claims for an individual, returns json 


// 


app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});