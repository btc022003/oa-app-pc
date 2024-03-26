import React, { useRef } from 'react';
import { PageContainer, ProTable, ProColumnType, ActionType } from '@ant-design/pro-components';
import { loadDataAPI } from '@/services/checklogs';
import { formatDateTime } from '@/utils/tools';
import { Button } from 'antd';

function LeaveCheckList() {
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
        return c.leave?.employee?.realName || c.leave?.employee?.userName;
      },
    },
    {
      title: '请假类型',
      hideInSearch: true,
      // dataIndex: 'userName',
      render(c: any) {
        return c.leave?.leaveCategory?.name;
      },
    },
    {
      title: '请假时间',
      hideInSearch: true,
      // dataIndex: 'realName',
      // fieldProps: {
      //   name: 'name',
      // },
      render(v: any) {
        return `${formatDateTime(v.leave?.startTime)}至${formatDateTime(v.leave?.endTime)}`;
      },
    },
    {
      title: '请假时长',
      hideInSearch: true,
      // dataIndex: 'realName',
      // fieldProps: {
      //   name: 'name',
      // },
      render(c: any) {
        return c.leave?.durations;
      },
    },
    {
      title: '操作',
      render(v: any) {
        return (
          <Button type="primary" size="small">
            同意
          </Button>
        );
      },
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

export default LeaveCheckList;
