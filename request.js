//Todo  在实际业务中修改该文件， 在 openapi-typescript-cli 生成的代码时， 会检测这个文件， 不会覆盖
// 该文件是对axios的封装， 可以在这里添加请求拦截器， 响应拦截器， 也可以在这里添加全局的错误处理
// 也可以在这里添加全局的loading， toast等
// 有问题欢迎联系 作者微信： zhutty
import axios from 'axios'

const instance = axios.create({});

instance.defaults.baseURL = '/';
instance.defaults.headers.common['Authorization'] = '';
instance.defaults.headers.post['Content-Type'] = 'application/json';
instance.defaults.timeout = 10000;
instance.interceptors.request.use(
  (config) => {
      console.log('请求拦截', config)
      return config;
  },
  (error) => {
      return Promise.reject();
  }
);

instance.interceptors.response.use(
  (res) => {

      if (res.status === 200) {
          if (res.data.status) {
              // 在接收到响应数据之前可以进行一些处理，例如解析响应数据、错误处理等
              const contentType = res.headers['content-type'];
              if (contentType === 'application/octet-stream' ||
                  contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                  // 注意：Blob类型文件下载需要请求头参数添加 responseType:'blob'  下载 导出等功能需要
                  // return downloadFile(response)
              } else {
         
                  return Promise.resolve(res.data);
              }
          } 

      }

  },
  (error) => {
      return error
  }
);

export default instance