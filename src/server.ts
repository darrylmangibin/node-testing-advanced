import App from '@src/app';

import routes from '@src/routes';

const PORT = Number(process.env.PORT || 3000);

const server = new App(PORT, routes);

export const { app } = server;

export default server;
