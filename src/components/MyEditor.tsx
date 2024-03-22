import '@wangeditor/editor/dist/css/style.css'; // 引入 css

import React, { useState, useEffect } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
// import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";

function MyEditor({ html, setHtml }: any) {
  // editor 实例
  const [editor, setEditor] = useState<any>(null); // JS 语法

  // 模拟 ajax 请求，异步设置 html
  // useEffect(() => {
  //   setTimeout(() => {
  //     setHtml("<p>hello world</p>");
  //   }, 1500);
  // }, []);

  // 工具栏配置
  const toolbarConfig = {}; // JS 语法

  // 编辑器配置
  const editorConfig = {
    // JS 语法
    placeholder: '请输入内容...',
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      // eslint-disable-next-line eqeqeq
      if (editor == null) return;
      // @ts-ignore
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => setHtml(editor.getHtml())}
          mode="default"
          style={{ height: '500px', overflowY: 'hidden' }}
        />
      </div>
      {/* <div style={{ marginTop: "15px" }}>{html}</div> */}
    </>
  );
}

export default MyEditor;
