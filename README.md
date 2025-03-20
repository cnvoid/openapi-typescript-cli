## openapi-typescript-cli
最优雅的 OpenApi 生成 Typescript 接口请求层代码工具
> 通过 openapi 文档生成 Typescript 接口请求层代码。 适用于 __FastAPi__， __swagger__，__OpenAPI__ 等符合 __Openapi v3__ 规范的JSON接口文档


>  虽然现在有很多项目可以实现 openapi 生成 api 层代码
  eg: [https://editor.swagger.io/](https://editor.swagger.io/)， 虽然这个swagger出代码工具很强大， 能生成多种语言的请求代码，但 __不优雅__  不符合 __高内聚，低耦合__ __单一职责__ 设计原则


### 接口定义与代码生成

#### api path 规则：
```
 "/system/roleManage/deleteRole" # /业务名/模块名/函数名称
```
> 说明： 这里的模块名通常和后端Springboot 的Controler 文件名相同， 函数名和Springboot的方法名相同

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
        ├── index.d.ts  # 接口类型定义
        ├── index.ts    # 接口请求方法
        ├── login.d.ts  # 接口类型定义
        ├── login.ts    # 接口请求方法
        └── request.js  # 请求方法， 这里可以对 axios 进行设置 

```



### 使用指南

```
> npm i -g openapi-typescript-cli

```

```
openapi-typescript-cli -h
Usage: index [options]

openapi 生成 api 请求层代码.
推荐在 src/api 目录执行生成代码命令， 生成的代码会在当前目录下生成 api 请求文件.
作者:zhuty.com@2025

Options:
  -V, --version         output the version number
  -f, --apifile <type>  api json 文件路径
  -u, --url <type>      api json文件url地址, 通常为 http://domain:port/v3/api-docs
  -n, --name <type>     输出文件名称， 默认为 index. 生成文件为 <name>.d.ts, <name>.ts， request.js (default: "index")
  -h, --help            display help for command
```
```
> openapi-typescript-cli -f path/to/openapi.json -n outputfilename

> openapi-typescript-cli -u  http://domain:port/v3/api-docs -n outputfilename2
```

## Licence
MIT License