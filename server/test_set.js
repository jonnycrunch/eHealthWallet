// just a sanity check that I can save date to the block chain 

let MutablePersona = require('./dist/mutablePersona.js').default

let Web3 = require('web3')

let ipfsApi = require('ipfs-api')

let web3 = new Web3()

let web3Prov = new web3.providers.HttpProvider('http://10.0.1.80:8545')

//var web3 = new Web3(new Web3.providers.HttpProvider("http://10.0.1.80:8545"));

let ipfsProv = ipfsApi('localhost', 5001)

let myAddr = '0xf25a8c2ec057db9f7f644e7d2a50146f4f21db2b'

let persona = new MutablePersona(myAddr, ipfsProv, web3Prov)

let myPrivSignKey = 'f7596060102c0274dd1ae250c4784b65b46583f76471f0c2231dcfb1dcb10fe2'

persona.setPublicSigningKey(myPrivSignKey)

persona.addAttribute({ 'name': 'jonnycrunch' }, myPrivSignKey);

persona.writeToRegistry().then((txHash) => { console.log(txHash) });

