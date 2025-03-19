import axios from 'axios'

const instance = axios.create({});

instance.defaults.baseURL = '/';
instance.defaults.headers.common['Authorization'] = '';
instance.defaults.headers.post['Content-Type'] = 'application/json';
instance.defaults.timeout = 10000;
instance.interceptors.request.use(
  (config) => {
      // config.headers.authorization = dbUtils.get('token')
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