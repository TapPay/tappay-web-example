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
<script src="https://js.tappaysdk.com/sdk/tpdirect/v5.15.1"></script>
<script>
    TPDirect.setupSDK(APP_ID, 'APP_KEY', 'sandbox')
</script>
```

## 3. TPDirect.card.setup(config)

詳細的 config 設定內容可以參考(TapPay Docs - TapPay Field Config)[https://docs.tappaysdk.com/tutorial/zh/web/front.html#tpdirect-card-setup12]

```js
// 以下提供必填 CCV 以及選填 CCV 的 Example
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
        'input.ccv': {
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
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6, 
        endIndex: 11
    }
})
```

## 3. onUpdate

實作 TPDirect.card.onUpdate，得知目前卡片資訊的輸入狀態<br>
Callback 函數回傳的物件內可以參考此文件(TapPay Docs - onUpdate)[https://docs.tappaysdk.com/tutorial/zh/web/front.html#onupdate13]

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
    
    if (update.status.ccv === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.ccv === 0) {
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
回傳格式可以參考 [TapPay Docs - Get Prime Result](https://docs.tappaysdk.com/tutorial/zh/web/front.html#get-prime15)

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
