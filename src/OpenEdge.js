import { constants } from 'http2';
import Helper from './config/constant';
const uuidv4 = require('uuid/v4');
const querystring = require("querystring");
var https = require("https");
var url = require('url');
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}

const convertObjectIdToString = function (objectID) {
  return objectID.toString().substring(0, 8);
};

const isNull = function (val) {
  if (typeof val === 'string') { val = val.trim(); }
  if (val === undefined || val === null || typeof val === 'undefined' || val === '' || val === 'undefined') {
    return true;
  }
  return false;
};

let masterCredentials = {};
export default class OpenEdge {
  constructor(config) {
    this.config = config;
    masterCredentials["X_WEB_ID"] = this.config.XwebID;
    masterCredentials["TERMINAL_ID"] = this.config.TerminalID;
    masterCredentials["AUTH_KEY"] = this.config.AuthKey;
  }

  createMerchant(payloadJson) {
    return new Promise((resolve, reject) => {

      resolve({ "success": true, "body": { "merchant": { "mid": uuidv4() } } });

    });
  }

  updateMerchant(payloadJson) {
    return 'This is from Integrity';
  }

  deleteMerchant(payloadJson) {
    return 'This is from Integrity';
  }

  getMerchantId(payloadJson) {
    return 'this is tes';
  }

  getMerchantActionvationStatus(payloadJson) {
    return new Promise((resolve, reject) => {

      resolve({ "success": true, "body": { "activationStatus": true } });

    });
  }

  getMerchantProfile(payloadJson) {
    return 'this is test';
  }

  createPayer(payloadJson) {
    return new Promise((resolve, reject) => {
      resolve({ "success": true, "body": { "gatewayBuyerId": uuidv4() } });
    });
  }

  editPayer(payloadJson) {

    return new Promise((resolve, reject) => {
      resolve({ "success": true, "body": { "gatewayBuyerId": payloadJson["payeeInfo"]["gatewayBuyerId"] } });
    });
  }

  removePayer(payloadJson) {
    return new Promise((resolve, reject) => {
      resolve({ "success": true, "body": { "gatewayBuyerId": payloadJson["payeeInfo"]["gatewayBuyerId"] } });
    });
  }
  bulkUploadPayers(payloadJson) {
    return 'this is test';
  }

