import { mainData } from './data.js';
import { mainDataResult } from './result-exmaple.js';



function transformData(data) {
    const result = [];

    for (let i = 0; i < data.length; i++) {
        const group = data[i]['group'];

        if (i in result === false) {
            result[i] = [];
        }

        if ('group' in result[i] === false) {
            result[i]['group'] = [];
        }

        for (let i2 = 0; i2 < group.length; i2++) {
            const groupChild = group[i2];

            if (i2 in result[i]['group'] === false) {
                result[i]['group'][i2] = {};
            }

            result[i]['group'][i2]['price'] = getPrices(groupChild);
            result[i]['group'][i2]['id'] = getIds(groupChild);
            result[i]['group'][i2]['productUrl'] = getProductUrls(groupChild);
            result[i]['group'][i2]['rank'] = getRanks(groupChild);
        }
    }

    function getFloatFromString(str) {
        const regex = /[+-]?\d+(\.\d+)?/g;

        const result = str.match(regex);
        if (result) {
            return parseFloat(result[0]);
        }

        return 0;
    }


    function getPrices(groupChild) {
        const prices = groupChild['price'];
        const parsedPrices = [];
        if (prices) {
            for (let i = 0; i < prices.length; i++) {
                const price = prices[i];
                parsedPrices.push({ text: getFloatFromString(price.text) });
            }
        }

        return parsedPrices;
    }

    function getRanks(groupChild) {
        const ranks = groupChild['rank'];
        const parsedRanks = [];

        if (ranks) {
            for (let i = 0; i < ranks.length; i++) {
                const rank = ranks[i];
                parsedRanks.push({ text: getFloatFromString(rank.text) });
            }
        }

        return parsedRanks;
    }

    function getProductUrls(groupChild) {
        const urls = groupChild['productUrl'];
        const newUrls = [];

        if (urls) {
            for (let i = 0; i < urls.length; i++) {
                const url = urls[i];
                newUrls.push({ text: 'https://www.metro.ca' + url.text });
            }
        }

        return newUrls;
    }

    function getIds(groupChild) {
        const urls = groupChild['productUrl'];
        const ids = [];

        if (urls) {
            for (let i = 0; i < urls.length; i++) {
                const url = urls[i];
                ids.push({ text: parseIdFromUrl(url.text) });
            }
        }


        function parseIdFromUrl(url) {
            const splittedUrl = url.split('/');
            const lastArrayIndex = splittedUrl.length - 1;

            return splittedUrl[lastArrayIndex];
        }

        return ids;
    }

    return result;
}

function rednerTransformedData(data) {
    let html = '<ol>';

    for (let i = 0; i < data.length; i++) {
        for (let i2 = 0; i2 < data[i]['group'].length; i2++) {
            const currentProduct = data[i]['group'][i2];

            let price = '';

            if (0 in currentProduct.price && currentProduct.price[0] && 'text' in currentProduct.price[0]) {
                price = `<strong>price:</strong> ${currentProduct.price[0].text}<br>`;
            }

            const li = `<li>
            <a href="${currentProduct.productUrl[0].text}">
            <strong>id:</strong> ${currentProduct.id[0].text}<br> 
            ${price}
            <strong>rank:</strong> ${currentProduct.rank[0].text}<br>
            </a>
            </li>`;
            html += li;
        }
    }

    html += '</ol>';

    document.getElementById('result').innerHTML = html;
}


const transofmedData = transformData(mainData);

rednerTransformedData(transofmedData);