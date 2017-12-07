# Apple Pay with TapPay

## DEMO

![](https://media.giphy.com/media/3ohs82eiyMwU3A9gli/giphy.gif)

## Required

1. 請到 TapPay Portal 申請帳號，取得 APP_ID 和 APP_KEY
2. 準備好一個 https 的網站，才能去驗證 Domain，可以利用 ngrok 去建立 public domain 並且去驗證，詳細教學可以參考 [Ngrok - Connect to your localhost](https://medium.com/tappay/ngrok-connect-to-your-localhost-c6f3ba84525b)
3. 請先到 TapPay Portal & Apple Develop 去設定好 Merchant ID 以及 Domain，詳細設定方式可以參考 [TapPay Apple Pay 文件](https://docs.tappaysdk.com/apple-pay/zh/portal.html#apple-developer-add-domain-apple-pay-on-the-web)

### Overview

1. 引入 SDK 並且設置好 APP_ID, APP_KEY, SERVER_TYPE
2. 使用 `TPDirect.applePay.checkAvailability()` 確認裝置是否能使用 Apple Pay
3. 設置 Payment Request Data For Apple Pay
4. 設置 `getPrimeSuccessCallback()` & `gertPrimeErrorCallback()`
5. 設置 Apple Pay Mertchant ID
6. 設置 `session.onshippingmethodselected` 方法
7. 全部都準備完畢之後, 使用 `session.begin()` 啟動 Apple Pay 並且去 TapPay Server Get Prime

## 教學

### Step 1
首先我們要建立出付款頁面 `index.html` 並且在 `<head></head>` 中引入 SDK

```html
<script src="https://js.tappaysdk.com/tpdirect/v2_3_3"></script>
```

### Step 2

初始化 TapPay SDK

```javascript
TPDirect.setupSDK(APP_ID, "APP_KEY", 'SERVER_TYPE')
```

### Step 3

使用 `TPDirect.applePay.checkAvailability()` 確認裝置是否能使用 Apple Pay

```javascript
if (TPDirect.applePay.checkAvailability()) {
    // code, do something if the device is compatible with Apple Pay
}
```

### Step 4

設置 payment request for Apple Pay，詳細可以參考 [Apple Pay Payment Request Data](https://docs.tappaysdk.com/apple-pay/zh/front.html#payment-request)

```javascript
var paymentRequest = {
    countryCode: 'TW',
    currencyCode: 'TWD',
    shippingMethods: [{
            label: 'Free Shipping',
            amount: '0',
            identifier: 'free',
            detail: 'Delivers in five business days',
        },
        {
            label: 'Express Shipping',
            amount: '5',
            identifier: 'express',
            detail: 'Delivers in two business days',
        },
    ],
    lineItems: [{
            label: 'Book',
            amount: '1',
        },
        {
            label: 'Pan',
            amount: '1',
        }
    ],
    total: {
        label: 'TapPay!',
        amount: '2',
    },
    supportedNetworks: ['amex', 'discover', 'masterCard', 'visa'],
    merchantCapabilities: ['supports3DS'],
    requiredShippingContactFields: ['postalAddress', 'email'],
    requiredBillingContactFields: ['postalAddress']
};
```

### Step 5

設置好 Get Prime SuccuessCallback & ErrorCallback

```javascript
function getPrimeSuccessCallback(prime, event, completePayment) {
    // 1. prime
    // 把 prime 送到 server 完成交易, 呼叫以下其中一個 URL 完成交易
    // https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime
    // https://prod.tappaysdk.com/tpc/payment/pay-by-prime

    // 2. event
    // event 為 ApplePaySession onpaymentauthorized 事件回傳的物件，
    // 相關文件請查看 https://developer.apple.com/documentation/applepayjs/applepaysession

    // 3. completePayment
    // 當 server 交易成功或是失敗的時候使用
    // completePayment(ApplePaySession.STATUS_SUCCESS) => 成功
    // completePayment(ApplePaySession.STATUS_FAILURE) => 失敗
    
}
function ErrorCallback(error) {
    // error message and status
    // error code 請參考文件 https://docs.tappaysdk.com/apple-pay/zh/error.html#error-code
}
```

### Step 6

設置 Apple Pay Mechant ID，詳細設定步驟請到 [TapPay Apple Pay 文件](https://docs.tappaysdk.com/apple-pay/zh/portal.html#apple-developer-add-domain-apple-pay-on-the-web)

```javascript
// ==>136 in sample code|
var session = TPDirect.applePay.buildSession(paymentRequest, "您的 Apple Merchant ID", getPrimeSuccessCallback, getPrimeErrorCallback);
```

### Step 7

設置好 `onshippingmethodselected`

```javascript
session.onshippingmethodselected = function (event) {
    const total = {
        label: 'TapPay!',
        amount: totalCost,
    };
    const lineItems = [{
            label: 'Book',
            amount: '1',
        },
        {
            label: 'Pan',
            amount: '1',
        }
    ];
    session.completeShippingMethodSelection(ApplePaySession.STATUS_SUCCESS, total, lineItems);
}
```

### Step 8

設置好所有 function 後, 使用 `session.begin()` 啟用 Apple Pay

### 完整 index.html 頁面

[TapPay Apple Pay Example](./example/public/index.html)