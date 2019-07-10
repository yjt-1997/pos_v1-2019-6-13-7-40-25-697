'use strict';
const tags = [
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000003-2.5',
    'ITEM000005',
    'ITEM000005-2',
  ];
const allItems = loadAllItems();
function printReceipt(collection) {
    
}
function isValid(barcodes) {
    let isValid = true;
    let isExsit = false;
    for (let i = 0; i < barcodes.length; i++) {
        if (!/^ITEM[0-9]{6}(-[1-9]{1}[.]?[0-9]{0,1})?$/.test(barcodes[i])) {
            isValid = false;
            break;
        }
        for (let j = 0; j < allItems.length; j++) {
            let goodId = barcodes[i].substr(0, 11);
            if (goodId == allItems[j].barcode) {
                isExsit = true;
                break;
            }
        }
        if (!isExsit || !isValid)
            return false;
    }
    return isValid;
}
function getBuyedGoods(barcodes) {
    let buyedGoods = [];
    barcodes.filter(function (item) {
        if (item.indexOf("-") != -1) {
            let tempGood = item.split("-");
            let goodId = parseInt(tempGood[0].substr(4).trim());
            let number = parseFloat(tempGood[1].trim());
            if (buyedGoods[goodId] == undefined)
                buyedGoods[goodId] = number;
            else buyedGoods[goodId] += number;
        }
    })
}
console.log(isValid(tags));