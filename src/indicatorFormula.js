import { enableClassManagement, merge, clone } from './util'; 

/**
 * IndicatorFormula类
 * 技术指标计算类
 * @class IndicatorFormula
 */
class IndicatorFormula{

    /**
     * {string} 组件名type
     */
    static type = 'indicatorFormula';

    constructor(opt) {
        let option = opt ? clone(opt) : {};
        this._option = merge(option, this.constructor.defaultOption, false);
    }

    /**
     * 获取实际option
     * 
     * @param {string} [key] 获取option内的key属性，若不传返回全部option
     * @returns {any} 返回key对应的属性
     */
    get(key) {
        if (key) {
            return this._option[key];
        } else {
            return this._option;
        }
    }

};
enableClassManagement(IndicatorFormula);

/**
 * 注册 技术指标计算类
 * @param  {Object} IndicatorFormula 
 */
function registerIndicatorFormula(Indicator_) {
    IndicatorFormula.registerClass(Indicator_, Indicator_.type);
}

export {
    registerIndicatorFormula,
    IndicatorFormula
};