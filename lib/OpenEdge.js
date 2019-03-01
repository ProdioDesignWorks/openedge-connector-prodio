'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _http = require('http2');

var _constant = require('./config/constant');

var _constant2 = _interopRequireDefault(_constant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uuidv4 = require('uuid/v4');
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
    masterCredentials["X_WEB_ID"] = this.config.XwebID;
    masterCredentials["TERMINAL_ID"] = this.config.TerminalID;
    masterCredentials["AUTH_KEY"] = this.config.AuthKey;
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

      return new Promise(function (resolve, reject) {
        var post_data = querystring.stringify({
          'xweb_id': masterCredentials.X_WEB_ID,
          'terminal_id': masterCredentials.TERMINAL_ID,
          'auth_key': masterCredentials.AUTH_KEY,
          'transaction_type': 'CREDIT_CARD',
          'entry_mode': 'KEYED',
          'postback_url': payload.paymentInfo.postback_url ? payload.paymentInfo.postback_url : '',
          'charge_type': 'SALE', //CREDIT
          'order_id': payload.paymentInfo.transactionId ? convertObjectIdToString(payload.paymentInfo.transactionId) : '',
          'manage_payer_data': 'true',
          'order_user_id': payload.paymentInfo.payerId,
          'order_description': 'This is order description',
          //'return_url': 'http://dev.getezpay.com:3010/api/ezpayPaymentTransactions/receiveOpenEdgeWebhooks',
          'return_url': payload.paymentInfo.return_url ? payload.paymentInfo.return_url : '',
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
        //  'span':'4444', //----> This is imp, here we have to send last 4 digits of the card
        //  'user_defined_one': payload.paymentInfo.transactionId, //user_defined_two,user_defined_three

        console.log("post_data \n \n ");
        console.log(post_data);

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
          // console.log("res",res);
          res.on('data', function (chunk) {
            var obj = JSON.parse(chunk);
            console.log("obj", obj);
            payment_url = '' + obj.actionUrl + obj.sealedSetupParameters;
            console.log("payment_url", payment_url);
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
              reject({ "success": false, "message": obj["errorMessage"], 'body': errorBody });
            }
          });
        });
        post_req.write(post_data);

        post_req.end();
      });
    }
  }, {
    key: 'makeRefund',
    value: function makeRefund(payload) {
      console.log("entered in refund meta", payload.meta);
      console.log("entered in refund", payload);
      console.log("metaaaaaaaaaaaaaaaaaaa", convertObjectIdToString(payload.meta.transactionId));
      console.log("payload.meta.cardInfo.entrymode", payload.meta.cardInfo.entrymode);
      console.log("payload.meta.cardInfo.transaction_type", payload.meta.cardInfo.transaction_type);
      console.log("payload.meta.return_url", payload.meta.return_url);
      console.log("payload.meta.totalAmoun", payload.meta.amount);

      return new Promise(function (resolve, reject) {
        var post_data = querystring.stringify({
          'xweb_id': masterCredentials.X_WEB_ID,
          'terminal_id': masterCredentials.TERMINAL_ID,
          'auth_key': masterCredentials.AUTH_KEY,
          'transaction_type': payload.meta.cardInfo.transaction_type ? payload.meta.cardInfo.transaction_type : '',
          'entry_mode': payload.meta.cardInfo.entrymode ? payload.meta.cardInfo.entrymode : '',
          'charge_type': 'REFUND',
          'pos_device_model': 'generic_msr_clr_kbe',
          'order_id': payload.meta.transactionId ? convertObjectIdToString(payload.meta.transactionId) : '',
          'manage_payer_data': 'true',
          'return_url': payload.meta.return_url ? payload.meta.return_url : '',
          'return_target': '_self',
          'charge_total': payload.meta.amount ? payload.meta.amount : '',
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
          host: 'ws.paygateway.com',
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
            var obj = JSON.parse(chunk);
            console.log("obj", obj);
            payment_url = '' + obj.actionUrl + obj.sealedSetupParameters;
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
    key: 'getOrderDetails',
    value: function getOrderDetails(payloadJson) {
      return new Promise(function (resolve, reject) {

        var post_data = querystring.stringify({
          'xweb_id': masterCredentials.X_WEB_ID,
          'terminal_id': masterCredentials.TERMINAL_ID,
          'auth_key': masterCredentials.AUTH_KEY,
          'charge_type': 'QUERY_PAYMENT',
          'transaction_type': 'CREDIT_CARD',
          'order_id': payloadJson["order_id"],
          'full_detail_flag': 'true'
        });
        //post options for Query_payment
        var post_options = {
          host: 'ws.test.paygateway.com',
          port: 443,
          path: '/api/v1/transactions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data, 'utf8')
          }
        };
        //Sends Query_Payment request to gateway.
        var post_req = https.request(post_options, function (res) {
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
            console.log('Response:' + chunk);
            var paymentStateParse = {}; //Parses Payment State from result of QueryPayment.
            chunk.split('&').forEach(function (x) {
              var arr = x.split('=');
              arr[1] && (paymentStateParse[arr[0]] = arr[1]);
            });
            console.log(paymentStateParse.state);
            resolve(paymentStateParse);
            // if (paymentStateParse.state == 'payment_approved' || paymentStateParse.state == 'payment_deposited')
            // {
            //     response.end('Your payment Was approved!');
            // }
            // if (paymentStateParse.state == 'credit_refunded')
            // {
            //     response.end('Credit was successfully refunded!');
            // }
            // else
            // {
            //     response.end('Payment was not approved. Please Try again.')
            // }
          });
        });

        post_req.write(post_data);
        post_req.end();
      });
    }
  }, {
    key: 'verifyCreditCard',
    value: function verifyCreditCard(payloadJson) {

      return new Promise(function (resolve, reject) {
        var sampleJson = {
          'xweb_id': masterCredentials.X_WEB_ID,
          'terminal_id': masterCredentials.TERMINAL_ID,
          'auth_key': masterCredentials.AUTH_KEY,
          'transaction_type': 'CREDIT_CARD',
          'order_id': new Date().getTime(),
          'charge_type': 'AUTH',
          'entry_mode': 'KEYED',
          'charge_total': '0.00',
          'manage_payer_data': 'TRUE',
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
          'customer_information_visible': 'false',
          'return_url': payloadJson.paymentInfo.return_url ? payloadJson.paymentInfo.return_url : '',
          'return_target': '_self'
          // 'return_url': payload.paymentInfo.return_url ? payload.paymentInfo.return_url : '',
          // 'return_target': '_self'
        };

        /*
          response_code=1
          response_code_text=Successful transaction: The transaction completed successfully.
          secondary_response_code=0
          time_stamp=1551358359355
          retry_recommended=false
          authorized_amount=0.00
          captured_amount=0.00
          credit_card_verification_response=1
          original_authorized_amount=0.00
          requested_amount=0.00
          bank_approval_code=009421
          expire_month=12
          expire_year=20
          order_id=75a07b0f
          payer_identifier=6KCyY1jIXY
          span=2229
          card_brand=MASTERCARD
          card_type=Debit/Credit
        */

        var post_data = querystring.stringify(sampleJson);
        console.log(sampleJson);

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
          // console.log("res",res);
          res.on('data', function (chunk) {
            var obj = JSON.parse(chunk);
            console.log("obj", obj);
            payment_url = '' + obj.actionUrl + obj.sealedSetupParameters;
            console.log("payment_url", payment_url);
            if (payment_url !== undefined && payment_url !== "" && payment_url !== null) {
              var body = {
                'redirectURL': payment_url
              };
              resolve({ "success": true, 'body': body });
            } else {
              var errorBody = {
                'payRedirectUrl': ''
              };
              reject({ "success": false, "message": obj["errorMessage"], 'body': errorBody });
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
      return 'this is test';
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