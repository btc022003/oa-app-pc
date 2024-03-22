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
  ProFormItem,
} from '@ant-design/pro-components';
import { Button, Image, Popconfirm, Space } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  addDataAPI,
  deleByIdAPI,
  deleManyByIdsAPI,
  loadDataAPI,
  updateDataByIdAPI,
} from '@/services/employees';
import { dalImg } from '@/utils/tools';
import MyUpload from '@/components/MyUpload';

function Employee() {
  const [isShow, setIsShow] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [currentId, setCurrentId] = useState(''); // 当前id
  const [selectedKeys, setSelectedKeys] = useState<any>([]);
  const actionRef = useRef<ActionType>();
  const [myForm] = ProForm.useForm();
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
      title: '昵称',
      hideInSearch: true,
      dataIndex: 'nickName',
    },
    {
      title: '头像',
      hideInSearch: true,
      align: 'center',
      render(v: any) {
        return <Image src={dalImg(v.avatar)} width={120} />;
      },
    },
    {
      title: '角色',
      hideInSearch: true,
      render(v: any) {
        return v.role?.name;
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

            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setImageUrl(r.avatar);
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
          if (currentId) {
            await updateDataByIdAPI(currentId, { ...v, avatar: imageUrl });
          } else {
            await addDataAPI({ ...v, avatar: imageUrl });
          }

          setIsShow(false);
          actionRef.current?.reload();
        }}
      >
        <ProFormText
          label="用户名"
          name="userName"
          rules={[
            {
              required: true,
              message: '用户名不能为空',
            },
          ]}
        />
        <ProFormItem label="头像">
          <MyUpload imageUrl={imageUrl} setImageUrl={setImageUrl} />
        </ProFormItem>
        <ProFormText
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: '密码不能为空',
            },
          ]}
        />

        <ProFormText
          label="名字"
          name="realName"
          rules={[
            {
              required: true,
              message: '名字不能为空',
            },
          ]}
        />
        {/* <ProFormRadio.Group
          label="性别"
          name="gender"
          initialValue="male"
          options={[
            {
              label: '男',
              value: '男',
            },
            {
              label: '女',
              value: '女',
            },
          ]}
        /> */}
        <ProFormText label="昵称" name="nickName" rules={[]} />
        <ProFormText label="岗位" name="station" rules={[]} />
      </ModalForm>
    </PageContainer>
  );
}

export default Employee;
