import React, { useState, useRef, useEffect } from 'react';
import {
  PageContainer,
  ProTable,
  ProColumnType,
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ActionType,
  ProFormSelect,
  // ProFormRadio,
  ProFormDigit,
  ProForm,
  ProFormItem,
} from '@ant-design/pro-components';
import { Button, Popconfirm, Space, Image } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  addDataAPI,
  deleByIdAPI,
  deleManyByIdsAPI,
  loadDataAPI,
  updateDataByIdAPI,
} from '@/services/articles';
import MyUpload from '@/components/my-upload';
// import MyEditor from '@/components/MyEditor';
import { useArticleCategories } from '@/hooks/use-article-categories';
import { dalImg } from '@/utils/tools';

function Articles() {
  const [isShow, setIsShow] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [html, setHtml] = useState('');
  const [currentId, setCurrentId] = useState(''); // 当前id
  const [selectedKeys, setSelectedKeys] = useState<any>([]);
  const actionRef = useRef<ActionType>();
  const [myForm] = ProForm.useForm();
  const { articleCategories } = useArticleCategories();
  const columns: ProColumnType<any>[] = [
    {
      title: '序号',
      hideInSearch: true,
      render(c, r, i) {
        return i + 1;
      },
    },
    {
      title: '标题',
      // hideInSearch: true,
      dataIndex: 'name',
      fieldProps: {
        name: 'name',
      },
    },
    {
      title: '简介',
      hideInSearch: true,
      dataIndex: 'desc',
    },
    {
      title: '浏览次数',
      hideInSearch: true,
      dataIndex: 'views',
    },
    {
      title: '封面',
      hideInSearch: true,
      align: 'center',
      render(v: any) {
        return <Image src={dalImg(v.image)} width={120} />;
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
                setImageUrl(r.image);
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
      setImageUrl('');
      setHtml('');
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
            await updateDataByIdAPI(currentId, { ...v, image: imageUrl, content: html });
          } else {
            await addDataAPI({ ...v, image: imageUrl, content: html });
          }

          setIsShow(false);
          actionRef.current?.reload();
        }}
      >
        <ProFormText
          label="标题"
          name="name"
          rules={[
            {
              required: true,
              message: '标题不能为空',
            },
          ]}
        />
        <ProFormItem label="主图">
          <MyUpload imageUrl={imageUrl} setImageUrl={setImageUrl} />
        </ProFormItem>
        <ProFormSelect
          label="分类"
          options={articleCategories}
          name="articleCategoryId"
        ></ProFormSelect>
        <ProFormTextArea
          label="简介"
          name="desc"
          rules={[
            {
              required: true,
              message: '简介不能为空',
            },
          ]}
        />
        <ProFormDigit
          label="浏览次数"
          name="views"
          min={1}
          rules={[
            {
              required: true,
              message: '浏览次数',
            },
          ]}
        />
        <ProFormItem label="详情">{/* <MyEditor html={html} setHtml={setHtml} /> */}</ProFormItem>
      </ModalForm>
    </PageContainer>
  );
}

export default Articles;
