# Cardholder Fields

## Overview

1. 設定四個 cardholder field container
2. 利用 TPDirect.setupSDK 設定參數
3. 使用 TPDirect.cardholder.setup 設定外觀
4. TPDirect.cardholder.onUpdated 取得 Cardholder Fields 狀態
5. 利用 TPDirect.cardholder.getPrime 來取得 prime 字串

## 1. 四個 cardholder field container

在您的 HTML 裡面，加入 4個 div ，做為 Cardholder fields Container

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
<div class="tpfield" id="name_en"></div>
<div class="tpfield" id="email"></div>
<div class="tpfield" id="phone"></div>
<div class="tpfield" id="phone_country_code"></div>
```

## 2. Setup SDK 

```js
<script src="https://js.tappaysdk.com/sdk/tpdirect/v5.19.2"></script>
<script>
    TPDirect.setupSDK(APP_ID, 'APP_KEY', 'sandbox')
</script>
```

## 3. TPDirect.cardholder.setup(config)

詳細的 config 設定內容可以參考(TapPay Docs - Cardholder Field Config)[https://docs.tappaysdk.com/tutorial/zh/web/front.html#tpdirect-card-setup12]

```js
const  fields: {
    name_en: {
        element: document.getElementById('name_en'),
        placeholder: 'English Name'
    },
    email: {
        element: document.getElementById('email'),
        placeholder: 'Email'
    },
    phone: {
        country_code: {
            element: document.getElementById('phone_country_code'),
            placeholder: '886'
        },
        number: {
            element: document.getElementById('phone_number'),
            placeholder: '912345678'
        }
    }
}

TPDirect.card.setup({
    fields: fields,
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
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

實作 TPDirect.cardholder.onUpdate，得知目前卡片資訊的輸入狀態<br>
Callback 函數回傳的物件內可以參考此文件(TapPay Docs - onUpdate)[https://docs.tappaysdk.com/tutorial/zh/web/front.html#onupdate13]

```javascript
TPDirect.cardholder.onUpdate(function (update) {
    /* Disable / enable submit button depend on update.canGetPrime  */
    /* ============================================================ */

    // update.canGetPrime === true
    //     --> you can call TPDirect.cardholder.getPrime()
    // const submitButton = document.querySelector('button[type="submit"]')
    if (update.canGetPrime) {
        // submitButton.removeAttribute('disabled')
        $('button[type="submit"]').removeAttr('disabled')
    } else {
        // submitButton.setAttribute('disabled', true)
        $('button[type="submit"]').attr('disabled', true)
    }

    /* Change form-group style when cardholder field status change */
    /* ======================================================= */

    // number 欄位是錯誤的
    if (update.status.name_en === 2) {
        setNumberFormGroupToError('.name-en-group')
    } else if (update.status.name_en === 0) {
        setNumberFormGroupToSuccess('.name-en-group')
    } else {
        setNumberFormGroupToNormal('.name-en-group')
    }

    if (update.status.email === 2) {
        setNumberFormGroupToError('.email-group')
    } else if (update.status.email === 0) {
        setNumberFormGroupToSuccess('.email-group')
    } else {
        setNumberFormGroupToNormal('.email-group')
    }
    
    if (update.status.phone_country_code === 2) {
        setNumberFormGroupToError('.phone-group')
    } else if (update.status.phone_country_code === 0) {
        setNumberFormGroupToSuccess('.phone-group')
    } else {
        setNumberFormGroupToNormal('.phone-group')
    }

    if (update.status.phone_number === 2) {
        setNumberFormGroupToError('.phone-group')
    } else if (update.status.phone.number === 0) {
        setNumberFormGroupToSuccess('.phone-group')
    } else {
        setNumberFormGroupToNormal('.phone-group')
    }
})
```

## 4. Get Prime


使用 TPDirect.cardholder.getPrime 取得 Prime
回傳格式可以參考 [TapPay Docs - Get Prime Result](https://docs.tappaysdk.com/tutorial/zh/web/front.html#get-prime15)

```js
// call TPDirect.cardholder.getPrime when user submit form to get cardholder prime
// $('form').on('submit', onSubmit)

function onSubmit(event) {
    event.preventDefault()

    // Get prime
    TPDirect.cardholder.getPrime((error, result) => {
        if (result.status !== 0) {
            alert('get prime error ' + result.msg)
            return
        }
        alert('get prime 成功，prime: ' + result.cardholder.prime)

        // send prime to your server, to pay with Pay by Prime API .
        // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    })
}
```
