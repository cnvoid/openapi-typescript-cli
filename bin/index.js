#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

program
  .version('1.0.0')
  .description('openapi 生成 api 请求层代码. \n推荐在 src/api 目录执行生成代码命令， 生成的代码会在当前目录下生成 api 请求文件.\n作者:zhuty.com@2025')
  .option('-f, --apifile <type>', 'api json 文件路径')
  .option('-u, --url <type>', 'api json文件url地址, 通常为http://domain:port/v3/api-docs')
  .option('-n, --name <type>', '输出文件名称， 默认为 index. 生成文件为 <name>.d.ts, <name>.ts， request.js', 'index')
  .parse(process.argv);

const options = program.opts();
console.log('Info: ', options);
if(!(options.apifile || options.url)) {
  console.error('Error:  必须设置openapi文件路径或者url地址');
  return;
}


async function fetchRemoteFile(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.error('Error fetching remote file:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

// Function to copy request.js to the user's current directory
function copyRequestJsToUserDir() {
  const sourceRequestJsPath = path.join(__dirname, './../request.js');
  const destinationRequestJsPath = path.join(process.cwd(), 'request.js'); // Use process.cwd()

  if (fs.existsSync(destinationRequestJsPath)) {
    console.log(`Skip: request.js already exists in the destination directory: ${destinationRequestJsPath}`);
    return; // Exit the function without copying
  }

  if (fs.existsSync(sourceRequestJsPath)) {
    console.log(`Info: Copying request.js from ${sourceRequestJsPath} to ${destinationRequestJsPath}`);
    fs.copyFileSync(sourceRequestJsPath, destinationRequestJsPath);
    console.log(`Info: request.js copied to ${destinationRequestJsPath}`);
  } else {
    console.info(`Skip: Source request.js not found at ${sourceRequestJsPath}`);
    process.exit(1); // Exit with an error code
  }
}
copyRequestJsToUserDir();

const generateApi = async () => {
  let interfaceCode = ``;
  let localInterface = ''
  let openapiJson = {};

  let openapiFilePath = ''
  let fileName = options.name;

  if (options.apifile) {
    console.log('apifile:', options.apifile);
    openapiFilePath = path.join(__dirname, options.apifile);
  }

  try {
    if (options.apifile) {
      const openapiData = fs.readFileSync(openapiFilePath, 'utf-8');
      openapiJson = JSON.parse(openapiData);
    }
    else if (options.url) {
      openapiJson = await fetchRemoteFile(options.url);
    }

    let typeFormat = {
      string: 'string',
      number: 'number',
      integer: 'number',
      boolean: 'boolean',
      array: 'any[]',
      object: 'any',
      undefined: 'any',
      null: 'any',
      any: 'any'
    };

    function genInterface() {
      let schemas = openapiJson.components.schemas;
      for (const schemaName in schemas) {
        const schema = schemas[schemaName];
        interfaceCode += `${schema.description ? '//' + schema.description + '\n' : ''}export interface ${schemaName} {\n`;
        for (const propName in schema.properties) {
          const prop = schema.properties[propName];
          if (prop.type === 'array') {
            let ItemType = prop.items['$ref'] && prop.items['$ref'].replace('#/components/schemas/', '') || typeFormat[prop.items.type];
            let type = `${ItemType ?? 'any'}[]`;
            interfaceCode += `  ${propName}?: ${type}; ${prop.description ? '//' + prop.description : ''}\n`;
          } else if (prop["$ref"] && prop["$ref"].startsWith('#/components/schemas/')) {
            let refName = prop["$ref"].replace('#/components/schemas/', '');
            interfaceCode += `  ${propName}?: ${refName}; ${prop.description ? '//' + prop.description : ''}\n`;
          } else {
            interfaceCode += `  ${propName}?: ${typeFormat[prop.type]}; ${prop.description ? '//' + prop.description : ''}\n`;
          }
        }
        interfaceCode += `}\n\n`;
      }
      fs.writeFileSync(path.join(process.cwd(), fileName + '.d.ts'), interfaceCode + '\n//查询组合类型\n' + localInterface, 'utf-8');
      console.log('^_^ Interface code generated successfully: api.d.ts', path.join(process.cwd(), fileName + '.d.ts').toString());
    }

    function genApis() {
      let apiCode = `import request from "./request"\nimport { AxiosRequestConfig } from 'axios'\nimport * as Type from './${fileName}.d'\n\n`;
      const apiGroups = {};

      let paths = openapiJson.paths;
      for (const path in paths) {

        /\/\w*\/(\w*)\/(\w*)$/.test(path)
        let apiGroup = RegExp.$1;
        let apiName = RegExp.$2;
        if (!apiGroups[apiGroup]) {
          apiGroups[apiGroup] = [];
        }

        let methods = paths[path];
        for (const method in methods) {
          let operation = methods[method];
          let operationId = operation.operationId;
          let description = operation.description;

          let paramType = 'any';
          let queryType = 'any';
          let responseType = 'any';

          if (operation.parameters) {
            let parameters = operation.parameters || []
            let _typeName = `QueryType${operationId}`;
            localInterface += `export interface ${_typeName} {\n`

            for (let i = 0; i < parameters.length; i++) {
              let param = parameters[i];
              if (param.schema) {
                let schema = param.schema;
                if (schema['$ref']) {
                  let t = 'Type.' + schema['$ref'].replace('#/components/schemas/', '');
                  localInterface += `  ${param.name}?: ${t};\n`

                } else {
                  let type = schema.type;
                  if (type === 'array') {
                    if (schema?.items && schema?.items['$ref']) {
                      let t = 'Type.' + (schema?.items && schema?.items['$ref'].replace('#/components/schemas/', '')) + '[]';
                      localInterface += `  ${param.name}?: ${t};\n`
                    } else {
                      let t = typeFormat[schema.items.type] + '[]';
                      localInterface += `  ${param.name}?: ${t};\n`

                    }
                  } else {
                    let t = typeFormat[schema.type];
                    localInterface += `  ${param.name}?: ${t};\n`
                  }
                }
              }
            }
            localInterface += `}\n\n`
            queryType = 'Type.' + _typeName;

          }
          if (operation.requestBody) {
            let requestBody = operation.requestBody || {};
            let content = requestBody.content && (requestBody.content['application/json'] || requestBody.content['application/x-www-form-urlencoded'] || requestBody.content['multipart/form-data'] || requestBody.content['application/octet-stream'] || requestBody.content['text/plain'] || requestBody.content['*/*']);
            let schema = content?.schema ?? {};

            if (schema['$ref']) {
              paramType = 'Type.' + schema['$ref'].replace('#/components/schemas/', '');
            } else {
              let type = schema.type;
              if (type === 'array') {

                if (schema?.items && schema?.items['$ref']) {

                  paramType = 'Type.' + (schema?.items && schema?.items['$ref'].replace('#/components/schemas/', '')) + '[]';

                } else {
                  paramType = typeFormat[schema?.items?.type] + '[]';
                }
              } else {
                console.log(schema);
                paramType = typeFormat[schema.type];
              }
            }
          }

          if (operation.responses) {
            let responses = operation.responses;
            let response = responses['200'];
            let content = response.content && (response.content['application/json'] || response.content['application/x-www-form-urlencoded'] || response.content['multipart/form-data'] || response.content['application/octet-stream'] || response.content['text/plain'] || response.content['*/*']);
            let schema = content?.schema ?? {};
            if (schema['$ref']) {
              responseType = 'Type.' + schema['$ref'].replace('#/components/schemas/', '');
            } else {
              let type = schema.type;
              if (type === 'array') {
                if (schema?.items && schema?.items['$ref']) {
                  responseType = 'Type.' + (schema?.items && schema?.items['$ref'].replace('#/components/schemas/', '')) + '[]';
                } else {
                  responseType = typeFormat[schema?.items?.type] + '[]';
                }
              } else {
                responseType = typeFormat[schema.type];
              }
            }
          }


          let _pType = paramType == 'any' ? queryType == 'any' ? 'any' : `${queryType}` : queryType == 'any' ? `${paramType}` : `${queryType} | ${paramType} | any`;

          let api = `\n    // ${description}\n    ${operationId}: async (param: ${_pType}, opt: AxiosRequestConfig = {}): Promise<${responseType}> => await request({\n`;
          api += `      url: '${path.replace(/\{(\w+)\}/g, '${parms[$1]}')}',\n`;
          api += `      method: '${method}',\n`;
          if (operation.parameters) {
            let p = '{'
            for (let i = 0; i < operation.parameters.length; i++) {
              let param = operation.parameters[i];
              p += `${param.name}: param?.${param.name},`
            }
            p += '}'
            api += `      params: ${p},\n`;
          }
          if (operation.requestBody) {
            api += `      data: param,\n`;
          }
          api += `      ...opt,\n`;
          api += `    }),\n`;

          apiGroups[apiGroup].push(api);

        }
      }

      for (const apiGroup in apiGroups) {
        apiCode += `export let ${apiGroup} = {\n`;
        apiGroups[apiGroup].forEach(api => {
          apiCode += api;
        });
        apiCode += `}\n\n`;
      }

      fs.writeFileSync(path.join(process.cwd(), fileName + '.ts'), apiCode, 'utf-8');
      console.log('\n^_^ API code generated successfully: api.ts', path.join(process.cwd(), fileName + '.ts').toString());
    }
    genApis()
    genInterface();
    return;

  } catch (error) {
    console.error('Error generating API code:', error);
  }
};

generateApi();

