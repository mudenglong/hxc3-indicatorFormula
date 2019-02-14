import { IndicatorFormula, registerIndicatorFormula } from '../indicatorFormula';

export default class KDJ extends IndicatorFormula{
    static type = 'kdj';

    static defaultOption = {
        N: 9,
        M1: 3,
        M2: 3
    }

    calculate(data){
        var KDJ_N = this.get('N'),
            KDJ_M1 = this.get('M1'),
            KDJ_M2 = this.get('M2'),
            close,
            // low,
            // high,
            llvlow = Infinity,
            llvhigh = -Infinity,
            rsv,
            a = 0,
            b = 0,
            e,
            i,
            j,
            item = [];
        for (i = 0; i < data.length; i++) {

            close = data[i]['c'];
            // low = data[i]['i'];
            // high = data[i]['a'];
            llvlow = Infinity;
            llvhigh = -Infinity;

            if (i < KDJ_N) {
                j = 0;
            } else {
                j = i - KDJ_N + 1;
            }
            
            for (; j <= i; j++) {
                if (llvlow > data[j]['i']) {
                    llvlow = data[j]['i']
                }
                if (llvhigh < data[j]['a']) {
                    llvhigh = data[j]['a']
                } 
            }

            rsv = (close - llvlow) / (llvhigh - llvlow) * 100;
            if(isNaN(rsv) || rsv === -Infinity || rsv === Infinity) rsv = 0;

            if (i < KDJ_N) {
                a = (rsv + a * i) / (i + 1);
                b = (a + b * i) / (i + 1);
            } else {
                a = (rsv + (KDJ_M1 - 1) * a) / KDJ_M1;
                b = (a + (KDJ_M2 - 1) * b) / KDJ_M2;
            }
            
            e = 3 * a - 2 * b;

            // (a < 0) && (a = 0) || (a > 100) && (a = 100);
            // (b < 0) && (b = 0) || (b > 100) && (b = 100);
            // (e < 0) && (e = 0) || (e > 100) && (e = 100);

            item.push({
                xIndex: data[i].t,
                K: a,
                D: b,
                J: e
            });
        }
        return item;
    }

}

// 公式注册
registerIndicatorFormula(KDJ, KDJ.type);