### Get CCV Prime 

此串接內容適合用於『當使用 Pay by Card Token API 時，希望帶入 CCV 進行交易，但卻不想經手明碼 CCV』情境<br>
透過 SDK 串接後, 可以使用 `TPDirect.ccv.getPrime()` 取得一串 ccv_prime, 並把 ccv_prime 帶入到 Pay by Card Token API 後即可進行交易<br>
註: ccv_prime 為一串亂數, 並不是敏感資訊

建議串接流程

1. 串接 Setup CCV Field
2. 串接 Setup Card Type
3. 串接 onUpdate
4. 串接 Get Prime

### Setup CCV field

透過此 `TPDirect.ccv.setup` 可以設定 ccv input 欄位

名稱 | 類別 | 內容
--- | --- | --- 
fields | JSONObject | 參考下面的 fields 的表格
styles | JSONObject | 支援的 CSS 屬性，請參考 <a target="_blank" href="https://docs.tappaysdk.com/tutorial/zh/reference.html#tappay-fields-styles">TapPay Fields Styles</a>

<br>
fields 的表格
<br>

名稱 | 類別 | 內容
--- | --- | ---
ccv | JSONObject | 包含以下兩個 key 值<br>1. element: CSS Selector or DOMelement<br>2. placeholder: String

```javascript
TPDirect.ccv.setup({
    fields: {
        ccv: {
            element: '#card-ccv',
            placeholder: 'ccv'
        }
    },
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.ccv': {
            'font-size': '16px'
        },
        // style focus state
        ':focus': {
            'color': 'black'
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

### Setup Card Type 
設置完 ccv input 欄位後, 可以透過 `TPDirect.ccv.setupCardType` 設定 ccv 相對應的長度

並可透過以下六個不同卡別直接設置, 若不設置預設則為 Unknown, ccv 長度當為 3 - 4 碼時, 可進行 Get CCV Prime


```javascript
TPDirect.CardType.VISA
TPDirect.CardType.JCB
TPDirect.CardType.AMEX
TPDirect.CardType.MASTERCARD
TPDirect.CardType.UNIONPAY
TPDirect.CardType.UNKNOWN
```

<br>
接著透過 `TPDirect.ccv.setupCardType(TPDirect.CardType.VISA)` 去設定所想要的卡別

### onUpdate

當在 ccv input 欄位輸入時, 可以透過 `TPDirect.ccv.onUpdate()` 去監測目前輸入狀況

```javascript
TPDirect.ccv.onUpdate((update) => {
    console.log(update)
})

// Example Data
{
  canGetPrime: true
  hasError: false
  status: {
    ccv: 0
  }
}
```
<br>
update 欄位結構為下表

名稱 | 類別 | 內容
--- | --- | ---
canGetPrime | Boolean | 是否能 Get CCV Prime
hasError | Boolean | 是否有錯誤
status.ccv | Number | 回傳的 status code 請參考 <a target="_blank" href="https://docs.tappaysdk.com/tutorial/zh/reference.html#status-code">reference</a>

### Get Prime 
最後透過 `TPDirect.ccv.getPrime` 可以取得 ccv_prime
並把這 ccv_prime 帶入到 Pay by Card Token API 的請求中，送到 TapPay 即可完成交易
`TPDirect.ccv.getPrime` 支援 callback 和 promise 兩個版本

透過 callback 取得 prime

```javascript
TPDirect.ccv.getPrime((error, response) => {
    if (error) {
        console.log(error)
        return
    }
    console.log(response)
})
```
<br>
透過 promise 取得 prime

```javascript
TPDirect.ccv.getPrime().then((response) => {
    console.log(response)
}).catch((error) => {
    console.log(error)
})
```
<br>
Response 資料結構為下表

名稱 | 類別 | 內容
--- | --- | --- 
status | Number | 錯誤代碼，0 為成功
msg | String | 訊息
ccv_prime | String | CCV Prime 字串，於 <a target="_blank" href="https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-card-token-api">Pay by Card Token</a> API 交易時使用
client_ip | String | 交易者的 IP 位置
