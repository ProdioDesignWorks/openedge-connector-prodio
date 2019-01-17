exports.MASTER_MERCHANT_ACCESS = {
    DETAILS:{
        'UserName': "kinetempapi123",
        'Password': "Technologies1",
        'Vendor': "75",
        'BeginDt': "1/11/2017",
        'EndDt': "1/11/2018",
        'RecurringURL':'https://sandbox.ibxpays.com/vt/ws/recurring.asmx?wsdl',
        'TransactionsURL':'https://sandbox.ibxpays.com/ws/transact.asmx?wsdl',
        'CardSafeURL':'https://sandbox.ibxpays.com/ws/cardsafe.asmx?wsdl',
        'CustomFieldsURL':'https://sandbox.ibxpays.com/ws/customfields.asmx?wsdl',
        'TransactionDetailsURL':'https://sandbox.ibxpays.com/vt/ws/trxdetail.asmx?wsdl',
        'BoardingAPIsUserName':'kinekt',
        'BoardingAPIsPassword':'Cieos123',
        'BoardingAuthAPIURL':'https://apisandbox.integritypays.com/v1/auth',
        'BoardingCreateMerchantURL':'https://apisandbox.integritypays.com/v1/boarding',
        'BoardingMerchantStatusURL':'https://apisandbox.integritypays.com/v1/boarding/{{MERCHANT_ID}}/status',
    },
    CONFIG:{
        BASE_URL:"http://localhost:3000",
        PAYMENT_URL:"/payment",
        HOST:"ws.test.paygateway.com",
        TRANSACTION_URL:"/HostPayService/v1/hostpay/transactions",
        ACCOUNT_TOKEN:"C9CBE35FCE67540F328FE4FC8758AF6DCECC24954FB2C4FFE4A24F2B81D95FEA9953BC5CF45601D078"

    }
    
    
};
