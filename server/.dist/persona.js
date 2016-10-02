'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bigi = require('bigi');

var _bigi2 = _interopRequireDefault(_bigi);

var _blockstackProfiles = require('blockstack-profiles');

var bsProfiles = _interopRequireWildcard(_blockstackProfiles);

var _bitcoinjsLib = require('bitcoinjs-lib');

var _bitcoinjsLib2 = _interopRequireDefault(_bitcoinjsLib);

var _uportRegistry = require('uport-registry');

var _uportRegistry2 = _interopRequireDefault(_uportRegistry);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// consensysnet registry address, default for now, but local is 0x978997974d1d6e0bd2afb20df7602a1554d8780e
// var DEFAULT_REGISTRY_ADDRESS = '0xa9be82e93628abaac5ab557a9b3b02f711c0151c';
// should probably pull this from env instead
var DEFAULT_REGISTRY_ADDRESS = '0x5f571225d5991acd5ecb7324167b7877d460ea62';

/** Class representing a persona. */

var Persona = function () {

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
  function Persona(personaAddress, ipfs, web3Provider, registryAddress) {
    _classCallCheck(this, Persona);

    this.address = personaAddress;
    this.tokenRecords = [];
    this.uportRegistry = _uportRegistry2.default;
    if (ipfs && web3Provider) {
      this.uportRegistry.setIpfsProvider(ipfs);
      this.uportRegistry.setWeb3Provider(web3Provider);
    }
    this.registryAddress = registryAddress || DEFAULT_REGISTRY_ADDRESS;
  }

  /**
   *  This should be the only function used to get attributes from the uport-registry. This can be overridden in
   *  a subclass.
   *
   *  @memberof Persona#
   *  @method           loadAttributes
   *  @return           {Promise<JSON, Error>}            A promise that returns all claims registered to the persona. Encrypted claims would be included here. Or an Error if rejected.
   */


  _createClass(Persona, [{
    key: 'loadAttributes',
    value: function loadAttributes() {
      return this.uportRegistry.getAttributes(this.registryAddress, this.address);
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

  }, {
    key: 'load',
    value: function load(claims) {
      var _this = this;

      if (claims) {
        this.tokenRecords = claims;
        return Promise.resolve(this.tokenRecords);
      } else {
        return new Promise(function (resolve, reject) {
          _this.loadAttributes().then(function (tokens) {
            _this.tokenRecords = tokens;
            resolve(tokens);
          });
        });
      }
    }

    /**
     *  This function returns the profile of the persona in JSON format.
     *
     *  @memberof         Persona#
     *  @method           getProfile
     *  @return           {JSON}           profile
     */

  }, {
    key: 'getProfile',
    value: function getProfile() {
      // When encryption is implemented this will only give
      // you the part of the profile you have access to.
      var profile = {};

      this.tokenRecords.map(function (tokenRecord) {
        var decodedToken = null;
        try {
          decodedToken = bsProfiles.verifyTokenRecord(tokenRecord, tokenRecord.decodedToken.payload.issuer.publicKey);
        } catch (e) {
          throw new Error('decodedToken failed: ' + e);
        }

        if (decodedToken !== null) {
          profile = Object.assign({}, profile, decodedToken.payload.claim);
        }
      });
      return profile;
    }

    /**
     *  Returns the public signing key of the persona.
     *
     *  @memberof Persona#
     *  @method          getPublicSigningKey
     *  @return          {String}
     */

  }, {
    key: 'getPublicSigningKey',
    value: function getPublicSigningKey() {
      return this.getClaims('pubSignKey')[0].decodedToken.payload.claim.pubSignKey;
    }

    /**
     *  Returns the public encryption key of the persona, if set.
     *
     *  @memberof Persona#
     *  @method          getPublicEncryptionKey
     *  @return          {String}
     */

  }, {
    key: 'getPublicEncryptionKey',
    value: function getPublicEncryptionKey() {
      return this.getClaims('pubEncKey')[0].decodedToken.payload.claim.pubEncKey;
    }

    /**
     *  Returns all claims associated with the persona.
     *
     *  @memberof Persona#
     *  @method          getAllClaims
     *  @return          {JSON}           List of claims
     */

  }, {
    key: 'getAllClaims',
    value: function getAllClaims() {
      return this.tokenRecords;
    }

    /**
     *  Returns all claims that have the given attribute name.
     *
     *  @memberof Persona#
     *  @method          getClaims
     *  @param           {String}         attributesName         the name of the attribute to check
     *  @return          {JSON}           List of claims
     */

  }, {
    key: 'getClaims',
    value: function getClaims(attributeName) {
      return this.tokenRecords.filter(Persona.matchesAttributeName(attributeName));
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

  }, {
    key: 'signAttribute',
    value: function signAttribute(attribute, privSignKey, issuerId) {
      var issuerPublicKey = Persona.privateKeyToPublicKey(privSignKey);

      var issuer = {};
      issuer.publicKey = issuerPublicKey;
      if (!issuerId) {
        throw new Error('issuerId has to be set');
      }
      issuer.uportId = issuerId;
      var subject = { uportId: this.address };
      subject.publicKey = 'Public key can be read from pubSignKey record.';
      var rawToken = bsProfiles.signToken(attribute, privSignKey, subject, issuer);

      return bsProfiles.wrapToken(rawToken);
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

  }, {
    key: 'signMultipleAttributes',
    value: function signMultipleAttributes(attributes, privSignKey, issuerId) {
      var _this2 = this;

      return attributes.map(function (attribute) {
        return _this2.signAttribute(attribute, privSignKey, issuerId);
      });
    }

    /**
     *  A static function for checking if a token is valid.
     *
     *  @memberof Persona
     *  @method          isTokenValid
     *  @param           {Object}           token
     *  @return          {Boolean}
     */

  }], [{
    key: 'isTokenValid',
    value: function isTokenValid(token) {
      try {
        // the token has to be valid
        bsProfiles.verifyTokenRecord(token, token.decodedToken.payload.issuer.publicKey);
      } catch (e) {
        return false;
      }
      // the uportId has to be present
      return token.decodedToken.payload.issuer.uportId !== undefined;
    }

    /**
     *  A static function for checking if a token is valid.
     *
     *  @memberof Persona
     *  @method          privateKeyToPublicKey
     *  @param           {String}                 privateKey
     *  @return          {String}                 publicKey
     */

  }, {
    key: 'privateKeyToPublicKey',
    value: function privateKeyToPublicKey(privateKey) {
      var privateKeyBigInteger = _bigi2.default.fromBuffer(new Buffer(privateKey, 'hex'));
      var ellipticKeyPair = new _bitcoinjsLib2.default.ECPair(privateKeyBigInteger, null, {});
      var publicKey = ellipticKeyPair.getPublicKeyBuffer().toString('hex');

      return publicKey;
    }
  }, {
    key: 'matchesAttributeName',
    value: function matchesAttributeName(attrName) {
      return function (token) {
        return Object.keys(token.decodedToken.payload.claim)[0] === attrName;
      };
    }
  }, {
    key: 'notMatchesAttributeName',
    value: function notMatchesAttributeName(attrName) {
      return function (token) {
        return Object.keys(token.decodedToken.payload.claim)[0] !== attrName;
      };
    }
  }]);

  return Persona;
}();

exports.default = Persona;