import { merge, isString } from './index'

/**
 * 保留几位小数
 */
export function decimalRound(num,v) {
    if(!num){
        num = 0;
    }else if(isString(num)){
        num = parseFloat(num);
    }else if(isNaN(parseFloat(num))){
        var a = 0;
        return a.toFixed(v);
    }
    return num.toFixed(v);
}

export var functor = function (v) {
    return typeof v === 'function' ? v : function (k) { return k; };
}

export var fMax = function (d) {
    return d.a;
}

export var fMin = function (d) {
    return d.i;
}

export var fClosePrice = function (d) {
    return d.c;
}

export var fOpenPrice = function (d) {
    return d.o;
}

export var fVol = function (d) {
    return d.n;
}

export var fMoney = function (d) {
    return d.np;
}

export function getDefaultRound(roundArr, nameArr) {
    var obj = {};
    var i = 0, k = 0, str = '';
    for (i = 0; i < roundArr.length; i++) {
        for (k = 0; k < nameArr.length; k++) {
            str = nameArr[k] + roundArr[i];
            obj[str] = NaN;
        }
    }
    return obj;
}

/**
 * 适合计算 k线 一定区间内最高价 最低价 (同时计算两个值)
 * LOWV:=LLV(LOW,N);
 * HIGHV:=HHV(HIGH,N);
 * @param  {array} data     
 * @param  {array} roundArr 
 * @param  {number} i        
 * @param  {array} preData  
 * @return {array}          
 */
export var getMaxMinDataInRound = function (data, roundArr, i, preData) {
    // var a = [];
    var result = {};

    for (var k = 0; k < roundArr.length; k++) {
        var currentInterval = roundArr[k];
        var str = 'maxR' + currentInterval;
        var str2 = 'minR' + currentInterval;

        var max = 0;
        var min = 1000000;
        var tempA, tempI, headA, headI;

        if (i + 1 < currentInterval) {
            break;
        }
        if (preData[str] !== null && preData[str]) {

            tempA = fMax(data[i]);
            tempI = fMin(data[i]);

            headA = fMax(data[i - currentInterval]);
            headI = fMin(data[i - currentInterval]);

            if (headA == preData[str] || (preData[str2] == headI)) {
                for (var j = 0; j < currentInterval; j++) {
                    tempA = fMax(data[i - j]);
                    tempI = fMin(data[i - j]);
                    max = tempA > max ? tempA : max;
                    min = tempI < min ? tempI : min;
                }
            } else {
                max = tempA > preData[str] ? tempA : preData[str];
                min = tempI < preData[str2] ? tempI : preData[str2];
            }

        } else {
            for (var j = 0; j < currentInterval; j++) {
                tempA = fMax(data[i - j]);
                tempI = fMin(data[i - j]);
                max = tempA > max ? tempA : max;
                min = tempI < min ? tempI : min;
            }
        }

        result[str] = max;
        result[str2] = min;
    }
    return result;
}

//默认是 计算 收盘价
export var getAverageDataInRound = function (data, roundArr, i, preData) {
    // var a = [];
    var result = {};
    var total, str3, currentInterval, j;

    for (var k = 0; k < roundArr.length; k++) {
        currentInterval = roundArr[k];
        str3 = 'ma' + currentInterval;
        total = 0;

        if (i + 1 < currentInterval) {
            break;
        }
        if (preData[str3] !== null && preData[str3]) {
            total = (preData[str3] * currentInterval) - fClosePrice(data[i - currentInterval]) + fClosePrice(data[i]);
        } else {
            for (j = 0; j < currentInterval; j++) {
                total += fClosePrice(data[i - j]);
            }
        }
        result[str3] = decimalRound(total / currentInterval, 4);

    }
    return result;
}

