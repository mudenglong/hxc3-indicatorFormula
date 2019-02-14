import { IndicatorFormula, registerIndicatorFormula } from '../indicatorFormula';

class MACD extends IndicatorFormula{
    
    calculate(data){
        var MACD_SHORT = this.get('SHORT'),
            MACD_LONG = this.get('LONG'),
            MACD_M = this.get('M'),
            s1 = MACD_SHORT - 1,
            s2 = MACD_SHORT + 1,
            l1 = MACD_LONG - 1,
            l2 = MACD_LONG + 1,
            m1 = MACD_M - 1,
            m2 = MACD_M + 1,
            i = 0,
            close,
            diff,
            dea,
            macd,
            emaShort,
            emaLong,
            item = [];

        for (i = 0; i < data.length; i++) {
            close = data[i]['c'];
            if (i == 0 || !close) {
                emaShort = emaLong = (close || 0);
                dea = diff = emaShort - emaLong;
                macd = 0;
            } else {
                emaShort = (2 * close + s1 * emaShort) / s2;
                emaLong = (2 * close + l1 * emaLong) / l2;
                diff = emaShort - emaLong;
                dea = (2 * diff + m1 * dea) / m2;
                macd = 2 * (diff - dea);
            }
            item.push({
                xIndex: data[i].t,
                MACD: macd,
                DIFF: diff,
                DEA: dea
            })
        }
        
        return item;
    }

}

MACD.type = 'macd';

MACD.defaultOption = {
    SHORT: 12,
    LONG: 26,
    M: 9
}


// 公式注册
registerIndicatorFormula(MACD, MACD.type);

export default MACD
