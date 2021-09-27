const PrivateRoutes = {
  user: '/user',
  items: '/items',
  orders: '/orders',
  admin: '/admin',
  itemDetail: '/item/:id',
  orderDetail: '/order/:id',
};

const PublicRoutes = {
  root: '/',
  login: '/login',
  about: '/about',
  shop: '/shop',
};

export const isPublicRoute = (path: string): boolean => (
  Object.values(PublicRoutes).includes(path)
);

export const isPrivateRoute = (path: string): boolean => (
  Object.values(PrivateRoutes).includes(path)
);

const Routes = {
  ...PublicRoutes,
  ...PrivateRoutes,
};

export default Routes;
