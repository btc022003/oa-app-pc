import React, { useState, useRef, useEffect } from 'react';
import {
  PageContainer,
  ProTable,
  ProColumnType,
  ModalForm,
  // ProFormText,
  ProFormTextArea,
  ProFormDateTimeRangePicker,
  ProFormDigit,
  ProFormSelect,
  ActionType,
  // ProFormRadio,
  ProForm,
  // ProFormItem,
} from '@ant-design/pro-components';
import { Button, Tag, Popconfirm, Space } from 'antd';
import { DeleteOutlined, PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {
  addDataAPI,
  // addDataAPI,
  deleByIdAPI,
  deleManyByIdsAPI,
  loadDataAPI,
  // updateDataByIdAPI,
} from '@/services/leaves';
import { formatDateTime } from '@/utils/tools';
import { useLeaves } from '@/hooks/use-leaves';
import { useLeaveChecks } from '@/hooks/use-roles';

function Leaves() {
  const [isShow, setIsShow] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<any>([]);
  const actionRef = useRef<ActionType>();
  const [myForm] = ProForm.useForm();

  const { leaveCategories } = useLeaves();
  const { leaveCheckers } = useLeaveChecks();

  const columns: ProColumnType<any>[] = [
    {
      title: '序号',
      hideInSearch: true,
      render(c, r, i) {
        return i + 1;
      },
    },
    {
      title: '用户名',
      hideInSearch: true,
      // dataIndex: 'userName',
      render(v: any) {
        return v.employee?.userName;
      },
    },
    {
      title: '名字',
      hideInSearch: true,
      render(v: any) {
        return v.employee?.realName;
      },
    },
    {
      title: '部门',
      hideInSearch: true,
      render(v: any) {
        return v.employee?.department?.name;
      },
    },
    {
      title: '时间',
      hideInSearch: true,
      render(v: any) {
        return `${formatDateTime(v.startTime)}至${formatDateTime(v.endTime)}`;
      },
    },
    {
      title: '请假类型',
      hideInSearch: true,
      align: 'center',
      render(v: any) {
        return v.leaveCategory.name;
      },
    },
    {
      title: '备注',
      hideInSearch: true,
      dataIndex: 'desc',
    },
    {
      title: '审核状态',
      hideInSearch: true,
      render(v: any) {
        return (
          <Space>
            {v.leaveCheckLogs?.map((item: any) => {
              return (
                <Tag color={item.isCheck ? 'success' : 'error'} key={item.id}>
                  {item.owner?.realName}
                  {item.isCheck ? <CheckOutlined /> : <CloseOutlined />}
                </Tag>
              );
            })}
          </Space>
        );
      },
    },

    {
      title: '操作',
      hideInSearch: true,
      render(c, r) {
        return (
          <Space>
            <Popconfirm
              title="是否确认删除?"
              onConfirm={async () => {
                ///a
                await deleByIdAPI(r.id);
                actionRef.current?.reload();
              }}
            >
              <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  useEffect(() => {
    if (!isShow) {
      // 清除数据
      // actionRef.current
      myForm.resetFields();
      setSelectedKeys([]);
    }
  }, [isShow]);
  return (
    <PageContainer>
      <ProTable
        search={false}
        bordered
        size="small"
        columns={columns}
        request={loadDataAPI}
        actionRef={actionRef}
        tableAlertRender={false}
        toolBarRender={() => [
          <Button icon={<PlusOutlined />} key={1} onClick={() => setIsShow(true)} />,
          <Popconfirm
            title="是否确认删除?"
            key={2}
            onConfirm={async () => {
              // console.log(selectedKeys);
              await deleManyByIdsAPI(selectedKeys.join(','));
              actionRef.current?.reload();
            }}
          >
            <Button
              type="primary"
              danger
              style={{ display: selectedKeys.length > 0 ? '' : 'none' }}
            >
              批量删除
            </Button>
          </Popconfirm>,
        ]}
        rowKey="id"
        rowSelection={{
          onChange(selectedRowKeys) {
            setSelectedKeys(selectedRowKeys);
          },
        }}
      ></ProTable>
      <ModalForm
        form={myForm}
        open={isShow}
        onOpenChange={setIsShow}
        title="编辑"
        onFinish={async (v) => {
          // console.log(v);
          const { timeRange, checkers, ...othersData } = v;
          await addDataAPI({
            ...othersData,
            startTime: timeRange[0],
            endTime: timeRange[1],
            checkers: checkers.join(','), // 审批人
          }); // 新增
          setIsShow(false);
          actionRef.current?.reload();
        }}
      >
        <ProFormSelect
          label="请假类型"
          options={leaveCategories}
          rules={[{ required: true, message: '请假类型不能为空' }]}
          name="leaveCategoryId"
        ></ProFormSelect>
        <ProFormSelect
          mode="multiple"
          label="审批人"
          name="checkers"
          rules={[{ required: true, message: '审批人不能为空' }]}
          options={leaveCheckers}
        ></ProFormSelect>
        <ProFormDateTimeRangePicker
          label="起始时间"
          name="timeRange"
          rules={[{ required: true, message: '起始时间不能为空' }]}
        />
        <ProFormDigit
          label="时长"
          placeholder="一天按八小时计算"
          name="durations"
          rules={[{ required: true, message: '时长不能为空' }]}
        />
        <ProFormTextArea label="备注" name="desc" />
      </ModalForm>
    </PageContainer>
  );
}

export default Leaves;
