# Direct Pay - iframe

## DEMO

![](https://media.giphy.com/media/3oxHQk8dTxGiyXatRm/giphy.gif)

## Required

1. 請先到 TapPay Portal 申請帳號，取得 APP_ID 和 APP_KEY

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
<script src="https://js.tappaysdk.com/tpdirect/v2_3_3"></script>
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
TPDirect.card.setup('#cardview-container', defaultCardViewStyle)
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
| update.status.cvc   | <table><thead><tr><td>Code</td><td>內容</td></tr></thead><tbody><tr><td>0</td><td>欄位已填好，並且沒有問題</td></tr><tr><td>1</td><td>欄位還沒有填寫</td></tr><tr><td>2</td><td>欄位有錯誤，此時在 CardView 裡面會用顯示 errorColor </td></tr><tr><td>3</td><td>使用者正在輸入中</td></tr></tbody></table>     |


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