document.addEventListener('DOMContentLoaded', () => {

    var pay_button
    if (TPDirect.paymentRequestApi.checkAvailability()) {
        
        var data = {
            supportedNetworks: ['MASTERCARD', 'VISA', 'AMEX'],
            supportedMethods: ['pay_with_google'],
            displayItems: [{
                label: 'iPhone8',
                amount: {
                    currency: 'TWD',
                    value: '1.00'
                }
            }],
            total: {
                label: '付給 TapPay',
                amount: {
                    currency: 'TWD',
                    value: '1.00'
                }
            },
            shippingOptions: [{
                    id: "standard",
                    label: "🚛 Ground Shipping (2 days)",
                    // apple pay only
                    detail: 'Estimated delivery time: 2 days',
                    amount: {
                        currency: "TWD",
                        value: "5.00"
                    }
                },
                {
                    id: "drone",
                    label: "🚀 Drone Express (2 hours)",
                    // apple pay only
                    detail: 'Estimated delivery time: 2 hours',
                    amount: {
                        currency: "TWD",
                        value: "25.00"
                    }
                },
            ],
            // optional
            options: {
                requestPayerEmail: true,
                requestPayerName: true,
                requestPayerPhone: true,
                requestShipping: true,
                // https://docs.tappaysdk.com/payment-request-api/zh/reference.html#shippingtype
                shippingType: 'shipping'
            }
        }

        TPDirect.setupSDK(11327, 'app_whdEWBH8e8Lzy4N6BysVRRMILYORF6UxXbiOFsICkz0J9j1C0JUlCHv1tVJC', 'sandbox')
        
        TPDirect.paymentRequestApi.setupPayWithGoogle({
            // defaults to ['CARD', 'TOKENIZED_CARD']
            allowedPaymentMethods: ['CARD', 'TOKENIZED_CARD'],
            
            // Indicates whether or not you allow prepaid debit cards as a form of payment.
            // Set to true to allow prepaid debit cards. Otherwise, set to false.
            // defaults to true
            allowPrepaidCards: true,
            
            // defaults to false
            billingAddressRequired: false,
            // defaults to  'MIN'
            billingAddressFormat: 'MIN', // FULL, MIN

            // Set the ISO 3166-1 alpha-2 formatted country codes of the countries to which shipping is allowed.
            // If not specified, all countries are allowed.
            // defaults to undefined (allow all shipping address)
            // allowedCountryCodes: ['TW']
        })

    
        TPDirect.paymentRequestApi.setupPaymentRequest(data, function (result) {
            console.log('TPDirect.paymentRequestApi.setupPaymentRequest.result', result)

            // 代表瀏覽器支援 payment request api (或 apple pay)
            // 和 TPDirect.paymentRequestApi.checkAvailability() 的結果是一樣的
            // if (!result.browserSupportPaymentRequest) {
            //     return
            // }

            // 代表使用者是否有符合 supportedNetworks 與 supportedMethods 的卡片
            // paymentRequestApi ---> canMakePaymentWithActiveCard is result of canMakePayment
            // apple pay         ---> canMakePaymentWithActiveCard is result of canMakePaymentsWithActiveCard
        
            pay_button = document.getElementById('pay')
            pay_button.style.display = 'inline-block';

            pay_button.addEventListener('click', function (event) {
                TPDirect.paymentRequestApi.getPrime(function(result) {
                    console.log('paymentRequestApi.getPrime result', result)
                    handlePayByPrime(result, data)
                })
            })
        })
        document.getElementById('support').textContent = '裝置支援 PaymentRequest / Apple Pay'
    }
    else {
        $('.support').removeClass("info").addClass("error")
        document.getElementById('support').textContent = '裝置不支援 PaymentRequest / Apple Pay'
    }
});

function handlePayByPrime(result, paymentRequest) {
    document.querySelector('#result1').innerHTML = JSON.stringify(result, null, 4)
    document.querySelector('.result1').classList.remove('hidden')
    document.querySelector('.curl').classList.remove('hidden')
    

    var command = `
    curl -X POST https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime \\
    -H 'content-type: application/json' \\
    -H 'x-api-key: partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM' \\
    -d '{
        "partner_key": "partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM",
        "prime": "${result.prime}",
        "amount": "${result.total_amount}",
        "merchant_id": "GlobalTesting_CTBC",
        "details": "Some item",
        "cardholder": {
            "phone_number": "${result.payer.phone}",
            "name": "${result.payer.name}",
            "email": "${result.payer.email}",
            "zip_code": "123",
            "address": "${result.shippingAddress.addressLine.join('\'')}",
            "national_id": "A123456789"
        }
    }'`.replace(/                /g, '')

    document.querySelector('#curl').innerHTML = command

}