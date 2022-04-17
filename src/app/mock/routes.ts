import routes from '../models/routes';
import schools, { schools2 } from './schools';

const routes: routes = {
  '1': {
    schools: schools,
  },
  '2': {
    schools: schools2,
  },
};

export default routes;
