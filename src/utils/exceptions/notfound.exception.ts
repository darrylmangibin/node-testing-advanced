import ErrorException from './error.exception';

const notfoundException = (message?: string) => {
  throw new ErrorException(message || 'Record not found', 404);
};

export default notfoundException;