  makePayment(payload) {

    return new Promise((resolve, reject) => {
    let sampleJson = {
        'xweb_id': masterCredentials.X_WEB_ID,
        'terminal_id': masterCredentials.TERMINAL_ID,
        'auth_key': masterCredentials.AUTH_KEY,
        'transaction_type':'CREDIT_CARD',
        //'order_id': payload.paymentInfo.transactionId ? convertObjectIdToString(payload.paymentInfo.transactionId) : '',
        'order_id': (new Date().getTime()),
        'charge_type':'AUTH',
        'entry_mode': 'KEYED',
        'charge_total':'0.00',
        'manage_payer_data':'TRUE',
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
        'return_url': payload.paymentInfo.return_url ? payload.paymentInfo.return_url : '',
        'return_target': '_self'
        // 'return_url': payload.paymentInfo.return_url ? payload.paymentInfo.return_url : '',
        // 'return_target': '_self'
      };

      const post_data = querystring.stringify(sampleJson);
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
          //console.log("obj",obj);
          payment_url = `${obj.actionUrl}${obj.sealedSetupParameters}`;
          console.log("payment_url",payment_url);
          if (payment_url !== undefined && payment_url !== "" && payment_url !== null) {
            let body = {
              'payRedirectUrl': payment_url,
            };
            resolve({ "success": true, 'body': body });
          }
          else {
            let errorBody = {
              'payRedirectUrl': '',
            };
            reject({ "success": false,"message": obj["errorMessage"] , 'body': errorBody });
          }

        });
      });
      post_req.write(post_data);

      post_req.end();
    });
  }

  makeRefund(payload) {

    return new Promise((resolve, reject) => {
      const post_data = querystring.stringify({
        'xweb_id': masterCredentials.X_WEB_ID,
        'terminal_id': masterCredentials.TERMINAL_ID,
        'auth_key': masterCredentials.AUTH_KEY, 
        'account_type':'2',
        'charge_type': 'CREDIT',
        'transaction_type': payload.paymentInfo.transaction_type ? payload.paymentInfo.transaction_type : '',
        'order_id': payload.paymentInfo.transactionId ? convertObjectIdToString(payload.paymentInfo.transactionId) : '',
        // 'manage_payer_data': 'true',
        // 'return_url': payload.meta.return_url ? payload.meta.return_url : '',
        // 'return_target': '_self',
        //'payer_identifier': 'LIbyLFxG0S',
        //'span':'2229',
        'charge_total': payload.paymentInfo.amount ? payload.paymentInfo.amount : ''
      });


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

      var post_req = https.request(post_options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          console.log('Response:' + chunk); 
          var paymentStateParse = {}; //Parses Payment State from result of QueryPayment.
          chunk.split('&').forEach(function(x){
              var arr = x.split('=');
              arr[1] &&(paymentStateParse[arr[0]] = arr[1]);
          });
          if(parseInt(paymentStateParse.response_code)==1){
            resolve(paymentStateParse);
          }else{
            reject({"message":paymentStateParse["response_code_text"],body:paymentStateParse})
          }
          
        });
      });
      post_req.write(post_data);
      post_req.end();

    });
  }

  getOrderDetails(payloadJson){
    return new Promise((resolve, reject) => {

      var post_data = querystring.stringify({
          'xweb_id': masterCredentials.X_WEB_ID,
          'terminal_id': masterCredentials.TERMINAL_ID,
          'auth_key': masterCredentials.AUTH_KEY,
          'charge_type' : 'QUERY_PAYMENT',
          'transaction_type' : 'CREDIT_CARD',
          'order_id' : payloadJson["order_id"],
          'full_detail_flag' : 'true'
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
      var post_req = https.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response:' + chunk); 
          var paymentStateParse = {}; //Parses Payment State from result of QueryPayment.
          chunk.split('&').forEach(function(x){
              var arr = x.split('=');
              arr[1] &&(paymentStateParse[arr[0]] = arr[1]);
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

  verifyCreditCard(payloadJson){

    return new Promise((resolve, reject) => {
    let sampleJson = {
        'xweb_id': masterCredentials.X_WEB_ID,
        'terminal_id': masterCredentials.TERMINAL_ID,
        'auth_key': masterCredentials.AUTH_KEY,
        'transaction_type':'CREDIT_CARD',
        'order_id': (new Date()).getTime(),
        'charge_type':'AUTH',
        'entry_mode': 'KEYED',
        'charge_total':'0.00',
        'manage_payer_data':'TRUE',
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

      const post_data = querystring.stringify(sampleJson);
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
          //console.log("obj",obj);
          payment_url = `${obj.actionUrl}${obj.sealedSetupParameters}`;
          console.log("payment_url",payment_url);
          if (payment_url !== undefined && payment_url !== "" && payment_url !== null) {
            let body = {
              'payRedirectUrl': payment_url,
            };
            resolve({ "success": true, 'body': body });
          }
          else {
            let errorBody = {
              'payRedirectUrl': '',
            };
            reject({ "success": false,"message": obj["errorMessage"] , 'body': errorBody });
          }

        });
      });
      post_req.write(post_data);

      post_req.end();
    });

  }


  payDirectlyWithSavedCard(payloadJson){
    return new Promise((resolve, reject) => {
      let inputJson = {
          'xweb_id': masterCredentials.X_WEB_ID,
          'terminal_id': masterCredentials.TERMINAL_ID,
          'auth_key': masterCredentials.AUTH_KEY,
          'charge_type' : 'SALE',
          'transaction_type' : 'CREDIT_CARD',
          //'order_id' : payloadJson["cardInfo"]["order_id"],
          'order_id' : new Date().getTime(),
          'charge_total' : payloadJson["paymentInfo"]["amount"],
          'payer_identifier': payloadJson["cardInfo"]["payer_identifier"]
      };



      if(!isNull(payloadJson["paymentInfo"]["ecommerce_indicator"])){
        inputJson["ecommerce_indicator"] = payloadJson["paymentInfo"]["ecommerce_indicator"];
      }
      console.log(payloadJson);
       console.log(inputJson);

        var post_data = querystring.stringify(inputJson);
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
        var post_req = https.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            //console.log('Response:' + chunk); 
            var paymentStateParse = {}; //Parses Payment State from result of QueryPayment.
            chunk.split('&').forEach(function(x){
                var arr = x.split('=');
                arr[1] &&(paymentStateParse[arr[0]] = arr[1]);
            });
            console.log(paymentStateParse.state);
            resolve(paymentStateParse);
            });
        });

        post_req.write(post_data);
        post_req.end();

      });

  }


  getPayersListing(payloadJson) {
    return 'this is test';
  }

  saveCardForPayer(payloadJson) {
  }

  removeCard(payloadJson) {
      return new Promise((resolve, reject) => {
        var post_data = querystring.stringify({
            'xweb_id': masterCredentials.X_WEB_ID,
            'terminal_id': masterCredentials.TERMINAL_ID,
            'auth_key': masterCredentials.AUTH_KEY,
            'charge_type' : 'DELETE_CUSTOMER',
            'payer_identifier' : payloadJson["cardInfo"]["payer_identifier"],
            'span' : payloadJson["cardInfo"]["span"]
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
        var post_req = https.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            //console.log('Response:' + chunk); 
            var paymentStateParse = {}; //Parses Payment State from result of QueryPayment.
            chunk.split('&').forEach(function(x){
                var arr = x.split('=');
                arr[1] &&(paymentStateParse[arr[0]] = arr[1]);
            });
            console.log(paymentStateParse.state);
            resolve(paymentStateParse);
            });
        });

        post_req.write(post_data);
        post_req.end();

      });
  }

  getPayersTransactions(payloadJson) {
    return 'this is test';
  }
}

