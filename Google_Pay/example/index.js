document.addEventListener('DOMContentLoaded', () => {
    var googlePaySetting = {
        googleMerchantId: "Come from google portal",
        tappayGoogleMerchantId: "Come from tappay portal",
        allowedCardAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
        merchantName: "TapPay Test!",
        emailRequired: true, // optional
        shippingAddressRequired: true, // optional,
        billingAddressRequired: true, // optional
        billingAddressFormat: "MIN", // FULL, MIN

        allowPrepaidCards: true,
        allowedCountryCodes: ['TW'],

        phoneNumberRequired: true // optional
    }
    TPDirect.googlePay.setupGooglePay(googlePaySetting)

    var paymentRequest = {
        allowedNetworks: ["AMEX", "JCB", "MASTERCARD", "VISA"],
        price: "123", // optional
        currency: "TWD", // optional
    }
    TPDirect.googlePay.setupPaymentRequest(paymentRequest, function (err, result) {
        if (result.canUseGooglePay) {
            TPDirect.googlePay.setupGooglePayButton({
                el: "#container",
                color: "black",
                type: "long",
                getPrimeCallback: function(err, prime) {
                    console.log('paymentRequestApi.getPrime result', prime)
                    handlePayByPrime(prime)
                }
            })
        }
    })

    function handlePayByPrime(result) {
        document.querySelector('#result1').innerHTML = JSON.stringify(result, null, 4)
        document.querySelector('.result1').classList.remove('hidden')
        document.querySelector('.curl').classList.remove('hidden')
        

        var command = `
        curl -X POST https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime \\
        -H 'content-type: application/json' \\
        -H 'x-api-key: partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM' \\
        -d '{
            "partner_key": "partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM",
            "prime": "${result}",
            "amount": "1",
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
})