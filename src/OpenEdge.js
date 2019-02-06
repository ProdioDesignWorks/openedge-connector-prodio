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
    console.log("payload....",payload.paymentInfo.transactionId);
    console.log("payload....",payload.paymentInfo.totalAmount);
    console.log("master credentials",masterCredentials);
    return new Promise((resolve, reject) => {
      const post_data = querystring.stringify({
        'xweb_id': masterCredentials.X_WEB_ID,
        'terminal_id': masterCredentials.TERMINAL_ID,
        'auth_key': masterCredentials.AUTH_KEY,
        'transaction_type':'CREDIT_CARD',
        'entry_mode': 'KEYED',
        'charge_type': 'CREDIT',
        'order_id': payload.paymentInfo.transactionId ? convertObjectIdToString(payload.paymentInfo.transactionId) : '',
        'manage_payer_data': 'true',
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
          console.log("obj",obj);
          payment_url = `${obj.actionUrl}${obj.sealedSetupParameters}`;
          console.log("payment_url",payment_url);
          if (payment_url !== undefined && payment_url !== "" && payment_url !== null) {
            let body = {
              'payRedirectUrl': payment_url,
              'gatewayTransactionId': ''
            };
            resolve({ "success": true, 'body': body });
          }
          else {
            let errorBody = {
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

  makeRefund(payload) {
    console.log("entered in refund meta",payload.meta);
    console.log("entered in refund",payload);
    console.log("metaaaaaaaaaaaaaaaaaaa",convertObjectIdToString(payload.meta.transactionId));
    console.log("payload.meta.cardInfo.entrymode",payload.meta.cardInfo.entrymode);
    console.log("payload.meta.cardInfo.transaction_type",payload.meta.cardInfo.transaction_type);
    console.log("payload.meta.return_url",payload.meta.return_url);
    console.log("payload.meta.totalAmoun",payload.meta.amount);

    return new Promise((resolve, reject) => {
      const post_data = querystring.stringify({
        'xweb_id': masterCredentials.X_WEB_ID,
        'terminal_id': masterCredentials.TERMINAL_ID,
        'auth_key': masterCredentials.AUTH_KEY, 
        'transaction_type': payload.meta.cardInfo.transaction_type ? payload.meta.cardInfo.transaction_type : '',
        'entry_mode': payload.meta.cardInfo.entrymode ? payload.meta.cardInfo.entrymode : '',
        'charge_type': 'REFUND',
        'pos_device_model':'generic_msr_clr_kbe',
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
           console.log("obj",obj);
          payment_url = `${obj.actionUrl}${obj.sealedSetupParameters}`;
          if (payment_url !== undefined && payment_url !== "" && payment_url !== null) {
            let body = {
              'payRedirectUrl': payment_url,
              'gatewayTransactionId': ''
            };
            resolve({ "success": true, 'body': body });
          }
          else {
            let errorBody = {
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
  getPayersListing(payloadJson) {
    return 'this is test';
  }

  saveCardForPayer(payloadJson) {
  }

  removeCard(payloadJson) {
    return new Promise((resolve, reject) => {
      soap.createClient(MASTER_MERCHANT_ACCESS["RecurringURL"], soap_client_options, function (err, client) {
        //  TODO : Here we have to use newly created merchant Info and not master info.
        let cardNumber = payloadJson["cardInfo"]["cardNumber"];
        cardNumber = cardNumber.replace(" ", "").replace(" ", "").replace(" ", "");

        let cardHolderName = payloadJson["cardInfo"]["cardHolderName"];
        let expDate = payloadJson["cardInfo"]["expDate"];

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
            if (result && typeof result["ManageCreditCardInfoResult"] !== undefined && typeof result["ManageCreditCardInfoResult"]["CcInfoKey"] !== undefined) {
              resolve({
                "success": true,
                "body": { "gatewayCardId": result["ManageCreditCardInfoResult"]["CcInfoKey"] },
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

  getPayersTransactions(payloadJson) {
    return 'this is test';
  }
}

