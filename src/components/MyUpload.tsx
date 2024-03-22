import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { uploadUrl } from '../utils/tools';
import { dalImg } from '../utils/tools';
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};
const MyUpload = ({ imageUrl, setImageUrl }) => {
  const [loading, setLoading] = useState(false); // 是否上传成功

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      // 把图片数据转换为base64的字符串
      // getBase64(info.file.originFileObj, (url) => {
      //   setLoading(false);
      //   setImageUrl(url);
      // });
      // console.log(info.file.response);
      setImageUrl(info.file.response.data);
      setLoading(false);
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <>
      <Upload
        // name属性表示服务器端接口接收的数据的属性名
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        // action是你们公司给你的文件上传接口
        action={uploadUrl}
        // 上传之前执行
        // beforeUpload={beforeUpload}
        // 上传进行中
        onChange={handleChange}
      >
        {imageUrl ? (
          <img
            src={dalImg(imageUrl)}
            alt="avatar"
            style={{
              width: '100%',
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </>
  );
};
export default MyUpload;
