import { getDataInRound } from '../util'
import { IndicatorFormula, registerIndicatorFormula } from '../indicatorFormula';

export default class VR extends IndicatorFormula{
    
    calculate(data){
        var M1 = this.get('M1'),
            M2 = this.get('M2'),
            M3 = this.get('M3');
        var a = M2,
            b = M3;
        var indexs = [M1];
        var str4 = 'upVol' + indexs[0];
        var str5 = 'downVol' + indexs[0];
        var result = [];
        var c = NaN;

        var tempArr = getDataInRound(data, indexs, 'volStatusInRound', ['upVol', 'downVol']);

        for (var i = 0; i < data.length; i++) {

            if (tempArr[i][str4]) {
                c = tempArr[i][str4] / tempArr[i][str5] * 100;
            }
            result.push({
                xIndex: data[i].t,
                VR: c || 0,
                A: a,
                B: b
            })
        }

        return result
    }

}

VR.type = 'vr';

VR.defaultOption = {
    M1: 26,
    M2: 100,
    M3: 200
}

// 公式注册
registerIndicatorFormula(VR, VR.type);