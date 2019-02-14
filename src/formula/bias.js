import { fClosePrice, getDataInRound } from '../util'
import { IndicatorFormula, registerIndicatorFormula } from '../indicatorFormula'; 

export default class BIAS extends IndicatorFormula{
    
    // L2, L3 实际中没有绘制，所以没有计算
    calculate(data){
        var L1 = this.get('L1'),
            L4 = this.get('L4'),
            L5 = this.get('L5');
        var a = 0,
            b = 0,
            c = 0,
            obj = {},
            result = [];

        var indexs = [L1, L4, L5];
        var s1 = 'ma' + indexs[0];
        var s2 = 'ma' + indexs[1];
        var s3 = 'ma' + indexs[2];
        var tempArr = getDataInRound(data, indexs, 'averageDataInRound', ['ma']);

        for (var i = 0; i < tempArr.length; i++) {
            obj = tempArr[i];
            if (obj[s1]) {
                a = (fClosePrice(data[i]) - obj[s1]) / obj[s1] * 100;
                if (obj[s2]) {
                    b = (fClosePrice(data[i]) - obj[s2]) / obj[s2] * 100;
                    if (obj[s3]) {
                        c = (fClosePrice(data[i]) - obj[s3]) / obj[s3] * 100;
                    }
                }

            }
            result.push({
                xIndex: data[i].t,
                BIAS: a,
                BIAS2: b,
                BIAS3: c
            })
        }
        return result;
    
    }

}

BIAS.type = 'bias';

BIAS.defaultOption = {
    L1: 6,
    L4: 12,
    L5: 24
}
// 公式注册
registerIndicatorFormula(BIAS, BIAS.type);