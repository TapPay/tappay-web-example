# Apple Pay with TapPay

## DEMO
<img src="./payment_request_apple_pay.gif" width="450px"/>

## Required

1. 請到 TapPay Portal 申請帳號，取得 APP_ID 和 APP_KEY
2. 準備好一個 https 的網站，才能去驗證 Domain，可以利用 ngrok 去建立 public domain 並且去驗證，詳細教學可以參考 [Ngrok - Connect to your localhost](https://medium.com/tappay/ngrok-connect-to-your-localhost-c6f3ba84525b)
3. 請先到 TapPay Portal & Apple Develop 去設定好 Merchant ID 以及 Domain，詳細設定方式可以參考 [TapPay Apple Pay 文件](https://docs.tappaysdk.com/apple-pay/zh/portal.html#apple-developer-add-domain-apple-pay-on-the-web)
4. 必須使用 v3 版的 SDK

### Overview

1. 引入 SDK 並且初始化 APP_ID, APP_KEY, SERVER_TYPE
2. 使用 `TPDirect.paymentRequestApi.checkAvailability()` 檢查瀏覽器是否可以用 Payment Request API
3. 設置 Payment Request Data, 並且在 `supportedMethods` 填入 `["apple_pay"]`
4. 使用 `TPDirect.paymentRequestApi.setupApplePay()` 設置 Apple Pay 特有的參數
5. 啟用 Payment Request API 並且綁定 button 的 click 事件去觸發 `TPDirect.paymentRequestApi.getPrime(function(result){})`

## 教學

### Step 1

首先我們要建立出付款頁面 `index.html` 並且在 `<head></head>` 中引入 SDK

```html
<script src="https://js.tappaysdk.com/sdk/tpdirect/v5.17.0"></script>
<script>
    TPDirect.setupSDK(APP_ID, "APP_KEY", 'SERVER_TYPE')
</script>
```

### Step 2

再來要檢查瀏覽器使否可以使用 Payment Request API  
可以使用 `TPDirect.paymentRequestApi.checkAvailability()` 確認使否能使用

### Step 3

確認可以使用 Payment Request API 之後  
建立出 Payment Request Data，並且在 `supportedMethods` 裡面填入 `apple_pay`  
可以讓 Payment Request API 支援 Apple Pay 方法  
詳細參數設定請參考[文件](https://docs.tappaysdk.com/payment-request-api/zh/front.html#paymentrequest)

```javascript
var data = {
    supportedNetworks: ['MASTERCARD', 'VISA', 'AMEX'],
    supportedMethods: ['apple_pay'],
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
        // https://docs.tappaysdk.com/payment-request-api/zh/reference.html#shippingtype
        shippingType: 'shipping'
    }
}
```

### Step 4

設置 Apple Pay 特有的參數包含 `merchantIdentifier` `countryCode`

```javascript
TPDirect.paymentRequestApi.setupApplePay({
    // required, your apple merchant id
    // merchant.tech.cherri.global.test 是 DEMO 頁面專門使用的 merchant id
    // 如果要在自己頁面上使用 Apple Pay 請參考 Required 去申請 Apple Pay merchant id
    merchantIdentifier: 'merchant.tech.cherri.global.test',
    // defaults to 'TW'
    countryCode: 'TW'
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

特別要注意的是使用 Apple Pay 的話在 `result.apple_pay` 會有 Apple Pay 回傳的東西

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
    
    // NOTE: apple pay 只會檢查使用者是否有在 apple pay 裡面綁卡片
    if (result.canMakePaymentWithActiveCard) {
        document.getElementById('support').textContent = '裝置可以使用 PaymentRequest / Apple Pay'
        $('#apple-pay').addClass('buy')
    }
    else {
        // 如果有支援 basic-card 方式，仍然可以開啟 payment request sheet
        // 如果是 apple pay，會引導使用者去 apple pay 綁卡片
        document.getElementById('support').textContent = '裝置支援 PaymentRequest / Apple Pay，但是沒有可以支付的卡片'
        $('#apple-pay').addClass('set-up')
    }

    if (window.ApplePaySession) {
        pay_button = document.getElementById('apple-pay')
        pay_button.style.display = 'inline-block';
    }

    pay_button.addEventListener('click', function (event) {
        TPDirect.paymentRequestApi.getPrime(function(result) {
            console.log('paymentRequestApi.getPrime result', result)
        })
    })
})
```

### 完整 index.html 頁面

[TapPay Payment Request API - Apple Pay Example](./example/index.html)