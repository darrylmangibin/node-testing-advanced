import AuthRoutes from '@resources/auth/auth.routes';
import UserRoutes from '@resources/user/user..routes';
import PostRoutes from '@resources/post/post.routes';

const routes = [
  new AuthRoutes(),
  new UserRoutes(),
  new PostRoutes(),
] satisfies AppRoutes[];

export default routes;
