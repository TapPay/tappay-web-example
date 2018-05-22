document.addEventListener('DOMContentLoaded', () => {
    
    // Step 1
    TPDirect.setupSDK(11327, 'app_whdEWBH8e8Lzy4N6BysVRRMILYORF6UxXbiOFsICkz0J9j1C0JUlCHv1tVJC', 'sandbox')
    
    // Step 2
    TPDirect.samsungPay.setup({
        country_code: 'tw'
    })

    // Step 3
    var paymentRequest = {
        // Optional, 預設全部支援
        supportedNetworks: ['VISA', 'MASTERCARD'],
        total: {
            // 此為在手機上會顯示的商家名稱
            label: 'TapPay',
            amount: {
                currency: 'TWD',
                value: '50'
            }
        }
    }
    TPDirect.samsungPay.setupPaymentRequest(paymentRequest)

    // Step 4
    TPDirect.samsungPay.setupSamsungPayButton('#samsung-pay-button', {
        // black, white
        color: 'black',
        // pay, buy
        type: 'pay',
        // rectangular, pill
        shape: 'rectangular'
    })

    // Step 5
    $('#samsung-pay-button').click(function () {
        TPDirect.samsungPay.getPrime(function (result) {
            handlePayByPrime(result)

            if (result.status !== 0) {
                return console.error('samsungPay getPrime failed: ' + result.msg)
            }
        
            console.log('get-prime success')
            // 把 prime 傳到您的 server，並使用 Pay by Prime API 付款
            var prime = result.prime
        
            // 此為用戶選擇的卡片
            // 注意：此卡號為實體卡號（非 token 卡號）
            var card_lastfour = result.card.lastfour
            var card_type = result.card.type
        })
    })
});

function handlePayByPrime(result) {
    document.querySelector('#result1').innerHTML = JSON.stringify(result, null, 4)
    document.querySelector('.result1').classList.remove('hidden')
    

    if (result.status === 0) {
        document.querySelector('.curl').classList.remove('hidden')
    } else {
        document.querySelector('.curl').classList.add('hidden')
    }
    

    var command = `
    curl -X POST https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime \\
    -H 'content-type: application/json' \\
    -H 'x-api-key: partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM' \\
    -d '{
        "partner_key": "partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM",
        "prime": "${result.prime}",
        "amount": "${parseInt(result.total_amount)}",
        "merchant_id": "GlobalTesting_CTBC",
        "details": "Some item",
        "cardholder": {
            "phone_number": "0987654321",
            "name": "王小明",
            "email": "test@example.com",
            "zip_code": "123",
            "address": "台北市xxx街xx號",
            "national_id": "A123456789"
        }
    }'`.replace(/                /g, '')

    document.querySelector('#curl').innerHTML = command

}