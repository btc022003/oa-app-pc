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
  allDepartments,
} from '@/services/departments';

// 构建属性结构
function buildTree(items: any) {
  const map: any = {}; // 创建一个映射，用于快速查找每个id对应的元素
  const tree: any = []; // 这是最终的树形结构

  // 第一步：构建id到元素的映射
  items.forEach((item: any) => {
    map[item.id] = { ...item, children: [] };
  });

  // 第二步：构建树形结构
  items.forEach((item: any) => {
    const parent = item.parent ? map[item.parent.id] : null;
    if (parent) {
      // 如果找到了父元素，则将当前元素添加到父元素的children数组中
      parent.children.push({
        value: item.id,
        title: item.name,
        children: map[item.id].children,
      });
    } else {
      // 如果没有找到父元素（即它是根元素），则将其添加到树中
      tree.push({
        value: map[item.id].id,
        title: map[item.id].name,
        children: map[item.id].children,
      });
    }
  });

  return tree;
}

function Departments() {
  const [isShow, setIsShow] = useState(false);
  const [currentId, setCurrentId] = useState(''); // 当前id
  const [selectedKeys, setSelectedKeys] = useState<any>([]);
  const actionRef = useRef<ActionType>();
  const [myForm] = ProForm.useForm();
  const [departmentsInfo, setDepartmentsInfo] = useState([]);
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

      allDepartments().then((res) => {
        // 根据parent生成属性结构
        setDepartmentsInfo(buildTree(res.data.list));
      });
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
            treeData={departmentsInfo}
          />
        </ProForm.Item>
      </ModalForm>
    </PageContainer>
  );
}

export default Departments;
