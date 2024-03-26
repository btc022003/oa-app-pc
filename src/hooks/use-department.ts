import { useState } from 'react';
import { allDepartments } from '@/services/departments';

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

/**
 * 生成属性选择器的数据
 * @returns
 */
export function useDepartmentTreeData() {
  const [allDepartmentsData, setDepartment] = useState([]);

  const loadDataDepartmentsAPI = async () => {
    const res = await allDepartments();
    setDepartment(buildTree(res.data.list));
  };
  return {
    loadDataDepartmentsAPI,
    allDepartmentsData,
  };
}
