'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _persona = require('./persona');

var _persona2 = _interopRequireDefault(_persona);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class representing a persona that can be modified.
 * @extends Persona
 * */
var MutablePersona = function (_Persona) {
  _inherits(MutablePersona, _Persona);

  function MutablePersona() {
    _classCallCheck(this, MutablePersona);

    return _possibleConstructorReturn(this, (MutablePersona.__proto__ || Object.getPrototypeOf(MutablePersona)).apply(this, arguments));
  }

  _createClass(MutablePersona, [{
    key: 'writeToRegistry',


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
    value: function writeToRegistry() {
      return this.uportRegistry.setAttributes(this.registryAddress, this.tokenRecords, { from: this.address });
    }

    /**
     *  Add a signed claim to this persona. This should be used to add tokens signed by third parties.
     *
     *  @memberof MutablePersona#
     *  @method          addClaim
     *  @param           {JSON}                     claim          the claim to add
     */

  }, {
    key: 'addClaim',
    value: function addClaim(claim) {
      if (!_persona2.default.isTokenValid(claim)) {
        throw new Error('Claim is invalid, and thus not added.');
      }
      this.tokenRecords.push(claim);
    }

    /**
     *  Add mulitple signed claims to this persona. This should be used to add tokens signed by third parties.
     *
     *  @memberof MutablePersona#
     *  @method          addClaims
     *  @param           {JSON}                     claimList          the claims to add
     */

  }, {
    key: 'addClaims',
    value: function addClaims(claimList) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = claimList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var claim = _step.value;

          this.addClaim(claim);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     *  Removes a signed claim from a persona.
     *
     *  @memberof MutablePersona#
     *  @method          removeClaim
     *  @param           {JSON}                     claim          the claim to remove
     */

  }, {
    key: 'removeClaim',
    value: function removeClaim(claim) {
      var idx = this.tokenRecords.indexOf(claim);
      if (idx === -1) {
        throw new Error('No such claim associated with this persona.');
      }
      this.tokenRecords.splice(idx);
    }

    /**
     *  Adds a self signed attribute to the persona. Only to be used if you own the privSignKey of this persona.
     *
     *  @memberof MutablePersona#
     *  @method          addAttribute
     *  @param           {Object}                     attribute          the attribute to add, in the format {attrName: attr}
     *  @param           {String}                     privSignKey        the private signing key of the persona
     */

  }, {
    key: 'addAttribute',
    value: function addAttribute(attribute, privSignKey) {
      if (!attribute.pubSignKey && this.getProfile().pubSignKey !== _persona2.default.privateKeyToPublicKey(privSignKey)) {
        throw new Error('The private key used must match the one set in the persona.');
      }
      var token = this.signAttribute(attribute, privSignKey, this.address);
      this.addClaim(token);
    }

    /**
     *  Removes all tokens having the same attribute name as the given attribute and adds the given attribute.
     *
     *  @memberof MutablePersona#
     *  @method          replaceAttribute
     *  @param           {Object}                     attribute          the attribute to add, in the format {attrName: attr}
     *  @param           {String}                     privSignKey        the private signing key of the persona
     */

  }, {
    key: 'replaceAttribute',
    value: function replaceAttribute(attribute, privSignKey) {
      var attributeName = Object.keys(attribute)[0];
      this.removeAttribute(attributeName);
      this.addAttribute(attribute, privSignKey);
    }

    /**
     *  Removes all attributes with the same attribute name as the given attribute.
     *
     *  @memberof MutablePersona#
     *  @method          removeAttribute
     *  @param           {Object}                     attribute          the attribute to add, in the format {attrName: attr}
     */

  }, {
    key: 'removeAttribute',
    value: function removeAttribute(attributeName) {
      this.tokenRecords = this.tokenRecords.filter(_persona2.default.notMatchesAttributeName(attributeName));
    }

    /**
     *  Sets the public signing key of the persona.
     *
     *  @memberof MutablePersona#
     *  @method       setPublicSigningKey
     *  @param        {String}                        privSignKey         the private signing key of the persona
     */

  }, {
    key: 'setPublicSigningKey',
    value: function setPublicSigningKey(privSignKey) {
      var pub = _persona2.default.privateKeyToPublicKey(privSignKey);
      this.replaceAttribute({ pubSignKey: pub }, privSignKey);
    }

    /**
     *  Sets the public encryption key of the persona.
     *
     *  @memberof MutablePersona#
     *  @method       setPublicencryptionKey
     *  @param        {String}                        pubEncKey           the public encryption key of the persona
     *  @param        {String}                        privSignKey         the private signing key of the persona
     */

  }, {
    key: 'setPublicEncryptionKey',
    value: function setPublicEncryptionKey(pubEncKey, privSignKey) {
      this.replaceAttribute({ pubSignKey: pubEncKey }, privSignKey);
    }
  }]);

  return MutablePersona;
}(_persona2.default);

exports.default = MutablePersona;