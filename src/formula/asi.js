import { decimalRound, fClosePrice, fOpenPrice, fMin, fMax, MAX, ABS, fIf } from '../util'

import { IndicatorFormula, registerIndicatorFormula } from '../indicatorFormula';

export default class ASI extends IndicatorFormula{

    calculate(data){

        var M1 = this.get('M1'),
            M2 = this.get('M2');

        var siArr = [], j, totalSiArr = [], totalSi = 0, totalAsit = 0, totalAsitAver = 0, result = [], k;

        var l, lc, aa, d, dc, doo, dh, dl, bb, ll, lo, cc, dd, r, temp3, tmp1, tmp2, tmp3, temp1, temp2, x, si = 0, tem;
        for (var i = 0; i < data.length; i++) {
            l = data[i - 1];
            d = data[i];
            totalSi = 0;
            totalAsit = 0;
            si = 0;

            if (l) {
                lc = fClosePrice(l);
                lo = fOpenPrice(l);
                ll = fMin(l);
                dh = fMax(d);
                dl = fMin(d);
                dc = fClosePrice(d);
                doo = fOpenPrice(d);

                aa = ABS(dh - lc);
                bb = ABS(dl - lc);
                cc = ABS(dh - ll);
                dd = ABS(lc - lo);
                tmp1 = bb > cc && bb > aa;
                tmp2 = bb + aa / 2 + dd / 4;
                tmp3 = cc + dd / 4;
                temp3 = fIf(tmp1, tmp2, tmp3);

                temp1 = aa > bb && aa > cc;
                temp2 = aa + bb / 2 + dd / 4;
                r = fIf(temp1, temp2, temp3);

                x = dc - lc + (dc - doo) / 2 + lc - lo;
                tem = MAX(aa, bb);
                si = 16 * x / r * tem;

            }
            siArr.push(si);

            if (i < M1) {
                result.push({
                    ASI: 0,
                    ASIT: 0
                });
                continue;
            }

            for (j = 0; j < M1; j++) {
                totalSi += siArr[i - j];
            }
            totalSiArr.push(totalSi);

            if (i < (M1 + M2)) {
                result.push({
                    ASI: totalSi,
                    ASIT: 0
                });
                continue;
            }

            for (k = 0; k < M2; k++) {
                totalAsit += totalSiArr[i - M1 - k];
            }

            totalAsitAver = totalAsit / M2;

            result.push({
                xIndex: data[i].t,
                ASI: +decimalRound(totalSi, 2),
                ASIT: +decimalRound(totalAsitAver, 2)
            });
        }
        return result;
    }
}

ASI.type = 'asi';

ASI.defaultOption = {
    M1: 26,
    M2: 10
}

// 公式注册
registerIndicatorFormula(ASI, ASI.type);