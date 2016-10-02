import Persona from './persona'

/**
 * Class representing a persona that can be modified.
 * @extends Persona
 * */
class MutablePersona extends Persona {

  /**
   *  This should be the only function ever used to write the persona onto the blockchain. This can be overridden in
   *  a subclass.
   *
   *  It stores whatever is in this.tokenRecords.
   *
   *  @memberof MutablePersona#
   *  @method          writeToRegistry
   *  @return          {Promise<String, Error>}            A promise that returns the txHash of the transaction updating the registry. Or an Error if rejected.
   */
  writeToRegistry () {
    return this.uportRegistry.setAttributes(this.registryAddress, this.tokenRecords, {from: this.address})
  }

  /**
   *  Add a signed claim to this persona. This should be used to add tokens signed by third parties.
   *
   *  @memberof MutablePersona#
   *  @method          addClaim
   *  @param           {JSON}                     claim          the claim to add
   */
  addClaim (claim) {
    if (!Persona.isTokenValid(claim)) {
      throw new Error('Claim is invalid, and thus not added.')
    }
    this.tokenRecords.push(claim)
  }

  /**
   *  Add mulitple signed claims to this persona. This should be used to add tokens signed by third parties.
   *
   *  @memberof MutablePersona#
   *  @method          addClaims
   *  @param           {JSON}                     claimList          the claims to add
   */
  addClaims (claimList) {
    for (let claim of claimList) {
      this.addClaim(claim)
    }
  }

  /**
   *  Removes a signed claim from a persona.
   *
   *  @memberof MutablePersona#
   *  @method          removeClaim
   *  @param           {JSON}                     claim          the claim to remove
   */
  removeClaim (claim) {
    let idx = this.tokenRecords.indexOf(claim)
    if (idx === -1) {
      throw new Error('No such claim associated with this persona.')
    }
    this.tokenRecords.splice(idx)
  }

  /**
   *  Adds a self signed attribute to the persona. Only to be used if you own the privSignKey of this persona.
   *
   *  @memberof MutablePersona#
   *  @method          addAttribute
   *  @param           {Object}                     attribute          the attribute to add, in the format {attrName: attr}
   *  @param           {String}                     privSignKey        the private signing key of the persona
   */
  addAttribute (attribute, privSignKey) {
    if (!attribute.pubSignKey &&
        this.getProfile().pubSignKey !== Persona.privateKeyToPublicKey(privSignKey)) {
      throw new Error('The private key used must match the one set in the persona.')
    }
    const token = this.signAttribute(attribute, privSignKey, this.address)
    this.addClaim(token)
  }

  /**
   *  Removes all tokens having the same attribute name as the given attribute and adds the given attribute.
   *
   *  @memberof MutablePersona#
   *  @method          replaceAttribute
   *  @param           {Object}                     attribute          the attribute to add, in the format {attrName: attr}
   *  @param           {String}                     privSignKey        the private signing key of the persona
   */
  replaceAttribute (attribute, privSignKey) {
    const attributeName = Object.keys(attribute)[0]
    this.removeAttribute(attributeName)
    this.addAttribute(attribute, privSignKey)
  }

  /**
   *  Removes all attributes with the same attribute name as the given attribute.
   *
   *  @memberof MutablePersona#
   *  @method          removeAttribute
   *  @param           {Object}                     attribute          the attribute to add, in the format {attrName: attr}
   */
  removeAttribute (attributeName) {
    this.tokenRecords = this.tokenRecords.filter(Persona.notMatchesAttributeName(attributeName))
  }

  /**
   *  Sets the public signing key of the persona.
   *
   *  @memberof MutablePersona#
   *  @method       setPublicSigningKey
   *  @param        {String}                        privSignKey         the private signing key of the persona
   */
  setPublicSigningKey (privSignKey) {
    let pub = Persona.privateKeyToPublicKey(privSignKey)
    this.replaceAttribute({pubSignKey: pub}, privSignKey)
  }

  /**
   *  Sets the public encryption key of the persona.
   *
   *  @memberof MutablePersona#
   *  @method       setPublicencryptionKey
   *  @param        {String}                        pubEncKey           the public encryption key of the persona
   *  @param        {String}                        privSignKey         the private signing key of the persona
   */
  setPublicEncryptionKey (pubEncKey, privSignKey) {
    this.replaceAttribute({pubSignKey: pubEncKey}, privSignKey)
  }
}

export default MutablePersona
