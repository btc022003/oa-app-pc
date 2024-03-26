/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  console.log(currentUser);
  return {
    canAdmin: currentUser && currentUser.role?.name === 'super_admin',
    canManager: currentUser && currentUser.role?.name?.includes('admin'),
  };
}
