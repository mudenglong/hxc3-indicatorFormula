import { IndicatorFormula, registerIndicatorFormula } from '../indicatorFormula';

class BOLL extends IndicatorFormula{
    
    calculate(data){
        var BOLL_N = this.get('BOLL_N'),
            BOLL_P = this.get('BOLL_P'),
            close,
            mid,
            upper,
            lower,
            i,
            j,
            item = [],
            val,
            std,
            sumTotal = 0;
        for (i = 0; i < data.length; i++) {
            close = data[i].c;
            sumTotal += close;
            if (i >= (BOLL_N-1)) {
                mid = sumTotal / BOLL_N;
                std = 0;
                for (j = i - (BOLL_N-1); j <= i; j++) {
                    val = data[j].c - mid;
                    std += (val * val);
                }
                std = Math.sqrt(std / BOLL_N);
                upper = mid + BOLL_P * std;
                lower = mid - BOLL_P * std;
                sumTotal -= data[i - (BOLL_N-1)].c
            } else {
                mid = upper = lower = 0;
            }

            item.push({
                xIndex: data[i].t,
                MID: mid,
                UPPER: upper,
                LOWER: lower
            })
        }
        return item;
    }

}

BOLL.type = 'boll';

BOLL.defaultOption = {
    BOLL_N: 20,
    BOLL_P: 2
}

// 公式注册
registerIndicatorFormula(BOLL, BOLL.type);

export default BOLL
