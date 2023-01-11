import AuthRoutes from '@resources/auth/auth.routes';
import UserRoutes from '@resources/user/user..routes';

const routes = [new AuthRoutes(), new UserRoutes()] satisfies AppRoutes[];

export default routes;
