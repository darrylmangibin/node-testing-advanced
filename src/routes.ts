import AuthRoutes from '@resources/auth/auth.routes';

const routes = [new AuthRoutes()] satisfies AppRoutes[];

export default routes;
