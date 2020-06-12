const Hashids = require('./js/hashids.min.js')
const https = require('https');
const Discord = require('discord.js');
const config = require('./config.json');


// Create a WebhookClient object to send messages
const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);

getStock()
.then(function(resolve)
{
    restock = checkRestock(resolve)
    // if (restock !== null) { restockAlert(restock) }
    restockAlert(restock)
})
.catch(function(reject)
{
    console.log("Reject");
    console.log(reject);
});


// -------------------------------------------------------------------------------------------- \\
// --------------------------------------- Stock Functions ------------------------------------ \\
// -------------------------------------------------------------------------------------------- \\
// -------------------------------------------------------------------------------------------- \\
// ------------------------------- Function to check for a restock ---------------------------- \\
// -------------------------------------------------------------------------------------------- \\
function checkRestock(stockData)
{
    
}


// -------------------------------------------------------------------------------------------- \\
// ---------------- Function to get the current stock numbers as a JSON object ---------------- \\
// -------------------------------------------------------------------------------------------- \\
function getStock()
{
    return new Promise (function(resolve, reject)
    {
        const stockURL = "https://oculusproxies.com/proxyconfig/getProxyStockCount"
        https.get(stockURL, function(res)
        {
            if (res.statusCode >= 400) { reject(res.statusCode) }
            let body = "";
            res.on('data', function (chunk)
            {
                body += chunk;
            });

            res.on('end', function()
            {
                const proxyData = JSON.parse(body);
                const decodedProxyData = decodeStock(proxyData);
                resolve(decodedProxyData)
            });
        });
    });
}


// -------------------------------------------------------------------------------------------- \\
// ----------------------- Function to decode the hashed stock numbers ------------------------ \\
// -------------------------------------------------------------------------------------------- \\
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


// -------------------------------------------------------------------------------------------- \\
// ------------------------------------- Discord Functions ------------------------------------ \\
// -------------------------------------------------------------------------------------------- \\
// -------------------------------------------------------------------------------------------- \\
// --------------------- Function to send a webhook to alert for a restock -------------------- \\
// -------------------------------------------------------------------------------------------- \\
function restockAlert(restockInfo)
{
    let description = "";
    for (var proxyType in restockInfo)
    {
        description += `${proxyType}: ${restockInfo[proxyType]}\n`;
    }

    let embed = new Discord.MessageEmbed()
    .setTitle('Restock Alert!')
    .setDescription(description)
    .setColor('#00ff00');

    webhookClient.send(
    {
        username: 'Oculus Restocks',
        embeds: [embed],
    });
}