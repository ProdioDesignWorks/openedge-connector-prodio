import {
    constants
} from 'http2';
import Helper from './config/constant';
const uuidv4 = require('uuid/v4');
const querystring = require("querystring");
var https = require("https");
var url = require('url');
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

const convertObjectIdToString = function(objectID) {
    return objectID.toString().substring(0, 8);
};

const isNull = function(val) {
    if (typeof val === 'string') {
        val = val.trim();
    }
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

        masterCredentials["ACH_AUTH_KEY"] = this.config.ACHAuthKey;
        masterCredentials["ACH_TERMINAL_ID"] = this.config.ACHTerminalID;

        masterCredentials["PRODUCTION_MODE"] = false;
        masterCredentials["HOST_BASE_URL"] = 'ws.test.paygateway.com';

        if(!isNull(this.config["ProductionMode"])){
            masterCredentials["PRODUCTION_MODE"] = this.config["ProductionMode"];
        }

        if(masterCredentials["PRODUCTION_MODE"]){
            masterCredentials["HOST_BASE_URL"] = 'ws.paygateway.com';
        }
    }

    createMerchant(payloadJson) {
        return new Promise((resolve, reject) => {

            resolve({
                "success": true,
                "body": {
                    "merchant": {
                        "mid": uuidv4()
                    }
                }
            });

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

            resolve({
                "success": true,
                "body": {
                    "activationStatus": true
                }
            });

        });
    }

    getMerchantProfile(payloadJson) {
        return 'this is test';
    }

    createPayer(payloadJson) {
        return new Promise((resolve, reject) => {
            resolve({
                "success": true,
                "body": {
                    "gatewayBuyerId": uuidv4()
                }
            });
        });
    }

    editPayer(payloadJson) {

        return new Promise((resolve, reject) => {
            resolve({
                "success": true,
                "body": {
                    "gatewayBuyerId": payloadJson["payeeInfo"]["gatewayBuyerId"]
                }
            });
        });
    }

    removePayer(payloadJson) {
        return new Promise((resolve, reject) => {
            resolve({
                "success": true,
                "body": {
                    "gatewayBuyerId": payloadJson["payeeInfo"]["gatewayBuyerId"]
                }
            });
        });
    }

    bulkUploadPayers(payloadJson) {
        return 'this is test';
    }


    makeACHPayment(payload) {

      let _amt = '0.00';

      if(!isNull(payload["paymentInfo"]["downPayment"])){
          _amt = payload["paymentInfo"]["downPayment"];
        }else{
          if(!isNull(payload["paymentInfo"]["totalAmount"])){
            _amt = payload["paymentInfo"]["totalAmount"];
          }
        }

        let charge_type ="DEBIT";
        if(!isNull(payload["paymentInfo"]["charge_type"])){
            charge_type = payload["paymentInfo"]["charge_type"];
        }

        let account_type ="0";
        if(!isNull(payload["paymentInfo"]["account_type"])){
            account_type = payload["paymentInfo"]["account_type"];
        }

        let transaction_condition_code = "52";
        if(!isNull(payload["paymentInfo"]["transaction_condition_code"])){
            transaction_condition_code = payload["paymentInfo"]["transaction_condition_code"];
        }

        return new Promise((resolve, reject) => {

            let sampleJson = {
                'xweb_id': masterCredentials.X_WEB_ID,
                'terminal_id': masterCredentials.ACH_TERMINAL_ID,
                'auth_key': masterCredentials.ACH_AUTH_KEY,
                'transaction_type':"ACH",
                'charge_type': charge_type ,
                'charge_total':_amt,
                'transaction_condition_code': transaction_condition_code,
                'manage_payer_data':true,
                'account_type': account_type , 
                'routing_number': payload["paymentInfo"]["routing_number"],
                'account_number': payload["paymentInfo"]["account_number"],
                'name_on_account': payload["paymentInfo"]["name_on_account"],
                'order_id': (new Date().getTime()),
                'entry_mode':'KEYED',
                'invoice_number': payload.paymentInfo.transactionId ? convertObjectIdToString(payload.paymentInfo.transactionId) : '',
            };
        
            const post_data = querystring.stringify(sampleJson);

            var post_options = {
                host: masterCredentials["HOST_BASE_URL"],
                port: 443,
                path: '/api/v1/transactions',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': post_data.length
                }
            };

            var payment_url = '';
            var post_req = https.request(post_options, function(res) {
                res.setEncoding('utf8');
                //console.log("res",res);
                res.on('data', function(chunk) {
                    var obj = JSON.parse(JSON.stringify(chunk));
                    var paymentStateParse = {}; //Parses Payment State from result of QueryPayment.
                    chunk.split('&').forEach(function(x) {
                        var arr = x.split('=');
                        arr[1] && (paymentStateParse[arr[0]] = arr[1]);
                    });
                    //payment_url = `${obj.actionUrl}${obj.sealedSetupParameters}`;
                    if (parseInt(paymentStateParse.response_code) == 1) {
                        resolve(paymentStateParse);
                    } else {
                        reject({
                            "message": paymentStateParse["response_code_text"],
                            body: paymentStateParse
                        })
                    }

                });
            });
            post_req.write(post_data);

            post_req.end();
        });
    }


    makeDirectPayment(payload) {

        let cardType = "CREDIT_CARD";
        if (!isNull(payload["cardType"])) {
            cardType = payload["cardType"];
        }


        let charge_type = "SALE";
        if (!isNull(payload["charge_type"])) {
            charge_type = payload["charge_type"];
        }

        let entry_mode = "KEYED";
        if (!isNull(payload["entry_mode"])) {
            entry_mode = payload["entry_mode"];
        }
        

        if (cardType == "DEBIT_CARD") { charge_type = "PURCHASE"; }
        if (cardType == "CREDIT_CARD") { charge_type = "SALE"; } 

        let _amt = '0.00';

        if(!isNull(payload["paymentInfo"]["downPayment"])){
          _amt = payload["paymentInfo"]["downPayment"];
        }else{
          if(!isNull(payload["paymentInfo"]["totalAmount"])){
            _amt = payload["paymentInfo"]["totalAmount"];
          }
        }

        return new Promise((resolve, reject) => {
            let sampleJson = {
                'xweb_id': masterCredentials.X_WEB_ID,
                'terminal_id': masterCredentials.TERMINAL_ID,
                'auth_key': masterCredentials.AUTH_KEY,
                'transaction_type': cardType,
                'order_id': (new Date().getTime()),
                'charge_type': charge_type,
                'entry_mode': entry_mode,
                'disable_framing': 'false',
                'manage_payer_data': 'true',
                'charge_total': _amt,
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
                'return_url': payload.paymentInfo.return_url ? payload.paymentInfo.return_url : '',
                'return_target': '_self'
            };
            
            if (cardType == "DEBIT_CARD") { sampleJson["account_type"] = '2'; } 

            const post_data = querystring.stringify(sampleJson);

            var post_options = {
                host: masterCredentials["HOST_BASE_URL"],
                port: 443,
                path: '/HostPayService/v1/hostpay/transactions',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': post_data.length
                }
            };

            var payment_url = '';
            var post_req = https.request(post_options, function(res) {
                res.setEncoding('utf8');
                //console.log("res",res);
                res.on('data', function(chunk) {
                    var obj = JSON.parse(chunk);
                    payment_url = `${obj.actionUrl}${obj.sealedSetupParameters}`;
                    if (payment_url !== undefined && payment_url !== "" && payment_url !== null) {
                        let body = {
                            'payRedirectUrl': payment_url,
                        };
                        resolve({
                            "success": true,
                            'body': body
                        });
                    } else {
                        //console.log("obj",obj);
                        let errorBody = {
                            'payRedirectUrl': '',
                        };
                        reject({
                            "success": false,
                            "message": obj["errorMessage"],
                            'body': errorBody
                        });
                    }

                });
            });
            post_req.write(post_data);

            post_req.end();
        });
    }


    makePayment(payload) {

        let cardType = "CREDIT_CARD";
        if (!isNull(payload["cardType"])) {
            cardType = payload["cardType"];
        }
        let _amt = '0.00';

        //----- removed to use ZeroAuth -----------
        // if(!isNull(payload["paymentInfo"]["downPayment"])){
        //   _amt = payload["paymentInfo"]["downPayment"];
        // }else{
        //   if(!isNull(payload["paymentInfo"]["totalAmount"])){
        //     _amt = payload["paymentInfo"]["totalAmount"];
        //   }
        // }

        //IMP - "AUTH" Only works with CREDIT_CARD
        let charge_type = "AUTH";
        if (cardType == "DEBIT_CARD") {
            charge_type = "PURCHASE";
        }

        return new Promise((resolve, reject) => {
            let sampleJson = {
                'xweb_id': masterCredentials.X_WEB_ID,
                'terminal_id': masterCredentials.TERMINAL_ID,
                'auth_key': masterCredentials.AUTH_KEY,
                'transaction_type': cardType,
                'order_id': (new Date().getTime()),
                'charge_type': charge_type,
                'disable_framing': 'false',
                //'entry_mode': 'KEYED',
                'charge_total': _amt,
                // 'account_type':'2', //for debit card
                'purchase_order_number': payload.paymentInfo.transactionId ? convertObjectIdToString(payload.paymentInfo.transactionId) : '',
                'invoice_number': payload.paymentInfo.transactionId ? convertObjectIdToString(payload.paymentInfo.transactionId) : '',
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
                'return_url': payload.paymentInfo.return_url ? payload.paymentInfo.return_url : '',
                'return_target': '_self'
                // 'return_url': payload.paymentInfo.return_url ? payload.paymentInfo.return_url : '',
                // 'return_target': '_self'
            };
            if (cardType == "CREDIT_CARD") {
                
                sampleJson["entry_mode"] = 'KEYED';
            } else {
                sampleJson["account_type"] = '2';
                sampleJson["entry_mode"] = 'EMV';
            }
            sampleJson["manage_payer_data"] = 'true';

            const post_data = querystring.stringify(sampleJson);

            var post_options = {
                host: masterCredentials["HOST_BASE_URL"],
                port: 443,
                path: '/HostPayService/v1/hostpay/transactions',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': post_data.length
                }
            };

            var payment_url = '';
            var post_req = https.request(post_options, function(res) {
                res.setEncoding('utf8');
                //console.log("res",res);
                res.on('data', function(chunk) {
                    var obj = JSON.parse(chunk);
                    payment_url = `${obj.actionUrl}${obj.sealedSetupParameters}`;
                    if (payment_url !== undefined && payment_url !== "" && payment_url !== null) {
                        let body = {
                            'payRedirectUrl': payment_url,
                        };
                        resolve({
                            "success": true,
                            'body': body
                        });
                    } else {
                        //console.log("obj",obj);
                        let errorBody = {
                            'payRedirectUrl': '',
                        };
                        reject({
                            "success": false,
                            "message": obj["errorMessage"],
                            'body': errorBody
                        });
                    }

                });
            });
            post_req.write(post_data);

            post_req.end();
        });
    }
    
    payDirectWithSaveCardACH(payload){
            let _amt = '0.00';
      
            if(!isNull(payload["paymentInfo"]["downPayment"])){
                _amt = payload["paymentInfo"]["downPayment"];
              }else{
                if(!isNull(payload["paymentInfo"]["totalAmount"])){
                  _amt = payload["paymentInfo"]["totalAmount"];
                }
              }
      
              let charge_type ="DEBIT";
              if(!isNull(payload["paymentInfo"]["charge_type"])){
                  charge_type = payload["paymentInfo"]["charge_type"];
              }
      
              let account_type ="0";
              if(!isNull(payload["paymentInfo"]["account_type"])){
                  account_type = payload["paymentInfo"]["account_type"];
              }
      
              let transaction_condition_code = "52";
              if(!isNull(payload["paymentInfo"]["transaction_condition_code"])){
                  transaction_condition_code = payload["paymentInfo"]["transaction_condition_code"];
              }
      
              return new Promise((resolve, reject) => {
                  let sampleJson = {
                      'xweb_id': masterCredentials.X_WEB_ID,
                      'terminal_id': masterCredentials.ACH_TERMINAL_ID,
                      'auth_key': masterCredentials.ACH_AUTH_KEY,
                      'order_id': (new Date().getTime()),
                      'entry_mode':'KEYED',
                      'purchase_order_number': payload.paymentInfo.transactionId ? convertObjectIdToString(payload.paymentInfo.transactionId) : '',
                      'invoice_number': payload.paymentInfo.transactionId ? convertObjectIdToString(payload.paymentInfo.transactionId) : '',
                      'transaction_type':"ACH",
                      'charge_type': charge_type ,
                      'payer_identifier': payload.paymentInfo.payer_identifier,
                      'charge_total':_amt,
                      'transaction_condition_code': transaction_condition_code,
                      'account_type': account_type ,
                      'manage_payer_data':'true'
                  };
      
                  const post_data = querystring.stringify(sampleJson);
      
                  var post_options = {
                      host: masterCredentials["HOST_BASE_URL"],
                      port: 443,
                      path: '/api/v1/transactions',
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/x-www-form-urlencoded',
                          'Content-Length': post_data.length
                      }
                  };
                  var payment_url = '';
                  var post_req = https.request(post_options, function(res) {
                      res.setEncoding('utf8');
                      //console.log("res",res);
                      res.on('data', function(chunk) {
                          var obj = JSON.parse(chunk);
                          var paymentStateParse = {}; //Parses Payment State from result of QueryPayment.
                          chunk.split('&').forEach(function(x) {
                              var arr = x.split('=');
                              arr[1] && (paymentStateParse[arr[0]] = arr[1]);
                          });
                          //payment_url = `${obj.actionUrl}${obj.sealedSetupParameters}`;
                          if (parseInt(paymentStateParse.response_code) == 1) {
                              resolve(paymentStateParse);
                          } else {
                              reject({
                                  "message": paymentStateParse["response_code_text"],
                                  body: paymentStateParse
                              })
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
                'account_type': '2',
                'charge_type': payload.paymentInfo.charge_type ? payload.paymentInfo.charge_type : '',
                'transaction_type': payload.paymentInfo.transaction_type ? payload.paymentInfo.transaction_type : '',
                'order_id': payload.paymentInfo.order_id ? Number(payload.paymentInfo.order_id) : '',
                // 'manage_payer_data': 'true',
                // 'return_url': payload.meta.return_url ? payload.meta.return_url : '',
                // 'return_target': '_self',
                //'payer_identifier': 'LIbyLFxG0S',
                //'span':'2229',
                'charge_total': payload.paymentInfo.amount ? payload.paymentInfo.amount : ''
            });


            var post_options = {
                host: masterCredentials["HOST_BASE_URL"],
                port: 443,
                path: '/HostPayService/v1/hostpay/transactions',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(post_data, 'utf8')
                }
            };

            var post_req = https.request(post_options, function(res) {
                res.setEncoding('utf8');
                res.on('data', function(chunk) {
                    var paymentStateParse = {}; //Parses Payment State from result of QueryPayment.
                    chunk.split('&').forEach(function(x) {
                        var arr = x.split('=');
                        arr[1] && (paymentStateParse[arr[0]] = arr[1]);
                    });
                    if (parseInt(paymentStateParse.response_code) == 1) {
                        resolve(paymentStateParse);
                    } else {
                        reject({
                            "message": paymentStateParse["response_code_text"],
                            body: paymentStateParse
                        })
                    }

                });
            });
            post_req.write(post_data);
            post_req.end();

        });
    }

    getOrderDetails(payloadJson) {
        return new Promise((resolve, reject) => {
            console.log("getOrderDetails----------->openEdgePayload",payloadJson);
            var post_data = querystring.stringify({
                'xweb_id': masterCredentials.X_WEB_ID,
                'terminal_id': masterCredentials.TERMINAL_ID,
                'auth_key': masterCredentials.AUTH_KEY,
                'charge_type': payloadJson.charge_type,
                'transaction_type':payloadJson.transaction_type,
                'order_id': payloadJson["order_id"],
                'full_detail_flag': 'true'
            });
            //post options for Query_payment
            var post_options = {
                host: masterCredentials["HOST_BASE_URL"],
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
                res.on('data', function(chunk) {
                    var paymentStateParse = {}; //Parses Payment State from result of QueryPayment.
                    chunk.split('&').forEach(function(x) {
                        var arr = x.split('=');
                        arr[1] && (paymentStateParse[arr[0]] = arr[1]);
                    });
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

    verifyCreditCard(payloadJson) {

        let cardType = "CREDIT_CARD";
        if (!isNull(payloadJson["cardType"])) {
            cardType = payloadJson["cardType"];
        }

        return new Promise((resolve, reject) => {
            let sampleJson = {
                'xweb_id': masterCredentials.X_WEB_ID,
                'terminal_id': masterCredentials.TERMINAL_ID,
                'auth_key': masterCredentials.AUTH_KEY,
                'transaction_type': cardType,
                'order_id': (new Date()).getTime(),
                'charge_type': 'AUTH',
                'disable_framing': 'false',
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

            const post_data = querystring.stringify(sampleJson);

            var post_options = {
                host: masterCredentials["HOST_BASE_URL"],
                port: 443,
                path: '/HostPayService/v1/hostpay/transactions',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': post_data.length
                }
            };

            var payment_url = '';
            var post_req = https.request(post_options, function(res) {
                res.setEncoding('utf8');
                // console.log("res",res);
                res.on('data', function(chunk) {
                    var obj = JSON.parse(chunk);
                    payment_url = `${obj.actionUrl}${obj.sealedSetupParameters}`;
                    if (payment_url !== undefined && payment_url !== "" && payment_url !== null) {
                        let body = {
                            'payRedirectUrl': payment_url,
                        };
                        resolve({
                            "success": true,
                            'body': body
                        });
                    } else {
                        let errorBody = {
                            'payRedirectUrl': '',
                        };
                        reject({
                            "success": false,
                            "message": obj["errorMessage"],
                            'body': errorBody
                        });
                    }

                });
            });
            post_req.write(post_data);

            post_req.end();
        });

    }


    payDirectlyWithSavedCard(payloadJson) {
        let cardType = "CREDIT_CARD";
        if (!isNull(payloadJson["cardType"])) {
            cardType = payloadJson["cardType"];
        }
        
        return new Promise((resolve, reject) => {
            let inputJson = {
                'xweb_id': masterCredentials.X_WEB_ID,
                'terminal_id': masterCredentials.TERMINAL_ID,
                'auth_key': masterCredentials.AUTH_KEY,
                'charge_type': 'SALE',
                'transaction_type': cardType,
                //'order_id' : payloadJson["cardInfo"]["order_id"],
                'order_id': new Date().getTime(),
                'charge_total': payloadJson["paymentInfo"]["amount"],
                'payer_identifier': payloadJson["cardInfo"]["payer_identifier"]
            };
            if (!isNull(payloadJson["paymentInfo"]["ecommerce_indicator"])) {
                inputJson["ecommerce_indicator"] = payloadJson["paymentInfo"]["ecommerce_indicator"];
            }

            var post_data = querystring.stringify(inputJson);
            //post options for Query_payment
            var post_options = {
                host: masterCredentials["HOST_BASE_URL"],
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
                res.on('data', function(chunk) {
                    //console.log('Response:' + chunk); 
                    var paymentStateParse = {}; //Parses Payment State from result of QueryPayment.
                    chunk.split('&').forEach(function(x) {
                        var arr = x.split('=');
                        arr[1] && (paymentStateParse[arr[0]] = arr[1]);
                    });

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
        let cardType = "CREDIT_CARD";
        if (!isNull(payloadJson["cardType"])) {
            cardType = payloadJson["cardType"];
        }
        let entryMode = "KEYED";
        if (!isNull(payloadJson["entryMode"])) {
            entryMode = payloadJson["entryMode"];
        }
        return new Promise((resolve, reject) => {
            let sampleJson = {
                'xweb_id': masterCredentials.X_WEB_ID,
                'terminal_id': masterCredentials.TERMINAL_ID,
                'auth_key': masterCredentials.AUTH_KEY,
                'transaction_type': cardType,
                'order_id': (new Date()).getTime(),
                'charge_type': 'AUTH',
                'disable_framing': 'false',
                'entry_mode': entryMode,
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
                "submit_button_label":"Save Card",
                "charge_type_label":"Transaction Type",
                "charge_type_row_visible":false,
                "charge_total_visible": false,
                "input-field-height":"25px",
                "font-size":"16px",
                "btn-height":"35px",
                "btn-width":"140px",
                'return_url': payloadJson.return_url ? payloadJson.return_url : '',
                'return_target': '_self'
            };

            const post_data = querystring.stringify(sampleJson);

            var post_options = {
                host: masterCredentials["HOST_BASE_URL"],
                port: 443,
                path: '/HostPayService/v1/hostpay/transactions',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': post_data.length
                }
            };

            var payment_url = '';
            var post_req = https.request(post_options, function(res) {
                res.setEncoding('utf8');
                // console.log("res",res);
                res.on('data', function(chunk) {
                    var obj = JSON.parse(chunk);
                    payment_url = `${obj.actionUrl}${obj.sealedSetupParameters}`;
                    if (payment_url !== undefined && payment_url !== "" && payment_url !== null) {
                        let body = {
                            'payRedirectUrl': payment_url,
                        };
                        resolve({
                            "success": true,
                            'body': body
                        });
                    } else {
                        let errorBody = {
                            'payRedirectUrl': '',
                        };
                        reject({
                            "success": false,
                            "message": obj["errorMessage"],
                            'body': errorBody
                        });
                    }

                });
            });
            post_req.write(post_data);

            post_req.end();
        });
    }

    removeCard(payloadJson) {
        return new Promise((resolve, reject) => {
            var post_data = querystring.stringify({
                'xweb_id': masterCredentials.X_WEB_ID,
                'terminal_id': masterCredentials.TERMINAL_ID,
                'auth_key': masterCredentials.AUTH_KEY,
                'charge_type': 'DELETE_CUSTOMER',
                'payer_identifier': payloadJson["cardInfo"]["payer_identifier"],
                'span': payloadJson["cardInfo"]["span"]
            });
            //post options for Query_payment
            var post_options = {
                host: masterCredentials["HOST_BASE_URL"],
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
                res.on('data', function(chunk) {
                    //console.log('Response:' + chunk); 
                    var paymentStateParse = {}; //Parses Payment State from result of QueryPayment.
                    chunk.split('&').forEach(function(x) {
                        var arr = x.split('=');
                        arr[1] && (paymentStateParse[arr[0]] = arr[1]);
                    });

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