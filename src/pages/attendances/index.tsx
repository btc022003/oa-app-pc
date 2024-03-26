import React, { useRef } from 'react';
import { PageContainer, ProTable, ProColumnType, ActionType } from '@ant-design/pro-components';
import { loadDataAPI } from '@/services/attendances';
import { formatDateTime } from '@/utils/tools';

function Attendances() {
  const actionRef = useRef<ActionType>();
  const columns: ProColumnType<any>[] = [
    {
      title: '序号',
      hideInSearch: true,
      render(c, r, i) {
        return i + 1;
      },
    },
    {
      title: '姓名',
      hideInSearch: true,
      // dataIndex: 'userName',
      render(c: any) {
        return c.employee?.realName || c.employee.userName;
      },
    },
    {
      title: '时间',
      hideInSearch: true,
      // dataIndex: 'realName',
      // fieldProps: {
      //   name: 'name',
      // },
      render(c: any) {
        return formatDateTime(c.createdAt);
      },
    },
    {
      title: '备注',
      dataIndex: 'remarks',
    },
  ];

  return (
    <PageContainer>
      <ProTable
        // searchFormRender={() => <></>}
        search={false}
        bordered
        size="small"
        columns={columns}
        request={loadDataAPI}
        actionRef={actionRef}
        tableAlertRender={false}
        rowKey="id"
      ></ProTable>
    </PageContainer>
  );
}

export default Attendances;
