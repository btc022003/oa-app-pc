import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright="YOA技术体验部"
      links={[
        // {
        //   key: 'Ant Design Pro',
        //   title: 'Ant Design Pro',
        //   href: 'https://pro.ant.design',
        //   blankTarget: true,
        // },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/btc022003/oa-app-server',
          blankTarget: true,
        },
        {
          key: 'Server API',
          title: 'API接口',
          href: 'http://localhost:3000/docs',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
