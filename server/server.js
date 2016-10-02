var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var fs = require('fs'); 
var request = require('request');

let MutablePersona = require('./dist/mutablePersona.js').default; 
let Persona = require('./dist/persona.js').default; 
let Web3 = require('web3'); 
let ipfsApi = require('ipfs-api'); 
let web3 = new Web3(); 
let web3Prov = new web3.providers.HttpProvider('http://10.0.1.80:8545') // this is not the active stream 
let myWeb3 = new Web3( )
myWeb3.setProvider(new web3.providers.HttpProvider('http://10.0.1.80:8545'));  // this is now set 
let ipfsProv = ipfsApi('localhost', 5001)
let crypto = require('crypto');
var hashclient = require('hashapi-lib-node');
var shh = myWeb3.shh;  // set the whisper client 
// this needs to be in env variable 
var T_username = process.env.TIERION_USER ;
var T_password = process.env.TIERION_PASS ; 
var hashClient = new hashclient();


var T_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU3ZWZlMzM3M2IwZGIyMjE3ZTEwOTc4NSIsInJscyI6MywicmxoIjoxMDAwLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNDc1Mzg1NTU3LCJleHAiOjE0NzUzODkxNTcsImp0aSI6IjQyNGYyZWQ0Y2Y3YWQ1ZDE2ZjQ5MGU5ZTNkZGUyNWE5MTQ2NjJjYWEifQ.jCFvT0euMnuVjMMRqFuU30MWF18gsPLjxrbClAXajjc';   
var t_rtoken = '91949a904467c8f5c2692b4f5097ba91b00c80aa'; 
// basic test of the hash function to authenticate properly 



// context for relationships in smart contract: http://hl7.org/fhir/v3/RoleCode  :  value where value could ONESELF or SPS or HUSB 

// need to store password for encrypted data on the client side

// on creating the profile in the client, store the json web token for future validation of the identy as a pseudo openID connect validation server 


// Tierion will be used to create an audit trail for logging who accessed the restful API, storing the hash 
// of the JSON bundle, along with the uport address of the person who was accessing it,  { accessor : eth_addr , fhir_payload : bundle, url: fhir_url  }
// where the fhir_payload is the raw data from FHIR server 
hashClient.authenticate(T_username, T_password, function(err, authToken){
    if(err) {
        console.log("I'm sorry Dave, my systems are not working!"); 
    } else {
        T_token = authToken.access_token; 
        t_rtoken = authToken.refresh_token; 
    }
});


// saved a cached version just to be safe for the hackathon demo 
var fhir_file_conditions1 = '/data/home/distributed_health_hacker/distributed_health_dev/ui/server/fhir_files/conditions1.json'; 
var fhir_file_medications1 = '/data/home/distributed_health_hacker/distributed_health_dev/ui/server/fhir_files/medications1.json'; 
var fhir_file_allergies1 = '/data/home/distributed_health_hacker/distributed_health_dev/ui/server/fhir_files/allergies1.json'; 

var fhir_file_conditions2 = '/data/home/distributed_health_hacker/distributed_health_dev/ui/server/fhir_files/conditions2.json'; 
var fhir_file_medications2 = '/data/home/distributed_health_hacker/distributed_health_dev/ui/server/fhir_files/medications2.json'; 
var fhir_file_allergies2 = '/data/home/distributed_health_hacker/distributed_health_dev/ui/server/fhir_files/allergies2.json'; 


var conditions_url = 'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/Condition?patient=Tbt3KuCY0B5PSrJvCu2j-PlK.aiHsu2xUjUM8bWpetXoB&category=diagnosis' ; 
var medications_url = 'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/MedicationOrder?patient=Tbt3KuCY0B5PSrJvCu2j-PlK.aiHsu2xUjUM8bWpetXoB' ; 
var allergies_url = 'https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/AllergyIntolerance?patient=Tbt3KuCY0B5PSrJvCu2j-PlK.aiHsu2xUjUM8bWpetXoB' ; 


// need to run the promise 
function get_claim(attr, eth_addr, ipfsProv, web3Prov){
    var persona = new Persona(eth_addr, ipfsProv, web3Prov);
    return persona.getClaims(attr); 
}



// just a simple encryption method 
// To DO : use PGP encryption 
function encrypt(string, password, crypto){
    var payload = JSON.stringify(string); 
    const cipher = crypto.createCipher('aes192', password);
    var encrypted = cipher.update(payload, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted; 
}


// just a simple decrypt method
// To DO : use PGP encryption 
function dencrypt(payload, password, crypto){
    var decipher = crypto.createDecipher('aes192', password);
    var decrypted = decipher.update(payload, 'hex', 'utf8');    
    decrypted += decipher.final('utf8');
    var data = JSON.parse(decrypted); 
    return data;  // this is not js object 
}


// need to pass the persona of the requester 
// extract the first_name, last_name, email from person 
function hipaa_log(eth_addr, url){ 
    // call TIERION api and store the person accessing the recource (url)
    
}


// this doesn't actually validate a user
function validate_user(eth_addr, token) {
    var myPersona = new Persona(eth_addr, ipfsProv, web3Prov);
    return myPersona.isTokenValid(token); 
}

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
    var data = JSON.parse(body); 
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
    var data = JSON.parse(body); 
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
    var data = JSON.parse(body); 
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
    var data = JSON.parse(body); 
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
    var data = JSON.parse(body); 
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
    var data = JSON.parse(body); 
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


// need a resource GET endpoint for north clinic 
// returns json in HL7 format that includes health conditions, meds, allergies, genetic testing labs results 


// need a resource GET endpoint for south clinic 
// returns json in HL7 format that includes health conditions, meds, allergies, genetic testing labs results 


// need a post that takes the user address, private key, and claim 
app.post('/api/verifyclaims', jsonParser,  function(req, res) { 
    if (!req.body) return res.sendStatus(400)
    // expects json data as payload including the eth address, private key and the claim  
    // use the uport persona to 
    res.sendStatus(200);  
}); 


// this is saving the health care attribute to the blockchain with storage on ipfs 
app.post('/api/makeclaim', jsonParser,  function(req, res) { 
    if (!req.body) return res.sendStatus(400)
    payload = req.body; 
    var eth_add = payload.address; 
    var claim = payload.claim;  //  this is in json format  
    var myPrivSignKey = payload.privkey;  
    let persona = new MutablePersona(eth_add, ipfsProv, web3Prov); 
    persona.setPublicSigningKey(myPrivSignKey);   // need to translate the priv key to public one 
    persona.addAttribute({ claim }, myPrivSignKey);
    persona.writeToRegistry().then((txHash) => { 
        console.log(txHash); 
        res.sendStatus(200);  
    });
});


app.post('/api/getclaim', jsonParser,  function(req, res) { 
    if (!req.body) return res.sendStatus(400)
    payload = req.body; 
    var eth_add = payload.address; 
    var claim_attr = payload.attr; 
    let persona = new Persona(eth_add, ipfsProv, web3Prov);
    persona.load().then(() => { 
        let profile = persona.getProfile();
        let my_claims = persona.getClaims(claim_attr);
        let field = my_claims[0].decodedToken.payload;  
        console.log(my_claims);   // just dump the entire payload to console. 
        console.log(my_claims[0].decodedToken.payload); 
        res.send(field); 
    });
});


// need a get endpoint that takes a user's email and fetches the claims for an individual, returns json 




app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});