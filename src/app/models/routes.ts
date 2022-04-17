import School from './school';

type routes = {
  [key: string]: {
    schools: School[];
    optimalRoute?: number[];
  };
};

export default routes;
