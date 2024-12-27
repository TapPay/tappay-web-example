# Cash On Delivery (超商物流)

## Required

1. 請使用 Web SDK v5.19.2 以上版本使用 Cash On Delivery, 舊版本不支援 Cash On Delivery
2. 請到 TapPay Portal 申請帳號，取得 APP_ID 和 APP_KEY

## Overview

1. 前端用 `TPDirect.cashOnDelivery.getPrime()` 拿到 Cash On Delivery (超商物流) 專屬的 `prime`
2. 前端用 `TPDirect.cashOnDelivery.setShipType(shipType, callback)` 設定物流通路
3. 前端用 `TPDirect.cashOnDelivery.getStoreId(callback)` 在 callback 中取得物流門市資訊
4. 前端把 `prime` 送到後端伺服器, 伺服器會回覆超商取貨付款相關資訊

## 教學

### Step 1

首先我們要建立出付款頁面 `index.html` 並且在 `<head></head>` 中引入 SDK

```html
<script src="https://js.tappaysdk.com/sdk/tpdirect/v5.19.2"></script>
```

### Step 2

初始化 TapPay SDK

```js
TPDirect.setupSDK(APP_ID, "APP_KEY", 'SERVER_TYPE')
```

### Step 3

設定物流通路

使用 `TPDirect.cashOnDelivery.setShipType(shipType, callback)` 去設定

名稱 | 型別 | 說明
--- | --- | ---
shipType | String | 物流通路，請選擇以下類型<br>TW_UNIMART：7-11<br>TW_FAMI：全家便利商店<br>TW_OK：OK便利商店<br>TW_HILIFE：萊爾富便利商店

```js
TPDirect.cashOnDelivery.setShipType(shipType , (status, msg) => {
    // code
})
```

名稱 | 型別 | 內容
--- | --- | ---
status | Int | 錯誤代碼，0 為成功
msg | String | 錯誤訊息

### Step 4
取得門市店號<br>
呼叫後將新開分頁顯示超商地圖，使用者選取完成後，透過 callback 取得門市資訊。

使用 `TPDirect.cashOnDelivery.getStoreId(callback)`

```js
TPDirect.cashOnDelivery.getStoreId((status, msg, result) => {

}) 
```
名稱 | 型別                  | 內容                                                                                                                  
--- |---------------------|---------------------------------------------------------------------------------------------------------------------
status | Int                 | 錯誤代碼，0 為成功，427 表示使用者關閉地圖                                                                                            
msg | String              | 錯誤訊息                                                                                                                
result | Object |<table><thead><tr><th>名稱</th><th>型別</th><th>內容</th></tr></thead><tbody><tr><td>store_id</td><td>String</td><td>門市店號</td></tr><tr><td>store_name</td><td>String</td><td>門市名稱</td></tr><tr><td>store_phone</td><td>String</td><td>門市電話</td></tr><tr><td>store_address</td><td>String</td><td>門市地址</td></tr><tr><td>shipType</td><td>String</td><td>物流通路，請選擇以下類型<br>TW_UNIMART：7-11<br>TW_FAMI：全家便利商店<br>TW_OK：OK便利商店<br>TW_HILIFE：萊爾富便利商店</td></tr></tbody></table>

### Step 5

使用 `TPDirect.cashOnDelivery.getPrime(callback)` 去拿 `prime`

```js
TPDirect.cashOnDelivery.getPrime(function(result) {
    // code
})
```

result 的資料格式為

名稱 | 型別 | 內容
--- | --- | ---
status | Int | 錯誤代碼，0 為成功
msg | String | 錯誤訊息
prime | String | prime 字串 `cd_`
clientip | String | 交易者的 IP 位置


### 完整 index.html 頁面

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Cash On Delivery(超商物流) Example</title>
    <script src="https://code.jquery.com/jquery-1.10.1.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.13/semantic.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.13/semantic.min.js"></script>
    <script src="https://js.tappaysdk.com/sdk/tpdirect/v5.19.2"></script>
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
            <h2>Cash On Delivery (超商物流) Get Store Id</h2>
            <select name="shipType" id="shipType" class="ui dropdown">
                <option value="TW_FAMI">全家</option>
                <option value="TW_UNIMART">7-11</option>
                <option value="TW_OK">OK</option>
                <option value="TW_HILIFE">萊爾富</option>
            </select>
            <button id='getStoreIdButton' class="ui button">Get Store Id</button>
        </div>
        <div class="ui segment">
            <pre id="storeInfoResult" class="ui info message" style="overflow-x: auto"></pre>
        </div>
        <div class="ui center aligned segment">
            <h2>Cash On Delivery (超商物流) Test</h2>
            <button id='sendButton' class="ui button">Pay with Cash On Delivery(超商物流)</button>
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
    let store_id
    let ship_type
    document.addEventListener("DOMContentLoaded", function (){
        $('#shipType').dropdown();
    })
    function setShipType() {
        ship_type = document.getElementById("shipType").value
        TPDirect.cashOnDelivery.setShipType(ship_type, (status, msg) => {
            console.log(status, msg)
        })
    }

    $('button#getStoreIdButton').click(function() {
        setShipType()
        TPDirect.cashOnDelivery.getStoreId((status, msg, result) => {
            if (status !== 0) {
                alert(`Get store fail status: ${status}, msg: ${msg}`)
                return
            }
            store_id = result.store_id
            document.querySelector('#storeInfoResult').innerHTML = JSON.stringify(result, null, 4)
        })
    })

    // 還未付款的頁面 index.html
    // 需要把 prime 送到伺服器
    var sendButton = document.getElementById("sendButton")
    $('button#sendButton').click(function() {
        // callback style
        TPDirect.cashOnDelivery.getPrime(function (error, result) {
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
    "amount": "16",
    "merchant_id": "GlobalTesting_COD",
    "details": "Some item",
    "cardholder": {
        "phone_number": "0923456789",
        "name": "王小明",
        "email": "LittleMing@Wang.com",
        "zip_code": "100",
        "address": "台北市天龍區芝麻街1號1樓",
        "national_id": "A123456789"
    },
    "result_url": {
        "frontend_redirect_url": "https://tappay.github.io/tappay-web-example/Cash_On_Delivery/example/index.html",
        "backend_notify_url": "https://your.server.com/notify"
    },
    "logistics_type": "C2C",
    "extra_info": {
        "shipping_recipient_info": {
            "ship_type": "${ship_type}",
            "store_id": "${store_id}",
            "shop_name": "測試商店"
        }
    }
}'`
            $("#curl").html(command)
        })
    })
</script>
</html>
```
