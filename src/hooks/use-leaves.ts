import { useEffect, useState } from 'react';
import { loadDataAPI } from '@/services/leave-categories';

/**
 * 请假类型
 * @returns
 */
export function useLeaves() {
  const [leaveCategories, setLeaveCategories] = useState([]);

  const loadData = async () => {
    const res = await loadDataAPI({ pageSize: 100 });

    setLeaveCategories(res.data.map((item: any) => ({ value: item.id, label: item.name })));
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    leaveCategories,
  };
}
