import AuthRoutes from '@resources/auth/auth.routes';
import UserRoutes from '@resources/user/user..routes';
import PostRoutes from '@resources/post/post.routes';
import CommentRoutes from '@resources/comments/comment.routes';

const routes = [
  new AuthRoutes(),
  new UserRoutes(),
  new PostRoutes(),
  new CommentRoutes(),
] satisfies AppRoutes[];

export default routes;
