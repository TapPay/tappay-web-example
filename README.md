# TapPay Web Example

此專案是 TapPay SDK Get Prime 的範例
我們會介紹使用以下幾種 Get Prime 的方式

1. Direct Pay - iframe
2. Direct Pay - TapPay Fields
3. Direct Pay - Get CCV Prime
4. Apple Pay
5. Google Pay - 支援 Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, Opera, and UCWeb UC Browser.
6. LINE Pay
7. Payment Request API - 支援 Apple Pay、Direct Pay  
8. JKO Pay
9. Easy Wallet
10. Plus Pay
11. Pi Wallet
12. Virtual Account
13. Cash on Delivery
14. PXPay Plus
15. iPass Money

## 如何引入
SRI 驗證版本, 可以確保安全性

```
<script src="https://js.tappaysdk.com/sdk/tpdirect/<version>" type="text/javascript" 
integrity="sha256-<hash_key>" crossorigin="anonymous"></script>
```
每個版本對應的 hash key 請至 [Release Note](https://github.com/TapPay/tappay-web-example/releases) 中查找

無 SRI 驗證版本, 可以確保安全性
```
<script src="https://js.tappaysdk.com/sdk/tpdirect/<version>" type="text/javascript" ></script>
```

## 測試卡號
4242 4242 4242 4242
後三碼 123
備註: 卡片到期年份及月份使用超過目前年月份的效期即可

## Direct Pay - iframe

由 TapPay 幫您製作好表單，簡單操作好上手，詳細提供以及使用方式請詳見 [Direct Pay - iframe](./Direct_Pay_iframe) 的頁面  
或是可以直接到 [DEMO](https://tappay.github.io/tappay-web-example/Direct_Pay_iframe/example/index.html) 頁面試試 Get Prime !

## Direct Pay - TapPay Fields

提供讓您客製化表單的功能，詳細的功能以及使用方式請詳見 [Direct Pay - TapPay Fields](./TapPay_Fields) 的頁面  
或是可以直接到 [DEMO](https://tappay.github.io/tappay-web-example/TapPay_Fields/example/index.html) 頁面試試 Get Prime !

## Direct Pay - CCV Prime

提供讓您在此情境『當使用 Pay by Card Token API 時，希望帶入 CCV 進行交易，但卻不想經手明碼 CCV』下進行交易  
詳細的功能以及使用方式請詳見 [Direct Pay - CCV Prime](./CCV_Prime) 的頁面  
或是可以直接到 [DEMO](https://tappay.github.io/tappay-web-example/CCV_Prime/example/index.html) 頁面試試 Get CCV Prime !
## Apple Pay

提供 Apple Pay 服務，詳細的功能以及使用方式請詳見 [Apple Pay](./Apple_Pay) 的頁面  
或是可以直接到 [DEMO](https://tappay.github.io/tappay-web-example/Apple_Pay/example/index.html) 頁面試試 Get Prime !

## Google Pay

提供 Google Pay 服務，詳細的功能以及使用方式請詳見 [Google Pay](./Google_Pay) 的頁面  
或是可以直接到 [DEMO](https://tappay.github.io/tappay-web-example/Google_Pay/example/index.html) 頁面試試 Get Prime !

## Samsung Pay

提供 Samsung Pay 服務，詳細的功能以及使用方式請詳見 [Samsung Pay](./Samsung_Pay) 的頁面  
或是可以直接到 [DEMO](https://tappay.github.io/tappay-web-example/Samsung_Pay/example/index.html) 頁面試試 Get Prime !

## LINE Pay

提供 LINE Pay 服務，詳細的功能以及使用方式請詳見 [LINE Pay](./Line_Pay) 的頁面  
或是可以直接到 [DEMO](https://tappay.github.io/tappay-web-example/Line_Pay/example/index.html) 頁面試試 Get Prime !

## JKO Pay

提供 JKO Pay 服務，詳細的功能以及使用方式請詳見 [JKO Pay](./JKO_Pay) 的頁面  
或是可以直接到 [DEMO](https://tappay.github.io/tappay-web-example/JKO_Pay/example/index.html) 頁面試試 Get Prime !

## Easy Wallet

提供 Easy Wallet 服務，詳細的功能以及使用方式請詳見 [Easy Wallet](./Easy_Wallet) 的頁面  
或是可以直接到 [DEMO](https://tappay.github.io/tappay-web-example/Easy_Wallet/example/index.html) 頁面試試 Get Prime !

## Pi Wallet

提供 Pi Wallet 服務，詳細的功能以及使用方式請詳見 [Pi Wallet](./Pi_Wallet) 的頁面  
或是可以直接到 [DEMO](https://tappay.github.io/tappay-web-example/Pi_Wallet/example/index.html) 頁面試試 Get Prime !

## Plus Pay

提供 Plus Pay 服務，詳細的功能以及使用方式請詳見 [Plus Pay](./Plus_Pay) 的頁面  
或是可以直接到 [DEMO](https://tappay.github.io/tappay-web-example/Plus_Pay/example/index.html) 頁面試試 Get Prime !

## Payment Request API

提供 Payment Request API 服務，詳細的功能、使用方式以及 DEMO 頁面請詳見 [Payment Request API](./Payment_Request) 的頁面

## Virtual Account(ATM)

提供 Virtual Account(ATM) 服務，詳細的功能以及使用方式請詳見 [Virtual Account](./Virtual_Account) 的頁面  
或是可以直接到 [DEMO](https://tappay.github.io/tappay-web-example/Virtual_Account/example/index.html) 頁面試試 Get Prime !

## Cash On Delivery
提供 Cash On Delivery(超商物流) 服務，詳細的功能以及使用方式請詳見 [Cash On Delivery](./Cash_On_Delivery) 的頁面  
或是可以直接到 [DEMO](https://tappay.github.io/tappay-web-example/Cash_On_Delivery/example/index.html) 頁面試試 Get Prime !

## PXPay Plus 
提供 PXPay Plus 服務，詳細的功能以及使用方式請詳見 [PXPay Plus](./PXPay_Plus) 的頁面  
或是可以直接到 [DEMO](https://tappay.github.io/tappay-web-example/PXPay_Plus/example/index.html) 頁面試試 Get Prime !

## iPass Money
提供 iPass Money 服務，詳細的功能以及使用方式請詳見 [iPass Money](./IPassMoney) 的頁面  
或是可以直接到 [DEMO](https://tappay.github.io/tappay-web-example/IPassMoney/example/index.html) 頁面試試 Get Prime !