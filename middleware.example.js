// TODO: 这个是中间件范式， 默认模块名取值path第二个值， 方法名取值operationId. 接口文档不满足业务时可以在此重新处理
// TODO: openapi-typescript-cli -m ./middleware.js
/**
 * @param {
 * operationId: 通常是 controller 的方法名
 * description: 接口描述
 * path: 接口文档的原生 path， 可以通过正则表达式处理取值
 * method: http method
 * tag: 文档标签， 这个作为模块名是比较严谨的， 但国内很多后端会把这块写成中文， 可以替换成英文使用
 * }  
 * @returns  {
 * moduleName: 生成的接口模块名
 * functionName: 生成接口的调用方法名， 默认取值 operationId
 * }
 */
module.exports = function ({operationId, description, path, method, tag}){
  return {
    moduleName: tag,
    functionName: ''
  }
}