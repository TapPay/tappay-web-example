# PXPay Plus with TapPay

## Required

1. 請使用 Web SDk v5.20.0 以上版本使用 PXPay Plus, 舊版本不支援 PXPay Plus
2. 請到 TapPay Portal 申請帳號，取得 APP_ID 和 APP_KEY

## Overview

1. 前端用 `TPDirect.pxPayPlus.getPrime()` 拿到 PXPay Plus 專屬的 `prime`
2. 前端等待後端伺服器回傳 `payment_url` 並使用 `TPDirect.redirect(payment_url)` 的方式讓使用者進行 PXPay Plus 付款

## 教學

### Step 1

首先我們要建立出付款頁面 `index.html` 並且在 `<head></head>` 中引入 SDK

```html
<script src="https://js.tappaysdk.com/sdk/tpdirect/v5.20.0"></script>
```

### Step 2

初始化 TapPay SDK

```js
TPDirect.setupSDK(APP_ID, "APP_KEY", 'SERVER_TYPE')
```

### Step 3

使用 `TPDirect.pxPayPlus.getPrime(callback)` 去拿 `prime`

```js
TPDirect.pxPayPlus.getPrime(function(result) {
    // code
})
```

result 的資料格式為

名稱 | 型別 | 內容
--- | --- | ---
status | Int | 錯誤代碼，0 為成功
msg | String | 錯誤訊息
prime | String | prime 字串 `va_`
clientip | String | 交易者的 IP 位置


### 完整 index.html 頁面

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>PXPay Plus Example</title>
    <script src="https://code.jquery.com/jquery-1.10.1.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.13/semantic.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.13/semantic.min.js"></script>
    <script src="https://js.tappaysdk.com/sdk/tpdirect/v5.20.0"></script>
    <script>
        TPDirect.setupSDK(11327, 'app_whdEWBH8e8Lzy4N6BysVRRMILYORF6UxXbiOFsICkz0J9j1C0JUlCHv1tVJC', 'sandbox')
    </script>
</head>

<body>
<div class="payment-view ui grid centered stackable doubling">
    <br>
    <div class="row"></div>
    <div class="ten wide column ">
        <div class="ui center aligned segment">
            <h2>PXPay Plus Test</h2>
            <button id='sendButton' class="ui button">Pay with PXPay Plus</button>
        </div>
        <div class="ui segment">
            <pre id="result1" class="ui info message" style="overflow-x: auto"></pre>
        </div>
        <div class="ui segment">
                <pre id="curl" class="ui info message" style="overflow-x: auto">
        </div>
    </div>
</div>
</body>
<script>
    // 還未付款的頁面 index.html
    // 需要把 prime 送到伺服器
    var sendButton = document.getElementById("sendButton")
    $('button#sendButton').click(function() {
        // callback style
        TPDirect.pxPayPlus.getPrime(function (error, result) {
            // result 就是 get prime 拿到的結果
            document.querySelector('#result1').innerHTML = JSON.stringify(result, null, 4)
            // 拿到 get prime 結果後就需要往後端伺服器送
            var command = `Use following command to send to server \n\n
curl -X POST https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime \\
-H 'content-type: application/json' \\
-H 'x-api-key: partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM' \\
-d '{
    "partner_key": "partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM",
    "prime": "${result.prime}",
    "amount": "1",
    "merchant_id": "GlobalTesting_PX_PAY_Plus_EC",
    "details": "Some item",
    "cardholder": {
        "phone_number": "+886923456789",
        "name": "王小明",
        "email": "LittleMing@Wang.com",
        "zip_code": "100",
        "address": "台北市天龍區芝麻街1號1樓",
        "national_id": "A190902632",
        "member_id": "0123498765"
    },
    "result_url": {
    "result_url": {
        "frontend_redirect_url": "https://tappay.github.io/tappay-web-example/PXPay_Plus/example/index.html",
        "backend_notify_url": "https://your.server.com/notify"
    }
}'`
            $("#curl").html(command)
        })

        // promise style
//         TPDirect.pxPayPlus.getPrime().then(function (result) {
//             // result 就是 get prime 拿到的結果
//             document.querySelector('#result1').innerHTML = JSON.stringify(result, null, 4)
//             // 拿到 get prime 結果後就需要往後端伺服器送
// var command = `Use following command to send to server \n\n
// curl -X POST https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime \\
// -H 'content-type: application/json' \\
// -H 'x-api-key: partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM' \\
// -d '{
//     "partner_key": "partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM",
//     "prime": "${result.prime}",
//     "amount": "1",
//     "merchant_id": "GlobalTesting_PX_PAY_Plus_EC",
//     "details": "Some item",
//     "cardholder": {
//         "phone_number": "+886923456789",
//         "name": "王小明",
//         "email": "LittleMing@Wang.com",
//         "zip_code": "100",
//         "address": "台北市天龍區芝麻街1號1樓",
//         "national_id": "A190902632",
//         "member_id": "0123498765"
//     },
//     "result_url": {
//         "frontend_redirect_url": "https://tappay.github.io/tappay-web-example/PXPay_Plus/example/index.html",
//         "backend_notify_url": "https://your.server.com/notify"
//     }
// }'`
//             $("#curl").html(command)
//         })
    })
</script>
</html>
```
