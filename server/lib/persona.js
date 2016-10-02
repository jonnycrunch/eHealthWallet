import bigi from 'bigi'
import * as bsProfiles from 'blockstack-profiles'
import bitcoinjsLib from 'bitcoinjs-lib'
import uportRegistry from 'uport-registry'

// consensysnet registry address, default for now
//const DEFAULT_REGISTRY_ADDRESS = '0xa9be82e93628abaac5ab557a9b3b02f711c0151c'  # this is on consenys network 
const DEFAULT_REGISTRY_ADDRESS = '0x978997974d1d6e0bd2afb20df7602a1554d8780e'
/** Class representing a persona. */
class Persona {

  /**
   *  Class constructor.
   *  Creates a new persona object. The registryAddress is an optional argument and if not specified will be set to the default consensys testnet uport-registry.
   *
   *  @memberof Persona#
   *  @method          constructor
   *  @param           {String}         address                                                             the address of the persona
   *  @param           {String}         ipfsProvider                                                        an ipfs provider
   *  @param           {String}         web3Provider                                                        web3 provider
   *  @param           {String}         [registryAddress='0xa9be82e93628abaac5ab557a9b3b02f711c0151c']      the uport-registry address to use.
   *  @return          {Object}         self
   */
  constructor (personaAddress, ipfs, web3Provider, registryAddress) {
    this.address = personaAddress
    this.tokenRecords = []
    this.uportRegistry = uportRegistry
    if (ipfs && web3Provider) {
      this.uportRegistry.setIpfsProvider(ipfs)
      this.uportRegistry.setWeb3Provider(web3Provider)
    }
    this.registryAddress = registryAddress || DEFAULT_REGISTRY_ADDRESS
  }

  /**
   *  This should be the only function used to get attributes from the uport-registry. This can be overridden in
   *  a subclass.
   *
   *  @memberof Persona#
   *  @method           loadAttributes
   *  @return           {Promise<JSON, Error>}            A promise that returns all claims registered to the persona. Encrypted claims would be included here. Or an Error if rejected.
   */
  loadAttributes () {
    return this.uportRegistry.getAttributes(this.registryAddress, this.address)
  }

  /**
   *  This function always have to be called before interacting with the persona. This function loads the profile of the persona from the uport-registry into the persona object. The only time this function should not be called is when creating a completely new persona.
   *  If the Claims argument is given these claims are used instead of loading anything from the uport-registry.
   *
   *  @memberof Persona#
   *  @method           load
   *  @param            {Object}                    claims          A list of claims. If argument is not given the persona will load from the registry.
   *  @return           {Promise<JSON, Error>}      A promise that returns all claims registered to the persona. Encrypted claims would be included here. Or an Error if rejected.
   */
  load (claims) {
    if (claims) {
      this.tokenRecords = claims
      return Promise.resolve(this.tokenRecords)
    } else {
      return new Promise((resolve, reject) => {
        this.loadAttributes().then((tokens) => {
          this.tokenRecords = tokens
          resolve(tokens)
        })
      })
    }
  }

  /**
   *  This function returns the profile of the persona in JSON format.
   *
   *  @memberof         Persona#
   *  @method           getProfile
   *  @return           {JSON}           profile
   */
  getProfile () {
    // When encryption is implemented this will only give
    // you the part of the profile you have access to.
    let profile = {}

    this.tokenRecords.map((tokenRecord) => {
      let decodedToken = null
      try {
        decodedToken = bsProfiles.verifyTokenRecord(tokenRecord, tokenRecord.decodedToken.payload.issuer.publicKey)
      } catch (e) {
        throw new Error(`decodedToken failed: ${e}`)
      }

      if (decodedToken !== null) {
        profile = Object.assign({}, profile, decodedToken.payload.claim)
      }
    })
    return profile
  }

  /**
   *  Returns the public signing key of the persona.
   *
   *  @memberof Persona#
   *  @method          getPublicSigningKey
   *  @return          {String}
   */
  getPublicSigningKey () {
    return this.getClaims('pubSignKey')[0].decodedToken.payload.claim.pubSignKey
  }

