import { getDataInRound, fClosePrice } from '../util'
import { IndicatorFormula, registerIndicatorFormula } from '../indicatorFormula';
class WR extends IndicatorFormula{

    calculate(data){
        var N1 = this.get('N1');

        var indexs = [6, N1];
        var s1max = 'maxR' + indexs[0];
        var s1min = 'minR' + indexs[0];

        var s2max = 'maxR' + indexs[1];
        var s2min = 'minR' + indexs[1];

        var tempArr = getDataInRound(data, indexs, 'maxMinDataInRound', ['maxR', 'minR']);

        var result = [];
        var obj = {};
        var a = 0, b = 0;
        for (var i = 0; i < tempArr.length; i++) {
            obj = tempArr[i];
            if (obj[s1max]) {
                a = 100 * (obj[s1max] - fClosePrice(data[i])) / (obj[s1max] - obj[s1min]);
            }
            if (obj[s2max]) {
                b = 100 * (obj[s2max] - fClosePrice(data[i])) / (obj[s2max] - obj[s2min]);
            }
            result.push({ 
                xIndex: data[i].t,
                WR1: b,
                WR2: a 
            });
        }
        return result;
    }

}
WR.type = 'wr'
WR.defaultOption = {
    N: 10,
    N1: 6, 
    N2: 20,
    N3: 80
}


// 公式注册
registerIndicatorFormula(WR, WR.type);

export default WR