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
  const res = await request('/api/v1/articles', {
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

export function addDataAPI(data: any) {
  return request('/api/v1/articles', {
    method: 'POST',
    data,
  });
}

export function updateDataByIdAPI(id: string, data: any) {
  return request('/api/v1/articles/' + id, {
    method: 'PATCH',
    data,
  });
}

export function deleByIdAPI(id: string) {
  return request('/api/v1/articles/' + id, {
    method: 'DELETE',
  });
}

/**
 * 多个用,分割
 * @param ids
 * @returns
 */
export function deleManyByIdsAPI(ids: string) {
  return request('/api/v1/articles/remove_many', {
    method: 'DELETE',
    params: {
      ids,
    },
  });
}
