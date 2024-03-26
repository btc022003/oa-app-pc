import React, { useState, useRef, useEffect } from 'react';
import {
  PageContainer,
  ProTable,
  ProColumnType,
  ModalForm,
  ProFormText,
  ActionType,
  // ProFormRadio,
  ProForm,
} from '@ant-design/pro-components';
import { Button, Popconfirm, Space, TreeSelect } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  addDataAPI,
  deleByIdAPI,
  deleManyByIdsAPI,
  loadDataAPI,
  updateDataByIdAPI,
} from '@/services/departments';
import { useDepartmentTreeData } from '@/hooks/use-department';

function Departments() {
  const [isShow, setIsShow] = useState(false);
  const [currentId, setCurrentId] = useState(''); // 当前id
  const [selectedKeys, setSelectedKeys] = useState<any>([]);
  const actionRef = useRef<ActionType>();
  const [myForm] = ProForm.useForm();
  const { loadDataDepartmentsAPI, allDepartmentsData } = useDepartmentTreeData();
  const columns: ProColumnType<any>[] = [
    {
      title: '序号',
      hideInSearch: true,
      render(c, r, i) {
        return i + 1;
      },
    },
    {
      title: '名字',
      hideInSearch: true,
      dataIndex: 'name',
      fieldProps: {
        name: 'name',
      },
    },
    {
      title: '上一级',
      hideInSearch: true,
      // dataIndex: 'name',
      // fieldProps: {
      //   name: 'name',
      // },
      render(c: any) {
        return c.parent?.name;
      },
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 100,
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

            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                myForm.setFieldsValue(r);
                setCurrentId(r.id);
                setIsShow(true);
              }}
            />
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
      setCurrentId('');
      setSelectedKeys([]);
      loadDataDepartmentsAPI();
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
          if (currentId) {
            await updateDataByIdAPI(currentId, { ...v });
          } else {
            await addDataAPI({ ...v });
          }

          setIsShow(false);
          actionRef.current?.reload();
        }}
      >
        <ProFormText
          label="名字"
          name="name"
          rules={[
            {
              required: true,
              message: '用户名不能为空',
            },
          ]}
        />
        <ProForm.Item label="部门" name="departmentId">
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Please select"
            allowClear
            treeDefaultExpandAll
            treeData={allDepartmentsData}
          />
        </ProForm.Item>
      </ModalForm>
    </PageContainer>
  );
}

export default Departments;
