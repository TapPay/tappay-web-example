# Direct Pay - iframe

## DEMO

<img src="https://media.giphy.com/media/3oxHQk8dTxGiyXatRm/giphy.gif" width="400px">

## Required

1. 請到 TapPay Portal 申請帳號，取得 APP_ID 和 APP_KEY

## Overview

1. 引用 SDK 並且初始化
2. 在 html 裡面加上要顯示 card view 得地方
3. 初始化 card view 並且設定基本樣式
4. 使用 `TPDirect.card.onUpdate(function(update){})` 去查看使用者輸入狀況
5. 當 `canGetPrime` 為 `true` 得時候, 使用 `TPDirect.card.getPrime(function(result){})` 進行 Get Prime

## 教學

### Step 1

引入 SKD 並且進行初始化

```javascript
<script src="https://js.tappaysdk.com/sdk/tpdirect/v5.18.0"></script>
<script>
    TPDirect.setupSDK(APP_ID, 'APP_KEY', 'sandbox')
</script>
```

### Step 2

在 html 裡面，加入顯示 card view 的地方

```html
<div>
    <label>CardView</label>
    <div id="tappay-iframe"></div>
</div>
```

### Step 3

初始化並且設定表單基本樣式

```javascript
var defaultCardViewStyle = {
    color: 'rgb(0,0,0)',
    fontSize: '15px',
    lineHeight: '24px',
    fontWeight: '300',
    errorColor: 'red',
    placeholderColor: ''
}
// 預設不戴第三個參數的話, 是會必須填入 CCV
TPDirect.card.setup('#cardview-container', defaultCardViewStyle)
// 帶入第三個參數, config.isUsedCcv 為以下兩種參數代表不同意思
// false 為 CCV 非必填
// true 為 CCV 必填

// 卡號輸入完畢，驗證成功後會將設定的起始位元至結束位元以 * 做遮蔽
// 若遮蔽後，點擊到信用卡欄位做變更(輸入或刪除卡號)，會將遮蔽卡號 * 清除
// 若結束位元超過信用卡卡號長度，會以信用卡卡號長度上限做遮蔽

// isMaskCreditCardNumber: boolean
// 設定是否要啟用遮蔽卡號功能
// beginIndex: Int
// 起始遮蔽卡號位元
// endIndex: Int
// 結束遮蔽卡號位元
TPDirect.card.setup('#cardview-container', defaultCardViewStyle, { 
    isUsedCcv: false,
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6, 
        endIndex: 11
    }
})
```

### Step 4

設定 `TPDirect.card.onUpdate(function(update){})` 去取得使用者輸入表單的狀況
分別可以取得下列五種狀況

| 名稱 | 內容 |
| -------- | -------- |
| update.canGetPrime  | true = 全部欄位皆為正確，可以呼叫 `getPrime` function |
| update.hasError     | true = 任何欄位有錯誤     |
| update.status.number| <table><thead><tr><td>Code</td><td>內容</td></tr></thead><tbody><tr><td>0</td><td>欄位已填好，並且沒有問題</td></tr><tr><td>1</td><td>欄位還沒有填寫</td></tr><tr><td>2</td><td>欄位有錯誤，此時在 CardView 裡面會用顯示 errorColor </td></tr><tr><td>3</td><td>使用者正在輸入中</td></tr></tbody></table> |
| update.status.expiry| <table><thead><tr><td>Code</td><td>內容</td></tr></thead><tbody><tr><td>0</td><td>欄位已填好，並且沒有問題</td></tr><tr><td>1</td><td>欄位還沒有填寫</td></tr><tr><td>2</td><td>欄位有錯誤，此時在 CardView 裡面會用顯示 errorColor </td></tr><tr><td>3</td><td>使用者正在輸入中</td></tr></tbody></table>     |
| update.status.ccv   | <table><thead><tr><td>Code</td><td>內容</td></tr></thead><tbody><tr><td>0</td><td>欄位已填好，並且沒有問題</td></tr><tr><td>1</td><td>欄位還沒有填寫</td></tr><tr><td>2</td><td>欄位有錯誤，此時在 CardView 裡面會用顯示 errorColor </td></tr><tr><td>3</td><td>使用者正在輸入中</td></tr></tbody></table>     |


### Step 5

設定完之後，當 `canGetPrime` 等於 `true` 的時候，就可以進行 Get Prime 了
`result` 回傳的格式可以參考 [TapPay Docs - Get Prime Result](https://docs.tappaysdk.com/tutorial/zh/web/front.html#get-prime)

```javascript
TPDirect.card.getPrime(function(result) {
    if (result.status !== 0) {
      console.error('getPrime error')
    }
    var prime = result.card.prime
    console.log('getPrime success: ' + prime)
})
```

## 完整 html 頁面

[Direct Pay - iframe](./example/index.html)