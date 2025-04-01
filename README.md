## openapi-typescript-cli
最优雅的 OpenApi 生成 Typescript 接口请求层代码工具
> 通过 openapi 文档生成 Typescript 接口请求层代码。 适用于 __FastAPi__， __swagger__，__OpenAPI__ 等符合 __Openapi v3__ 规范的JSON接口文档


>  虽然现在有很多项目可以实现 openapi 生成 api 层代码
  eg: [https://editor.swagger.io/](https://editor.swagger.io/)， 虽然这个swagger出代码工具很强大， 能生成多种语言的请求代码。 但生成的代码耦合性太高， __不优雅__  不符合 __高内聚，低耦合__ __单一职责__ 设计原则。

### 使用指南

```
> npm i -g openapi-typescript-cli

```

```
openapi-typescript-cli -h
Usage: index [options]

openapi 生成 api 请求层代码.
推荐在 src/api 目录执行生成代码命令， 生成的代码会在当前目录下生成 api 请求文件.
作者: zhuty.com

Options:
  -V, --version         output the version number
  -f, --apifile <type>  api json 文件路径
  -u, --url <type>      api json文件url地址, 通常为 http://domain:port/v3/api-docs
  -n, --name <type>     输出文件名称， 默认为 index. 生成文件为 <name>.d.ts, <name>.ts， request.js (default: "index")
  -m, --middleware      中间件文件， 用于自定义生成模块名和函数名 （2.0版本实现）
  -h, --help            display help for command
```
```
> openapi-typescript-cli -f path/to/openapi.json -n outputfilename

> openapi-typescript-cli -u  http://domain:port/v3/api-docs -n outputfilename2
```

### 接口定义与代码生成

#### api path 规则：
```
 "/system/roleManage/deleteRole" # /业务名/模块名/函数名称
```
> 说明： 这里的模块名通常和后端Springboot 的 Controler 文件名相同， 函数名和Springboot的方法名相同。 通常， 一个团队前后端协商定义规则， 可直接生成可执行代码， 但为了解决一些不讲规则的后端开发。 __加上中间件， 可以根据 Path 进行自定义规则命名模块名和函数名__。



#### 生成的 Typescript 代码: 
```(typescript)
export let roleManage = {

  //删除角色
  deleteRole: async (param: number[], opt: AxiosRequestConfig = {}): Promise<Type.ResponseBoolean> => await request({
    url: '/system/roleManage/deleteRole',
    method: 'post',
    data: param,
    ...opt,
  }),
}
```
> 说明：通常，query参数 和 body参数是不混用的， 但是， 避免不了有些接口 POST 里面用 query 一起传参数。 这个工具也做了兼容， 只需要将 params 和 data 的一起放在 param 参数也可以使用， 如果有特殊情况无法兼容的， 可以在第二个参数传入 Axios 的参数， 在这个参数分别设置 params 和 data 即可。


#### 业务使用
```
import {userManagement} from '@/api/index''
  <Button
    type="primary"
    onClick={async () => {
      let res = await userManagement.deleteRole([1, 2]);
      console.log(res);
    }}
  >
    测试按钮
  </Button>
```


### 生成类型文件和请求文件
推荐将 Api 请求层单独放在 src/api目录

```
.
└── src
    └── api
        ├── index.d.ts               # 接口类型定义
        ├── index.ts                 # 接口请求方法
        ├── login.d.ts               # 接口类型定义
        ├── login.ts                 # 接口请求方法
        ├── request.js               # 请求方法， 这里可以对 axios 进行设置 
        └── middleware.example.js    # 中间件范式文件， 用于自定义模块名和函数名


```

### 使用中间件
> 当接口文档没有按默认方式定义时， 或者对接口定义的方法名和模块名不满意时， 可以使用中间件进行更改生成的模块名和函数名

```
// middleware.js
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
    functionName: operationId
  }
}

```


## Licence
MIT License
