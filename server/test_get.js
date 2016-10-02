let Persona = require('./dist/persona.js').default

let Web3 = require('web3')
let web3 = new Web3()

let ipfsApi = require('ipfs-api')

let myAddr = "0xf25a8c2ec057db9f7f644e7d2a50146f4f21db2b";

let ipfsProv = ipfsApi('localhost', 5001)
let web3Prov = new web3.providers.HttpProvider('http://10.0.1.80:8545')

let persona = new Persona(myAddr, ipfsProv, web3Prov);

persona.load().then(() => { 
    let profile = persona.getProfile();
    let claims = persona.getAllClaims();
    let my_claims = persona.getClaims("name");
    console.log(my_claims[0].decodedToken.payload); 
});