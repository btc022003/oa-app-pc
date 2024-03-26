import React, { useState, useRef, useEffect } from 'react';
import {
  PageContainer,
  ProTable,
  ProColumnType,
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormDateTimeRangePicker,
  ProFormDigit,
  ProFormSelect,
  ActionType,
  // ProFormRadio,
  ProForm,
  ProFormItem,
} from '@ant-design/pro-components';
import { Button, Image, Popconfirm, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  addDataAPI,
  deleByIdAPI,
  deleManyByIdsAPI,
  loadDataAPI,
  updateDataByIdAPI,
} from '@/services/leaves';
import { dalImg } from '@/utils/tools';
import { useLeaves } from '@/hooks/use-leaves';

function Leaves() {
  const [isShow, setIsShow] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [currentId, setCurrentId] = useState(''); // 当前id
  const [selectedKeys, setSelectedKeys] = useState<any>([]);
  const actionRef = useRef<ActionType>();
  const [myForm] = ProForm.useForm();

  const { leaveCategories } = useLeaves();

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
      dataIndex: 'userName',
    },
    {
      title: '名字',
      // hideInSearch: true,
      dataIndex: 'realName',
      fieldProps: {
        name: 'name',
      },
    },
    {
      title: '部门',
      hideInSearch: true,
      render(v: any) {
        return v.department?.name;
      },
    },
    {
      title: '时间',
      hideInSearch: true,
      dataIndex: 'nickName',
    },
    {
      title: '请假类型',
      hideInSearch: true,
      align: 'center',
      render(v: any) {
        return <Image src={dalImg(v.avatar)} width={120} />;
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
        return v.role?.name;
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
      setImageUrl('');
      setCurrentId('');
      setSelectedKeys([]);
    }
  }, [isShow]);
  return (
    <PageContainer>
      <ProTable
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
          console.log(v);
          // if (currentId) {
          //   await updateDataByIdAPI(currentId, { ...v, avatar: imageUrl });
          // } else {
          //   await addDataAPI({ ...v, avatar: imageUrl });
          // }
          // setIsShow(false);
          // actionRef.current?.reload();
        }}
      >
        <ProFormSelect
          label="请假类型"
          options={leaveCategories}
          rules={[{ required: true, message: '请假类型不能为空' }]}
          name="leaveCategoryId"
        ></ProFormSelect>
        <ProFormDateTimeRangePicker
          label="起始时间"
          name="timeRange"
          rules={[{ required: true, message: '起始时间不能为空' }]}
        />
        <ProFormDigit
          label="时长"
          placeholder="一天按八小时计算"
          rules={[{ required: true, message: '时长不能为空' }]}
        />
        <ProFormTextArea label="备注" name="desc" />
      </ModalForm>
    </PageContainer>
  );
}

export default Leaves;