  /**
   *  Returns the public encryption key of the persona, if set.
   *
   *  @memberof Persona#
   *  @method          getPublicEncryptionKey
   *  @return          {String}
   */
  getPublicEncryptionKey () {
    return this.getClaims('pubEncKey')[0].decodedToken.payload.claim.pubEncKey
  }

  /**
   *  Returns all claims associated with the persona.
   *
   *  @memberof Persona#
   *  @method          getAllClaims
   *  @return          {JSON}           List of claims
   */
  getAllClaims () {
    return this.tokenRecords
  }

  /**
   *  Returns all claims that have the given attribute name.
   *
   *  @memberof Persona#
   *  @method          getClaims
   *  @param           {String}         attributesName         the name of the attribute to check
   *  @return          {JSON}           List of claims
   */
  getClaims (attributeName) {
    return this.tokenRecords.filter(Persona.matchesAttributeName(attributeName))
  }

  /**
   *  Signs the given attribute to the persona. This method is to be used by third parties who wishes to attest to an attribute of the persona. Note that this does not add anything to the persona, it only returns a signed claim. To add a claim to a persona the addClaim method of MutablePersona has to be used.
   *
   *  @memberof Persona#
   *  @method          signAttribute
   *  @param           {Object}           attribute          the attribute to add, in the format {attrName: attr}
   *  @param           {String}           privSignKey        the private signing key of the attestor
   *  @param           {String}           issuerId           the address of the attestor (voluntary, to allow finding info on the attestor from uport-registry)
   *  @return          {Object}           claim
   */
  signAttribute (attribute, privSignKey, issuerId) {
    const issuerPublicKey = Persona.privateKeyToPublicKey(privSignKey)

    const issuer = {}
    issuer.publicKey = issuerPublicKey
    if (!issuerId) {
      throw new Error('issuerId has to be set')
    }
    issuer.uportId = issuerId
    const subject = { uportId: this.address }
    subject.publicKey = 'Public key can be read from pubSignKey record.'
    const rawToken = bsProfiles.signToken(attribute, privSignKey, subject, issuer)

    return bsProfiles.wrapToken(rawToken)
  }

  /**
   *  Same as signAttribute but for a list of attributes.
   *
   *  @memberof Persona#
   *  @method          signMultipleAttributes
   *  @param           {Array}                  attribute          the attribute to add, in the format [{attrName: attr},...]
   *  @param           {String}                 privSignKey        the private signing key of the attestor
   *  @param           {String}                 issuerId           the ethereum address of the attestor
   *  @return          {Array}                  List of claims
   */
  signMultipleAttributes (attributes, privSignKey, issuerId) {
    return attributes.map((attribute) => this.signAttribute(attribute, privSignKey, issuerId))
  }

  /**
   *  A static function for checking if a token is valid.
   *
   *  @memberof Persona
   *  @method          isTokenValid
   *  @param           {Object}           token
   *  @return          {Boolean}
   */
  static isTokenValid (token) {
    try {
      // the token has to be valid
      bsProfiles.verifyTokenRecord(token, token.decodedToken.payload.issuer.publicKey)
    } catch (e) {
      return false
    }
    // the uportId has to be present
    return token.decodedToken.payload.issuer.uportId !== undefined
  }

  /**
   *  A static function for checking if a token is valid.
   *
   *  @memberof Persona
   *  @method          privateKeyToPublicKey
   *  @param           {String}                 privateKey
   *  @return          {String}                 publicKey
   */
  static privateKeyToPublicKey (privateKey) {
    const privateKeyBigInteger = bigi.fromBuffer(new Buffer(privateKey, 'hex'))
    const ellipticKeyPair = new bitcoinjsLib.ECPair(privateKeyBigInteger, null, {})
    const publicKey = ellipticKeyPair.getPublicKeyBuffer().toString('hex')

    return publicKey
  }

  static matchesAttributeName (attrName) {
    return (token) => Object.keys(token.decodedToken.payload.claim)[0] === attrName
  }

  static notMatchesAttributeName (attrName) {
    return (token) => Object.keys(token.decodedToken.payload.claim)[0] !== attrName
  }
}

export default Persona
