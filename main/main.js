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
//数据库商品列表
const allItems = loadAllItems();
//促销产品表
const promotionItems = loadPromotions();
//判断输入的商品中是否存在不合法输入或者数据库不存在的商品输入数据
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
//获得输入的商品列表统计值
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
        } else {
            let goodId = parseInt(item.substr(4).trim());
            if (buyedGoods[goodId] == undefined)
                buyedGoods[goodId] = 1;
            else buyedGoods[goodId] += 1;
        }
    })
    return buyedGoods;
}
//判断是此商品ID的商品是否在促销
function isInPromotion(goodId) {
    let flag = false;
    promotionItems[0].barcodes.forEach((element) => {
        if (parseInt(element.substr(4)) == goodId)
            flag = true;
    })
    return flag;
}
//打印收据
function printReceipt(barcodes) {
    let receipt = "***<没钱赚商店>收据***\n";
    //金额总计
    let totalSum = 0;
    //优惠金额
    let reduce = 0;
    //购买的商品列表
    let buyedGoods = getBuyedGoods(barcodes);
    buyedGoods.forEach(function (goodNumber, goodId) {
        if (goodNumber != undefined) {
            let sum = allItems[goodId].price * goodNumber;
            if (goodNumber >= 3) {
                if (isInPromotion(goodId)) {
                    let decrease = Math.floor(goodNumber / 3);
                    let after = goodNumber - decrease;
                    sum = after * allItems[goodId].price;
                    reduce += decrease * allItems[goodId].price
                }
            }
            totalSum += sum;
            receipt += `名称：${allItems[goodId].name}，数量：${goodNumber}${allItems[goodId].unit}，单价：${allItems[goodId].price.toFixed(2)}(元)，小计：${sum.toFixed(2)}(元)\n`;
        }
    });
    receipt += `----------------------\n总计：${totalSum.toFixed(2)}(元)\n节省：${reduce.toFixed(2)}(元)\n**********************`;
    console.log(receipt);
}
printReceipt(tags);