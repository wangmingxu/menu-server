import { MockRequest, MockStatusError } from '@delon/mock';
// TIPS: mockjs 一些优化细节见：http://ng-alain.com/docs/mock
// import * as Mock from 'mockjs';

export const MENUS = {
    // 支持值为 Object 和 Array
    'GET /menulist': { list: [
        {
          key     : 1,
          time    : '周一',
          dishname     : '-',
          children: [ {
            key    : 11,
            time   : '早上',
            dishname    : '-',
            children: [ {
              key    : 111,
              time   : '-',
              dishname    : '菜式0',
            }, {
              key    : 112,
              time   : '-',
              dishname    : '菜式1',
            } ],
          }, {
            key     : 12,
            time    : '下午',
            dishname     : '-',
            address : 'New York No. 3 Lake Park',
            children: [ {
              key    : 121,
              time   : '-',
              dishname    : '菜式1',
            } ],
          }, {
            key     : 13,
            time    : '晚上',
            dishname     : '-',
            children: [ {
              key     : 131,
              time    : '-',
              dishname     : '菜式2',
            } ],
          } ],
        },
        {
          key    : 2,
          time   : '周二',
          dishname    : '-',
          address: 'Sidney No. 1 Lake Park',
        }
      ], total: 4 },
    // GET 可省略
    // '/users/1': Mock.mock({ id: 1, 'rank|3': '★★★' }),
    // POST 请求
    'POST /users/1': { uid: 1 },
    // 获取请求参数 queryString、headers、body
    '/qs': (req: MockRequest) => req.queryString.pi,
    // 路由参数
    '/users/:id': (req: MockRequest) => req.params, // /users/100, output: { id: 100 }
    // 发送 Status 错误
    '/404': () => { throw new MockStatusError(404); }
};
