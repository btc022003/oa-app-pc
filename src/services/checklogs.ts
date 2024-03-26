// user/leave_need_checks
import { request } from '@umijs/max';

export async function loadDataAPI(
  params: any & {
    pageSize: number;
    current: number;
  },
  // sort,
  // filter,
) {
  // console.log(params);
  // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
  // 如果需要转化参数可以在这里进行修改
  const res = await request('/api/v1/leaves/user/leave_need_checks', {
    method: 'GET',
    params: {
      // ...params,
      page: params.current,
      per: params.pageSize,
    },
  });
  return {
    data: res.data.list,
    // success 请返回 true，
    // 不然 table 会停止解析数据，即使有数据
    success: true,
    // 不传会使用 data 的长度，如果是分页一定要传
    total: res.data.total,
  };
}
