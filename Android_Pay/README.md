# Android Pay with Payment Request API

## DEMO
<img src="./android_pay_get_prime.gif" width="300px"/>

## Required
1. TapPay SDK 2.3.3 
2. 請到 TapPay Portal 申請 Android Pay 用的 `androidPayPublicKey` 和 `androidPayMerchantId`

## Overview
1. 引入 SDK 並且設置好 APP_ID, APP_KEY, SERVER_TYPE
2. 使用 `TPDirect.paymentRequestApi.setupAndroidPay(androidPayPublicKey, androidPayMerchantId)` 初始化 Android Pay
3. 使用 `TPDirect.paymentRequestApi.checkAvailability()` 確認裝置是否能使用 Payment Request API
4. 使用 `TPDirect.paymentRequestApi.setupPaymentRequest(paymentRequest)` 初始化 Payment Request Data
5. 設置 `getPrimeCallback()`
6. 全部都準備完畢之後, 使用 `TPDirect.paymentRequestApi.getPrime(getPrimeCallback)` 啟動 Android Pay 

## 教學

### Step 1

初始化 SDK

```javascript
<script src="https://js.tappaysdk.com/tpdirect/v2_3_3"></script>
<script>
    TPDirect.setupSDK(APP_ID, 'APP_KEY', 'sandbox')
</script>
```

### Step 2

初始化 Android Pay

```javascript
TPDirect.paymentRequestApi.setupAndroidPay(androidPayPublicKey, androidPayMerchantId)
```

### Step 3

檢查裝置是否可以使用 Payment Request API

```javascript
if (TPDirect.paymentRequestApi.checkAvailability()) {
    // code, do somethig if the divce is compatiable with Payment Request API
}
```

### Step 4

建立 Payment Request Data

```javascript
var paymentRequest = {
    // 設定支援的卡別, 付款方式
    supportedNetworks: ['AMEX', 'MASTERCARD', 'VISA'],
    supportedMethods: ['basic-card', 'https://android.com/pay'],
    displayItems: [{
        label: 'TapPay - iPhone8',
        amount: { currency: 'TWD', value: '1.00' }
    }],
    total: {
        label: '總金額',
        amount: { currency: 'TWD', value : '1.00' }
    },
    //如果您提供運送方式選項,必須宣告'options', 'shippingOptions'
    shippingOptions: [{
            id: "standard",
            label: "🚛 Ground Shipping (2 days)",
            amount: {
                currency: "TWD",
                value: "5.00"
            }
        },
        {
            id: "drone",
            label: "🚀 Drone Express (2 hours)",
            amount: {
                currency: "TWD",
                value: "25.00"
            }
        }
    ],
    // options, 預設值為 false
    options: {
      requestPayerEmail: false,
      requestPayerName: false,
      requestPayerPhone: false,
      requestShipping: false,
    }
}
```

### Step 5

設置 `getPrimeCallback` 方法, 詳細請看 [TapPay Docs](https://docs.tappaysdk.com/android-pay/zh/front.html#response) 回傳結果

```javascript
function getPrimeCallback(result) {
    // result from tappay server
}
```

### Step 6

全部都完成後使用 `TPDirect.paymentRequestApi.getPrime(getPrimeCallback)` 啟動 Android Pay

## 完整 index.html 頁面

[TapPay Android Pay Example](./example/index.html)