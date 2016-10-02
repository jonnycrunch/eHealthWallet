var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var fs = require('fs'); 
var request = require('request');


var fhir_file_conditions1 = '/data/home/distributed_health_hacker/distributed_health_dev/ui/server/fhir_files/conditions1.json'; 
var fhir_file_medications1 = '/data/home/distributed_health_hacker/distributed_health_dev/ui/server/fhir_files/medications1.json'; 
var fhir_file_allergies1 = '/data/home/distributed_health_hacker/distributed_health_dev/ui/server/fhir_files/allergies1.json'; 

var conditions_url = 'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/Condition?patient=Tbt3KuCY0B5PSrJvCu2j-PlK.aiHsu2xUjUM8bWpetXoB&category=diagnosis' ; 
var medications_url = 'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/MedicationOrder?patient=Tbt3KuCY0B5PSrJvCu2j-PlK.aiHsu2xUjUM8bWpetXoB' ; 
var allergies_url = 'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/AllergyIntolerance?patient=Tbt3KuCY0B5PSrJvCu2j-PlK.aiHsu2xUjUM8bWpetXoB' ; 


// sanity check to make sure api server works
app.get('/', function (req, res) {
  res.send('Hello World!');
});


// example rest end-point for testing api and parsing req.body 
app.post('/api/test', jsonParser, function(req, res) {
    if (!req.body) return res.sendStatus(400)
    res.sendStatus(200);  
});


// example rest end-point for testing api and parsing req.body // repeat for medications and allergies 
app.get('/api/westclinic/conditions', function(req, res) {
    // try getting the live feed using GET 
    var options = {
        url : conditions_url , 
        headers: {
            'Accept': 'application/json'
        }   
    };
    var conditions = [] ;  // just a placeholder to store the conditions. 
    request(options, function (error, response, body) {
    data = JSON.parse(body); 
    if (!error && response.statusCode == 200) {
        data.entry.forEach( function(item, value){ 
            if (item.resource.resourceType === 'Condition' ) { 
                conditions.push( item.resource.code.text) ; 
            }  
        }); 
        res.send(JSON.stringify(conditions) ) ; // then send the json conditions 
    } else {
    var obj = JSON.parse(fs.readFileSync(fhir_file_conditions1, 'utf8'));
    res.send(obj);  
  }
})
});


// example rest end-point for testing api and parsing req.body for medications  
// need to fix parsing the bundle for the real medications 
app.get('/api/westclinic/medications', function(req, res) {
    // try getting the live feed using GET 
    var options = {
        url : medications_url , 
        headers: {
            'Accept': 'application/json'
        }   
    };
    var medications = [] ;  // just a placeholder to store the conditions. 
    request(options, function (error, response, body) {
    data = JSON.parse(body); 
    if (!error && response.statusCode == 200) {
        data.entry.forEach( function(item, value){ 
            if (item.resource.resourceType === 'MedicationOrder' ) { 
                medications.push( item.resource.medicationReference.display) ; 
            }  
        }); 
        res.send(JSON.stringify(medications) ) ; // then send the json conditions 
    } else {
    var obj = JSON.parse(fs.readFileSync(fhir_file_medications1, 'utf8'));
    res.send(obj);  
  }
})
});


// example rest end-point for testing api and parsing req.body for medications  
// need to fix parsing the bundle for the real medications 
app.get('/api/westclinic/allergies', function(req, res) {
    // try getting the live feed using GET 
    var options = {
        url : allergies_url , 
        headers: {
            'Accept': 'application/json'
        }   
    };
    var allergies = [] ;  // just a placeholder to store the conditions. 
    request(options, function (error, response, body) {
    data = JSON.parse(body); 
    if (!error && response.statusCode == 200) {
        data.entry.forEach( function(item, value){ 
            if (item.resource.resourceType === 'AllergyIntolerance' ) { 
                allergies.push( item.resource.substance.text) ; 
            }  
        }); 
        res.send(JSON.stringify(allergies) ) ; // then send the json conditions 
    } else {
    var obj = JSON.parse(fs.readFileSync(fhir_file_allergies1, 'utf8'));
    res.send(obj);  
  }
})
});


// example rest end-point for testing api and parsing req.body // repeat for medications and allergies 
app.get('/api/eastclinic/conditions', function(req, res) {
    // try getting the live feed using GET 
    var options = {
        url : conditions_url , 
        headers: {
            'Accept': 'application/json'
        }   
    };
    var conditions = [] ;  // just a placeholder to store the conditions. 
    request(options, function (error, response, body) {
    data = JSON.parse(body); 
    if (!error && response.statusCode == 200) {
        data.entry.forEach( function(item, value){ 
            if (item.resource.resourceType === 'Condition' ) { 
                conditions.push( item.resource.code.text) ; 
            }  
        }); 
        res.send(JSON.stringify(conditions) ) ; // then send the json conditions 
    } else {
    var obj = JSON.parse(fs.readFileSync(fhir_file_conditions1, 'utf8'));
    res.send(obj);  
  }
})
});


// example rest end-point for testing api and parsing req.body for medications  
// need to fix parsing the bundle for the real medications 
app.get('/api/eastclinic/medications', function(req, res) {
    // try getting the live feed using GET 
    var options = {
        url : medications_url , 
        headers: {
            'Accept': 'application/json'
        }   
    };
    var medications = [] ;  // just a placeholder to store the conditions. 
    request(options, function (error, response, body) {
    data = JSON.parse(body); 
    if (!error && response.statusCode == 200) {
        data.entry.forEach( function(item, value){ 
            if (item.resource.resourceType === 'MedicationOrder' ) { 
                medications.push( item.resource.medicationReference.display) ; 
            }  
        }); 
        res.send(JSON.stringify(medications) ) ; // then send the json conditions 
    } else {
    var obj = JSON.parse(fs.readFileSync(fhir_file_medications1, 'utf8'));
    res.send(obj);  
  }
})
});


// example rest end-point for testing api and parsing req.body for medications  
// need to fix parsing the bundle for the real medications 
app.get('/api/eastclinic/allergies', function(req, res) {
    // try getting the live feed using GET 
    var options = {
        url : allergies_url , 
        headers: {
            'Accept': 'application/json'
        }   
    };
    var allergies = [] ;  // just a placeholder to store the conditions. 
    request(options, function (error, response, body) {
    data = JSON.parse(body); 
    if (!error && response.statusCode == 200) {
        data.entry.forEach( function(item, value){ 
            if (item.resource.resourceType === 'AllergyIntolerance' ) { 
                allergies.push( item.resource.substance.text) ; 
            }  
        }); 
        res.send(JSON.stringify(allergies) ) ; // then send the json conditions 
    } else {
    var obj = JSON.parse(fs.readFileSync(fhir_file_allergies1, 'utf8'));
    res.send(obj);  
  }
})
});


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