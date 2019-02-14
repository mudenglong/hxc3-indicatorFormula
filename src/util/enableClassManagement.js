/**
 * 类管理扩展
 * 
 * @param {Object} entity 
 * @returns {Object} entity
 */
export function enableClassManagement(entity) {
    let storage = {};

    // 注册Class
    entity.registerClass = function (Clazz, componentType) {
        storage[componentType] = Clazz;
        return Clazz;
    }

    // 获取Class
    entity.getClass = function (componentType) {
        return storage[componentType];
    }

    entity.hasClass = function (componentType) {
        return !!storage[componentType];
    }

    entity.getAllClass = function () {
        return storage;
    }

    return entity;
}
