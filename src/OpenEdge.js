import { constants } from 'http2';
import Helper from './config/constant';
const uuidv4 = require('uuid/v4');
const axios = require('axios');
const querystring = require("querystring");

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

 makeDirectPayment(payload){
    let apiUrl = `${Helper.CONFIG.BASE_URL}${Helper.CONFIG.PAYMENT_URL}`
    axios.post(apiUrl).then(response => {
      //Parameters for a simple Credit_card Transaction
      const post_data = querystring.stringify({
        'account_token': Helper.CONFIG.ACCOUNT_TOKEN, //Account Token Should be Configured with your own testing account token.
        'transaction_type': 'CREDIT_CARD',
        'entry_mode': payload.entrymode,
        'charge_type': payload.chargetype,
        'order_id': payload.orderid,
        'manage_payer_data': 'true',
        'return_url': 'http:/localhost:3000/result',
        'return_target': '_self',
        'charge_total': payload.amount,
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
      let payment_url = `${Helper.CONFIG.HOST}${Helper.CONFIG.TRANSACTION_URL}${post_data}`;
      return new Promise((resolve, reject) => {
        axios.post(payment_url).then(response => {
          console.log(response);
          try{
            var obj = JSON.parse(response.data);
            console.log(obj.actionUrl + obj.sealedSetupParameters)
            let paymentUrl = obj.actionUrl + obj.sealedSetupParameters;
            resolve ({"success":true,"paymentRedirectUrl":paymentUrl});
          }
          catch(error){
            reject({ "success": false, "body": error });
          }
        });
      })
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

