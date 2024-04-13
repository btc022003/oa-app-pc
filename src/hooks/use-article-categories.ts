import { useEffect, useState } from 'react';
import { loadDataAPI } from '@/services/article-categories';

/**
 * 请假类型
 * @returns
 */
export function useArticleCategories() {
  const [articleCategories, setArticleCategories] = useState([]);

  const loadData = async () => {
    const res = await loadDataAPI({ pageSize: 100 });

    setArticleCategories(res.data.map((item: any) => ({ value: item.id, label: item.name })));
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    articleCategories,
  };
}
