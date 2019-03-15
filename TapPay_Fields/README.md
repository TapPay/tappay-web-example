# TapPay Fields

## DEMO

<img src="./TapPay_Field.gif">

## Overview

1. 設定三個 tappay field container
2. 利用 TPDirect.setupSDK 設定參數
3. 使用 TPDirect.card.setup 設定外觀
4. TPDirect.card.onUpdated 取得 TapPay Fields 狀態
5. 利用 TPDirect.card.getPrime 來取得 prime 字串

## 1. 三個 tappay field container

在您的 HTML 裡面，加入3個 div ，做為 TapPay fields Container

```html
<style>
    .tpfield {
        height: 40px;
        width: 300px;
        border: 1px solid gray;
        margin: 5px 0;
        padding: 5px;
    }
</style>
<div class="tpfield" id="card-number"></div>
<div class="tpfield" id="card-expiration-date"></div>
<div class="tpfield" id="card-ccv"></div>
```

## 2. Setup SDK 

```js
<script src="https://js.tappaysdk.com/tpdirect/v2_3_3"></script>
<script>
    TPDirect.setupSDK(APP_ID, 'APP_KEY', 'sandbox')
</script>
```

## 3. TPDirect.card.setup(config)

名稱 | 類別 | 內容 |
--- | --- | --- |
fields | Object | <table><tr><th>名稱</th><th>類別</th><th>內容</th></tr><tr><td>number</td><td>Object</td><td>element: CSS Selector or DOM element<br>placeholder: String</td></tr><tr><td>expirationDate</td><td>Object</td><td>element: CSS Selector or DOM  element<br>placeholder: String</td></tr><tr><td>ccv</td><td>Object</td><td>element: CSS Selector or DOM element<br>placeholder: String</td></tr></table>
styles | Object | 支援的 CSS 屬性，請參考 [TapPay Fields Styles](https://docs.tappaysdk.com/reference.html#tappay-fields-styles "TapPay Fields Styles")

```js
// 如果要設定成 CCV 為選填的話
// fields 裡面的 ccv 有帶的話就是必填, 不帶的話就是選填
// 以下提供必填以及選填的 Example
// 必填 CCV Example
var fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: '後三碼'
    }
}
// 選填 CCV Example
var fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    }
}
TPDirect.card.setup({
    fields: fields,
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.cvc': {
            // 'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            // 'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            // 'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
})
```

## 3. onUpdate

實作 TPDirect.card.onUpdate，得知目前卡片資訊的輸入狀態<br>
Callback 函數回傳的物件內將會有以下幾個屬性

名稱 | 內容
--- | ---
cardType (String) | mastercard, visa, jcb, amex, unknown
canGetPrime (boolean) | true = 全部欄位皆為正確，可以呼叫 getPrime
hasError (boolean) | true = 任何欄位有錯誤
status.number (int) | 回傳的 status code 請參考 [reference](https://docs.tappaysdk.com/reference.html#status-code "status code")
status.expiry (int) | 回傳的 status code 請參考 [reference](https://docs.tappaysdk.com/reference.html#status-code "status code")
status.cvc (int) | 回傳的 status code 請參考 [reference](https://docs.tappaysdk.com/reference.html#status-code "status code")

```javascript
TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    if (update.canGetPrime) {
        // Enable submit Button to get prime.
        // submitButton.removeAttribute('disabled')
    } else {
        // Disable submit Button to get prime.
        // submitButton.setAttribute('disabled', true)
    }
                                            
    // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unknown']
    if (update.cardType === 'visa') {
        // Handle card type visa.
    }

    // number 欄位是錯誤的
    if (update.status.number === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }
    
    if (update.status.expiry === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }
    
    if (update.status.cvc === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.cvc === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }
})
```


## 4. Get Tappay Fields Status

> TPDirect.card.getTappayFieldsStatus()

此方法可得到 TapPay Fields 卡片資訊的輸入狀態<br>
與 TPDirect.card.onUpdate Callback 物件相同

## 5. Get Prime


使用 TPDirect.card.getPrime 取得 Prime

名稱 | 內容
--- | ---
status | 錯誤代碼，0 為成功
card | 卡片資訊，將會回傳以下幾個值：<br><table><tr><th>名稱</th><th>類別(長度)</th><th>內容</th></tr><tr><td>prime</td><td>String(64)</td><td>prime 字串，於 <a href="https://docs.tappaysdk.com/tutorial/ch/back.html#pay-by-prime-api">Pay by Prime</a> 交易時使用</td></tr><tr><td>bincode</td><td>String(6)</td><td>卡片前六碼</td></tr><tr><td>lastfour</td><td>String(4)</td><td>卡片後四碼</td></tr><tr><td>issuer</td><td>String</h><td>發卡銀行</td></tr><tr><td>funding</td><td>int</td><td>卡片類別<br>0 = 信用卡 (Credit Card)<br>1 = 簽帳卡 (Debit Card)<br>2 = 預付卡 (Prepaid Card)</td></tr><tr><td>type</td><td>int</td><td>卡片種類<br>1 = VISA<br>2 = MasterCard<br>3 = JCB<br>4 = Union Pay<br>5 = AMEX</td></tr><tr><td>level</td><td>String</td><td>卡片等級</td></tr><tr><td>country</td><td>String</td><td>發卡行國家</td></tr><tr><td>countrycode</td><td>String</td><td>發卡行國家碼</td></tr></table>
clientip | 交易者的 IP 位置

```js
// call TPDirect.card.getPrime when user submit form to get tappay prime
// $('form').on('submit', onSubmit)

function onSubmit(event) {
    event.preventDefault()

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('can not get prime')
        return
    }

    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            alert('get prime error ' + result.msg)
            return
        }
        alert('get prime 成功，prime: ' + result.card.prime)

        // send prime to your server, to pay with Pay by Prime API .
        // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    })
}
```



## 6. TapPay Fields focus style

為了讓您可以對 TapPay Fields 的 focus state 進行 style, 我們會在 field focus 的時候，把 tappay field container 加上 `tappay-field-focus` 這個 class，您可以對此 class 撰寫 css

```css
/* Bootstrap 的 focus style */
.tappay-field-focus {
    border-color: #66afe9;
    outline: 0;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
}
```
