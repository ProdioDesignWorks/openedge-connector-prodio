'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _http = require('http2');

var _constant = require('./config/constant');

var _constant2 = _interopRequireDefault(_constant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uuidv4 = require('uuid/v4');
var axios = require('axios');
var querystring = require("querystring");
var https = require("https");
var url = require('url');
var allowCrossDomain = function allowCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
};

var convertObjectIdToString = function convertObjectIdToString(objectID) {
  return objectID.toString().substring(0, 8);
};

var isNull = function isNull(val) {
  if (typeof val === 'string') {
    val = val.trim();
  }
  if (val === undefined || val === null || typeof val === 'undefined' || val === '' || val === 'undefined') {
    return true;
  }
  return false;
};

var masterCredentials = {};

var OpenEdge = function () {
  function OpenEdge(config) {
    _classCallCheck(this, OpenEdge);

    this.config = config;
  }

  _createClass(OpenEdge, [{
    key: 'createMerchant',
    value: function createMerchant(payloadJson) {
      return new Promise(function (resolve, reject) {

        resolve({ "success": true, "body": { "merchant": { "mid": uuidv4() } } });
      });
    }
  }, {
    key: 'updateMerchant',
    value: function updateMerchant(payloadJson) {
      return 'This is from Integrity';
    }
  }, {
    key: 'deleteMerchant',
    value: function deleteMerchant(payloadJson) {
      return 'This is from Integrity';
    }
  }, {
    key: 'getMerchantId',
    value: function getMerchantId(payloadJson) {
      return 'this is tes';
    }
  }, {
    key: 'getMerchantActionvationStatus',
    value: function getMerchantActionvationStatus(payloadJson) {
      return new Promise(function (resolve, reject) {

        resolve({ "success": true, "body": { "activationStatus": true } });
      });
    }
  }, {
    key: 'getMerchantProfile',
    value: function getMerchantProfile(payloadJson) {
      return 'this is test';
    }
  }, {
    key: 'createPayer',
    value: function createPayer(payloadJson) {
      return new Promise(function (resolve, reject) {
        resolve({ "success": true, "body": { "gatewayBuyerId": uuidv4() } });
      });
    }
  }, {
    key: 'editPayer',
    value: function editPayer(payloadJson) {

      return new Promise(function (resolve, reject) {
        resolve({ "success": true, "body": { "gatewayBuyerId": payloadJson["payeeInfo"]["gatewayBuyerId"] } });
      });
    }
  }, {
    key: 'removePayer',
    value: function removePayer(payloadJson) {
      return new Promise(function (resolve, reject) {
        resolve({ "success": true, "body": { "gatewayBuyerId": payloadJson["payeeInfo"]["gatewayBuyerId"] } });
      });
    }
  }, {
    key: 'bulkUploadPayers',
    value: function bulkUploadPayers(payloadJson) {
      return 'this is test';
    }
  }, {
    key: 'makePayment',
    value: function makePayment(payload) {
      console.log("payload", payload.paymentInfo);
      return new Promise(function (resolve, reject) {
        console.log(_typeof(payload.cardInfo.transaction_type));
        console.log(_typeof(payload.cardInfo.entrymode));
        console.log(_typeof(payload.paymentInfo.transactionId));
        console.log(_typeof(payload.paymentInfo.totalAmount));
        var post_data = querystring.stringify({
          // 'account_token': 'C9CBE35FCE67540F328FE4FC8758AF6DCECC24954FB2C4FFE4A24F2B81D95FEA9953BC5CF45601D078',
          'xweb_id': "800000022536",
          'terminal_id': "80031235",
          'auth_key': "UWkZhCx6vK1BTa5DkMOaxMFbpOPo3H8N",
          'transaction_type': payload.cardInfo.transaction_type ? payload.cardInfo.transaction_type : '',
          'entry_mode': payload.cardInfo.entrymode ? payload.cardInfo.entrymode : '',
          'charge_type': 'CREDIT',
          'order_id': payload.paymentInfo.transactionId ? convertObjectIdToString(payload.paymentInfo.transactionId) : '',
          'manage_payer_data': 'true',
          'return_url': payload.paymentInfo.return_url,
          'return_target': '_self',
          'charge_total': payload.paymentInfo.totalAmount ? payload.paymentInfo.totalAmount : '',
          'disable_framing': 'false',
          'bill_customer_title_visible': 'false',
          'bill_first_name_visible': 'false',
          'bill_last_name_visible': 'false',
          'bill_middle_name_visible': 'false',
          'bill_company_visible': 'false',
          'bill_address_one_visible': 'false',
          'bill_address_two_visible': 'false',
          'bill_city_visible': 'false',
          'bill_state_or_province_visible': 'false',
          'bill_country_code_visible': 'false',
          'bill_postal_code_visible': 'false',
          'order_information_visible': 'false',
          'card_information_visible': 'false',
          'card_information_label_visible': 'false',
          'customer_information_visible': 'false'
        });

        var post_options = {
          host: 'ws.test.paygateway.com',
          port: 443,
          path: '/HostPayService/v1/hostpay/transactions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length
          }
        };

        var payment_url = '';
        var post_req = https.request(post_options, function (res) {
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
            console.log('Response:' + chunk);
            var obj = JSON.parse(chunk);
            payment_url = '' + obj.actionUrl + obj.sealedSetupParameters;
            console.log("payment", obj.actionUrl + obj.sealedSetupParameters);
            if (payment_url !== undefined && payment_url !== "" && payment_url !== null) {
              var body = {
                'payRedirectUrl': payment_url,
                'gatewayTransactionId': ''
              };
              resolve({ "success": true, 'body': body });
            } else {
              var errorBody = {
                'payRedirectUrl': '',
                'gatewayTransactionId': ''
              };
              resolve({ "success": false, 'body': errorBody });
            }
          });
        });
        post_req.write(post_data);

        post_req.end();
      });
    }
  }, {
    key: 'getPayersListing',
    value: function getPayersListing(payloadJson) {
      return 'this is test';
    }
  }, {
    key: 'saveCardForPayer',
    value: function saveCardForPayer(payloadJson) {}
  }, {
    key: 'removeCard',
    value: function removeCard(payloadJson) {
      return new Promise(function (resolve, reject) {
        soap.createClient(MASTER_MERCHANT_ACCESS["RecurringURL"], soap_client_options, function (err, client) {
          //  TODO : Here we have to use newly created merchant Info and not master info.
          var cardNumber = payloadJson["cardInfo"]["cardNumber"];
          cardNumber = cardNumber.replace(" ", "").replace(" ", "").replace(" ", "");

          var cardHolderName = payloadJson["cardInfo"]["cardHolderName"];
          var expDate = payloadJson["cardInfo"]["expDate"];

          var creditCardInfo = {
            "Username": MASTER_MERCHANT_ACCESS["UserName"],
            "Password": MASTER_MERCHANT_ACCESS["Password"],
            "TransType": "DELETE",
            "Vendor": MASTER_MERCHANT_ACCESS["Vendor"],
            "CustomerKey": payloadJson["payerInfo"]["gatewayBuyerId"],
            "CardInfoKey": payloadJson["cardInfo"]["gatewayCardId"],
            "CcAccountNum": cardNumber,
            "CcExpDate": expDate,
            "CcNameOnCard": cardHolderName,
            "CcStreet": "",
            "CcZip": "",
            "ExtData": ""
          };

          try {
            client.ManageCreditCardInfo(creditCardInfo, function (err, result, body) {
              console.log(JSON.stringify(result) + ":::" + result["ManageCreditCardInfoResult"]["CcInfoKey"]);
              if (result && _typeof(result["ManageCreditCardInfoResult"]) !== undefined && _typeof(result["ManageCreditCardInfoResult"]["CcInfoKey"]) !== undefined) {
                resolve({
                  "success": true,
                  "body": { "gatewayCardId": result["ManageCreditCardInfoResult"]["CcInfoKey"] }
                });
              } else {
                reject({ "success": false, "message": err });
              }
            });
          } catch (err) {
            reject({ "success": false, "message": err });
          }
        });
      });
    }
  }, {
    key: 'getPayersTransactions',
    value: function getPayersTransactions(payloadJson) {
      return 'this is test';
    }
  }]);

  return OpenEdge;
}();

exports.default = OpenEdge;