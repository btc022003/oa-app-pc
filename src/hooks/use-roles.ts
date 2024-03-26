import { useEffect, useState } from 'react';
import { loadDataAPI } from '@/services/roles';
import { loadLeaveCheckersAPI } from '@/services/employees';

/**
 * 请假类型
 * @returns
 */
export function useRoles() {
  const [roles, setRoles] = useState([]);

  const loadData = async () => {
    const res = await loadDataAPI({ pageSize: 100 });

    setRoles(res.data.map((item: any) => ({ value: item.id, label: item.name })));
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    roles,
  };
}

export function useLeaveChecks() {
  const [leaveCheckers, setLeaveChecks] = useState([]);

  const loadData = async () => {
    const res = await loadLeaveCheckersAPI();

    setLeaveChecks(res.data.map((item: any) => ({ value: item.id, label: item.realName })));
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    leaveCheckers,
  };
}