export var getVolWithStatusInRound = function (data, roundArr, i, preData) {
    // var a = [];
    var result = {};
    var totalUp, totalDown, str4, str5, currentInterval, j;
    var h, t;
    var tt, hh, rr, rr2;
    for (var k = 0; k < roundArr.length; k++) {
        currentInterval = roundArr[k];
        str4 = 'upVol' + roundArr[k];
        str5 = 'downVol' + roundArr[k];
        totalUp = 0;
        totalDown = 0;

        if (i < currentInterval) {
            break;
        }
        if (preData[str4] !== null && preData[str4]) {
            t = fClosePrice(data[i]) > fClosePrice(data[i - 1]) || false;
            h = fClosePrice(data[i - currentInterval]) > fClosePrice(data[i - currentInterval - 1]) || false;
            rr = preData[str4];
            rr2 = preData[str5];
            tt = fVol(data[i]);
            hh = fVol(data[i - currentInterval]);

            if (h && t) {
                totalUp = tt + rr - hh;
                totalDown = rr2;
            } else if (!h && t) {
                totalUp = tt + rr;
                totalDown = rr2 - hh;
            } else if (h && !t) {
                totalUp = rr - hh;
                totalDown = tt + rr2;
            } else if (!h && !t) {
                totalUp = rr;
                totalDown = tt + rr2 - hh;
            }

        } else {
            for (j = 0; j < currentInterval; j++) {
                if (fClosePrice(data[i - j]) > fClosePrice(data[i - j - 1])) {
                    totalUp += fVol(data[i - j]);
                } else {
                    totalDown += fVol(data[i - j]);
                }
            }
        }
        result[str4] = totalUp;
        result[str5] = totalDown;

    }
    return result;
}

export var roundInterpolates = {
    maxMinDataInRound: getMaxMinDataInRound,
    averageDataInRound: getAverageDataInRound,
    volStatusInRound: getVolWithStatusInRound
}

/**
 * 获取数组 data中 每个数据 一定周期内的最大最小平均
 * @param  {array} data         待整理的数据
 * @param  {array} roundArr     必须是 顺序 整型数字的数组 [10, 56] 
 * 可以用于计算  
 * MA(CLOSE,L5), 
 * SUM(Vol, M1) 但不支持 SUM(0, M1)
 */
export var getDataInRound = function (data, roundArr, fNameStr, nameArr) {
    var defaultRoundObj = getDefaultRound(roundArr, nameArr);
    var result = [];
    var roundObj = {};

    for (var i = 0; i < data.length; i++) {
        roundObj = roundInterpolates[fNameStr](data, roundArr, i, result[i - 1]);

        result[i] = merge(roundObj, defaultRoundObj);
    }
    return result;
}


export var calcMas = function (items, daysCount, type) {
    if (items.length === 0 || !items)
        return null;
    var maArr = [];

    var count = items.length;
    var item = {};

    var maSum = 0, close = 0, ma = 0;

    for (var i = 0; i < count; i++) {
        if (i < daysCount) {
            item = items[i];
            close = +(type === 'number' ? item : item['c']);
            maSum += close;
            ma = maSum / daysCount;
            maArr.push(ma);
            //                  maArr.push(false);
        } else {
            var startCalcIndex = i - daysCount + 1;
            maSum = 0;
            for (var j = startCalcIndex; j <= i; j++) {
                item = items[j];
                close = +(type === 'number' ? item : item['c']);
                maSum += close;
            }
            ma = maSum / daysCount;
            maArr.push(ma);
        }
    }
    return maArr;
}


//对应指标里的 if 函数
//若x 为true or 1  返回a， 否则返回 b
export var fIf = function (x, a, b) {
    if (x) return a;
    return b;
}

/**
 * 判断是否为空
 * @param {any} a 
 * @returns {number} 为空就返回1， 否则返回0；
 */
export var ISNULL = function (a) {
    if (a) return 0;
    return 1;
}

/**
 * EMA
 * @param {number} X    
 * @param {number} YPre 客户端指标解释中的 Y'
 * @param {number} N
 * @returns {number} 
 */
export var EMA = function (X, YPre, N) {
    YPre = YPre || 0;
    return (2 * X + (N - 1) * YPre) / (N + 1);
}

export var MAX = function (a, b) {
    return +a > +b ? +a : +b;
}

/*
* 取绝对值
 */
export var ABS = function (a) {
    return Math.abs(+a);
}

export var SMA = function (x, n, m, y) {
    return (m * x + (n - m) * y) / n;
}
