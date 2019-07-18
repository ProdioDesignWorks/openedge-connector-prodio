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

        masterCredentials["ACH_AUTH_KEY"] = this.config.ACHAuthKey;
        masterCredentials["ACH_TERMINAL_ID"] = this.config.ACHTerminalID;
    }

    _createClass(OpenEdge, [{
        key: 'createMerchant',
        value: function createMerchant(payloadJson) {
            return new Promise(function (resolve, reject) {

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

                resolve({
                    "success": true,
                    "body": {
                        "activationStatus": true
                    }
                });
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
                resolve({
                    "success": true,
                    "body": {
                        "gatewayBuyerId": uuidv4()
                    }
                });
            });
        }
    }, {
        key: 'editPayer',
        value: function editPayer(payloadJson) {

            return new Promise(function (resolve, reject) {
                resolve({
                    "success": true,
                    "body": {
                        "gatewayBuyerId": payloadJson["payeeInfo"]["gatewayBuyerId"]
                    }
                });
            });
        }
    }, {
        key: 'removePayer',
        value: function removePayer(payloadJson) {
            return new Promise(function (resolve, reject) {
                resolve({
                    "success": true,
                    "body": {
                        "gatewayBuyerId": payloadJson["payeeInfo"]["gatewayBuyerId"]
                    }
                });
            });
        }
    }, {
        key: 'bulkUploadPayers',
        value: function bulkUploadPayers(payloadJson) {
            return 'this is test';
        }
    }, {
        key: 'makeACHPayment',
        value: function makeACHPayment(payload) {

            var _amt = '0.00';

            if (!isNull(payload["paymentInfo"]["downPayment"])) {
                _amt = payload["paymentInfo"]["downPayment"];
            } else {
                if (!isNull(payload["paymentInfo"]["totalAmount"])) {
                    _amt = payload["paymentInfo"]["totalAmount"];
                }
            }

            var charge_type = "DEBIT";
            if (!isNull(payload["paymentInfo"]["charge_type"])) {
                charge_type = payload["paymentInfo"]["charge_type"];
            }

            var account_type = "0";
            if (!isNull(payload["paymentInfo"]["account_type"])) {
                account_type = payload["paymentInfo"]["account_type"];
            }

            var transaction_condition_code = "52";
            if (!isNull(payload["paymentInfo"]["transaction_condition_code"])) {
                transaction_condition_code = payload["paymentInfo"]["transaction_condition_code"];
            }

            return new Promise(function (resolve, reject) {

                var sampleJson = {
                    'xweb_id': masterCredentials.X_WEB_ID,
                    'terminal_id': masterCredentials.ACH_TERMINAL_ID,
                    'auth_key': masterCredentials.ACH_AUTH_KEY,
                    'order_id': new Date().getTime(),
                    'entry_mode': 'KEYED',
                    'purchase_order_number': payload.paymentInfo.transactionId ? convertObjectIdToString(payload.paymentInfo.transactionId) : '',
                    'invoice_number': payload.paymentInfo.transactionId ? convertObjectIdToString(payload.paymentInfo.transactionId) : '',
                    'transaction_type': "ACH",
                    'charge_type': charge_type,
                    'manage_payer_data': payload.paymentInfo.manage_payer_data,
                    'charge_total': _amt,
                    'transaction_condition_code': transaction_condition_code,
                    'account_type': account_type, //1=saving
                    'routing_number': payload["paymentInfo"]["routing_number"],
                    'account_number': payload["paymentInfo"]["account_number"],
                    'name_on_account': payload["paymentInfo"]["name_on_account"]
                };

                var post_data = querystring.stringify(sampleJson);

                var post_options = {
                    host: 'ws.test.paygateway.com',
                    port: 443,
                    path: '/api/v1/transactions',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': post_data.length
                    }
                };

                var payment_url = '';
                var post_req = https.request(post_options, function (res) {
                    res.setEncoding('utf8');
                    //console.log("res",res);
                    res.on('data', function (chunk) {
                        var obj = JSON.parse(chunk);
                        var paymentStateParse = {}; //Parses Payment State from result of QueryPayment.
                        chunk.split('&').forEach(function (x) {
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
                            });
                        }
                    });
                });
                post_req.write(post_data);

                post_req.end();
            });
        }
    }, {
        key: 'makePayment',
        value: function makePayment(payload) {

            var cardType = "CREDIT_CARD";
            if (!isNull(payload["cardType"])) {
                cardType = payload["cardType"];
            }
            var _amt = '0.00';

            //----- removed to use ZeroAuth -----------
            // if(!isNull(payload["paymentInfo"]["downPayment"])){
            //   _amt = payload["paymentInfo"]["downPayment"];
            // }else{
            //   if(!isNull(payload["paymentInfo"]["totalAmount"])){
            //     _amt = payload["paymentInfo"]["totalAmount"];
            //   }
            // }

            //IMP - "AUTH" Only works with CREDIT_CARD
            var charge_type = "AUTH";
            if (cardType == "DEBIT_CARD") {
                charge_type = "PURCHASE";
            }

            return new Promise(function (resolve, reject) {
                var sampleJson = {
                    'xweb_id': masterCredentials.X_WEB_ID,
                    'terminal_id': masterCredentials.TERMINAL_ID,
                    'auth_key': masterCredentials.AUTH_KEY,
                    'transaction_type': cardType,
                    'order_id': new Date().getTime(),
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
                    sampleJson["manage_payer_data"] = 'true';
                    sampleJson["entry_mode"] = 'KEYED';
                } else {
                    sampleJson["account_type"] = '2';
                    sampleJson["entry_mode"] = 'EMV';
                }

                var post_data = querystring.stringify(sampleJson);

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
                    //console.log("res",res);
                    res.on('data', function (chunk) {
                        var obj = JSON.parse(chunk);
                        payment_url = '' + obj.actionUrl + obj.sealedSetupParameters;
                        if (payment_url !== undefined && payment_url !== "" && payment_url !== null) {
                            var body = {
                                'payRedirectUrl': payment_url
                            };
                            resolve({
                                "success": true,
                                'body': body
                            });
                        } else {
                            //console.log("obj",obj);
                            var errorBody = {
                                'payRedirectUrl': ''
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
    }, {
        key: 'payDirectWithSaveCardACH',
        value: function payDirectWithSaveCardACH(payload) {
            var _amt = '0.00';

            if (!isNull(payload["paymentInfo"]["downPayment"])) {
                _amt = payload["paymentInfo"]["downPayment"];
            } else {
                if (!isNull(payload["paymentInfo"]["totalAmount"])) {
                    _amt = payload["paymentInfo"]["totalAmount"];
                }
            }

            var charge_type = "DEBIT";
            if (!isNull(payload["paymentInfo"]["charge_type"])) {
                charge_type = payload["paymentInfo"]["charge_type"];
            }

            var account_type = "0";
            if (!isNull(payload["paymentInfo"]["account_type"])) {
                account_type = payload["paymentInfo"]["account_type"];
            }

            var transaction_condition_code = "52";
            if (!isNull(payload["paymentInfo"]["transaction_condition_code"])) {
                transaction_condition_code = payload["paymentInfo"]["transaction_condition_code"];
            }

            return new Promise(function (resolve, reject) {
                var sampleJson = {
                    'xweb_id': masterCredentials.X_WEB_ID,
                    'terminal_id': masterCredentials.ACH_TERMINAL_ID,
                    'auth_key': masterCredentials.ACH_AUTH_KEY,
                    'order_id': new Date().getTime(),
                    'entry_mode': 'KEYED',
                    'purchase_order_number': payload.paymentInfo.transactionId ? convertObjectIdToString(payload.paymentInfo.transactionId) : '',
                    'invoice_number': payload.paymentInfo.transactionId ? convertObjectIdToString(payload.paymentInfo.transactionId) : '',
                    'transaction_type': "ACH",
                    'charge_type': charge_type,
                    'payer_identifier': payload.paymentInfo.payer_identifier,
                    'charge_total': _amt,
                    'transaction_condition_code': transaction_condition_code,
                    'account_type': account_type
                };

                var post_data = querystring.stringify(sampleJson);

                var post_options = {
                    host: 'ws.test.paygateway.com',
                    port: 443,
                    path: '/api/v1/transactions',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': post_data.length
                    }
                };
                var payment_url = '';
                var post_req = https.request(post_options, function (res) {
                    res.setEncoding('utf8');
                    //console.log("res",res);
                    res.on('data', function (chunk) {
                        var obj = JSON.parse(chunk);
                        var paymentStateParse = {}; //Parses Payment State from result of QueryPayment.
                        chunk.split('&').forEach(function (x) {
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
                            });
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

            return new Promise(function (resolve, reject) {
                var post_data = querystring.stringify({
                    'xweb_id': masterCredentials.X_WEB_ID,
                    'terminal_id': masterCredentials.TERMINAL_ID,
                    'auth_key': masterCredentials.AUTH_KEY,
                    'account_type': '2',
                    'charge_type': 'CREDIT', //for credit_card and "REFUND" for debit card
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
                        var paymentStateParse = {}; //Parses Payment State from result of QueryPayment.
                        chunk.split('&').forEach(function (x) {
                            var arr = x.split('=');
                            arr[1] && (paymentStateParse[arr[0]] = arr[1]);
                        });
                        if (parseInt(paymentStateParse.response_code) == 1) {
                            resolve(paymentStateParse);
                        } else {
                            reject({
                                "message": paymentStateParse["response_code_text"],
                                body: paymentStateParse
                            });
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
                        var paymentStateParse = {}; //Parses Payment State from result of QueryPayment.
                        chunk.split('&').forEach(function (x) {
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

                var post_data = querystring.stringify(sampleJson);

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
                        payment_url = '' + obj.actionUrl + obj.sealedSetupParameters;
                        if (payment_url !== undefined && payment_url !== "" && payment_url !== null) {
                            var body = {
                                'payRedirectUrl': payment_url
                            };
                            resolve({
                                "success": true,
                                'body': body
                            });
                        } else {
                            var errorBody = {
                                'payRedirectUrl': ''
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
    }, {
        key: 'payDirectlyWithSavedCard',
        value: function payDirectlyWithSavedCard(payloadJson) {
            return new Promise(function (resolve, reject) {
                var inputJson = {
                    'xweb_id': masterCredentials.X_WEB_ID,
                    'terminal_id': masterCredentials.TERMINAL_ID,
                    'auth_key': masterCredentials.AUTH_KEY,
                    'charge_type': 'SALE',
                    'transaction_type': 'CREDIT_CARD',
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
                        //console.log('Response:' + chunk); 
                        var paymentStateParse = {}; //Parses Payment State from result of QueryPayment.
                        chunk.split('&').forEach(function (x) {
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
                        //console.log('Response:' + chunk); 
                        var paymentStateParse = {}; //Parses Payment State from result of QueryPayment.
                        chunk.split('&').forEach(function (x) {
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
    }, {
        key: 'getPayersTransactions',
        value: function getPayersTransactions(payloadJson) {
            return 'this is test';
        }
    }]);

    return OpenEdge;
}();

exports.default = OpenEdge;