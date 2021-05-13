# Pay with Google

## DEMO
<img src="./payment_request_pay_with_google.gif" width="450px"/>

## 注意
在 Sandbox 環境下使用 Pay with Google 的時候，底下出現紅字『無法識別應用程式』  
這是正常行為，毋須擔心。這是在測試環境下面會出現的警告  
在 Production 環境下使用 Pay with Google，底下就不會出現紅字

## Required

1. 請到 TapPay Portal 申請帳號，取得 APP_ID 和 APP_KEY
2. 必須使用 v3 版的 SDK
3. 僅支援 Android Mobile Web、Chrome M61 版本後以及 Google Play Services version 11.4.x 版本後

### Overview

1. 引入 SDK 並且初始化 APP_ID, APP_KEY, SERVER_TYPE
2. 使用 `TPDirect.paymentRequestApi.checkAvailability()` 檢查瀏覽器是否可以用 Payment Request API
3. 設置 Payment Request Data, 並且在 `supportedMethods` 填入 `["pay_with_google"]`
4. 設置 Pay with Google 特有的參數 `TPDirect.paymentRequestApi.setupPayWithGoogle`
5. 啟用 Payment Request API 並且綁定 button 的 click 事件去觸發 `TPDirect.paymentRequestApi.getPrime(function(result){})`

## 教學

### Step 1

首先我們要建立出付款頁面 `index.html` 並且在 `<head></head>` 中引入 SDK

```html
<script src="https://js.tappaysdk.com/tpdirect/v5.7.0"></script>
<script>
    TPDirect.setupSDK(APP_ID, "APP_KEY", 'SERVER_TYPE')
</script>
```

### Step 2

再來要檢查瀏覽器使否可以使用 Payment Request API  
可以使用 `TPDirect.paymentRequestApi.checkAvailability()` 確認使否能使用

### Step 3

確認可以使用 Payment Request API 之後  
建立出 Payment Request Data，並且在 `supportedMethods` 裡面填入 `pay_with_google`  
可以讓 Payment Request API 支援 Pay with Google 方法  
詳細參數設定請參考[文件](https://docs.tappaysdk.com/payment-request-api/zh/front.html#paymentrequest)

```javascript
var data = {
    supportedNetworks: ['MASTERCARD', 'VISA', 'AMEX'],
    supportedMethods: ['pay_with_google'],
    displayItems: [{
        label: 'iPhone8',
        amount: {
            currency: 'TWD',
            value: '1.00'
        }
    }],
    total: {
        label: '付給 TapPay',
        amount: {
            currency: 'TWD',
            value: '1.00'
        }
    },
    shippingOptions: [{
            id: "standard",
            label: "🚛 Ground Shipping (2 days)",
            // apple pay only
            detail: 'Estimated delivery time: 2 days',
            amount: {
                currency: "TWD",
                value: "5.00"
            }
        },
        {
            id: "drone",
            label: "🚀 Drone Express (2 hours)",
            // apple pay only
            detail: 'Estimated delivery time: 2 hours',
            amount: {
                currency: "TWD",
                value: "25.00"
            }
        },
    ],
    // optional
    options: {
        requestPayerEmail: false,
        requestPayerName: false,
        requestPayerPhone: false,
        requestShipping: false,
    }
}
```
### Step 4

設置 Pay with Google 設有的參數

```javascript
TPDirect.paymentRequestApi.setupPayWithGoogle({
    // defaults to ['CARD', 'TOKENIZED_CARD']
    allowedPaymentMethods: ['CARD', 'TOKENIZED_CARD'],

    // Indicates whether or not you allow prepaid debit cards as a form of payment.
    // Set to true to allow prepaid debit cards. Otherwise, set to false.
    // defaults to true
    allowPrepaidCards: true,

    // defaults to false
    billingAddressRequired: false,
    // defaults to  'MIN'
    billingAddressFormat: 'MIN', // FULL, MIN

    // Set the ISO 3166-1 alpha-2 formatted country codes of the countries to which shipping is allowed.
    // If not specified, all countries are allowed.
    // defaults to undefined (allow all shipping address)
    // allowedCountryCodes: ['TW']
})
```

### Step 5

接下來啟用 Payment Request API  
`TPDirect.paymentRequestApi.setupPaymentRequest(data, function(result){})`  
第一個參數 data 是剛剛宣告的 payment request data  
第二個參數回傳的 result 會有以下幾個屬性  

1. `result.browserSupportPaymentRequest`

2. `result.canMakePaymentWithActiveCard`
    `canMakePaymentWithActiveCard` 在 apple pay 只會檢查使用者使否會綁定卡片

設置完之後，需要在最後面綁定 button 的 click 事件去觸發 `TPDirect.paymentRequestApi.getPrime(function(result){})`  
Get Prime 的 result 可以參考[文件](https://docs.tappaysdk.com/payment-request-api/zh/front.html#get-prime-result)

特別要注意的是使用 Pay with Google 的話在 `result.google_pay` 會有 Pay with Google 回傳的東西

```javascript
TPDirect.paymentRequestApi.setupPaymentRequest(data, function (result) {
    console.log('TPDirect.paymentRequestApi.setupPaymentRequest.result', result)

    // 代表瀏覽器支援 payment request api (或 apple pay)
    // 和 TPDirect.paymentRequestApi.checkAvailability() 的結果是一樣的
    // if (!result.browserSupportPaymentRequest) {
    //     return
    // }

    // 代表使用者是否有符合 supportedNetworks 與 supportedMethods 的卡片
    // paymentRequestApi ---> canMakePaymentWithActiveCard is result of canMakePayment
    // apple pay         ---> canMakePaymentWithActiveCard is result of canMakePaymentsWithActiveCard
    
    pay_button = document.getElementById('pay')
    pay_button.style.display = 'inline-block';

    pay_button.addEventListener('click', function (event) {
        TPDirect.paymentRequestApi.getPrime(function(result) {
            console.log('paymentRequestApi.getPrime result', result)
            // result.google_pay 有 Pay with Google 回傳的東西
        })
    })
})
```

### 完整 index.html 頁面

[TapPay Payment Request API - Pay with Google Example](./example/index.html)