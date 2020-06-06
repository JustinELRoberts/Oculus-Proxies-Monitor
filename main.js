const Hashids = require('./js/hashids.min.js')
const https = require('https');

getStock()

function getStock()
{
    const stockURL = "https://oculusproxies.com/proxyconfig/getProxyStockCount"
    https.get(stockURL, function(res)
    {
        let body = "";
        res.on('data', function (chunk)
        {
            body += chunk;
        });

        res.on('end', function()
        {
            const proxyData = JSON.parse(body);
            const decodedProxyData = decodeStock(proxyData);
            console.log(decodedProxyData);
        });
    });
}


function decodeStock(proxyData)
{
	let hashids = new Hashids.default("oCuLU$", 8);
    let decodedRes = {};
    for (var proxyType in proxyData)
    {
        let decodedVal = hashids.decode(proxyData[proxyType])
        decodedRes[proxyType] = decodedVal[0];
    }
	return decodedRes;
}