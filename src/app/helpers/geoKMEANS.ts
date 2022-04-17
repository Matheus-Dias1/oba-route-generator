import clustersKmeans from '@turf/clusters-kmeans';
import { featureCollection, point } from '@turf/turf';

import School from '../models/school';

const geoCluster = (schools: School[], numClusters: number) => {
  const points = featureCollection(
    schools.map((school) => point([school.address.lat!, school.address.long!]))
  );
  const clustered = clustersKmeans(points, { numberOfClusters: numClusters });
  clustered.features.forEach((point, i) => {
    if (point.properties.cluster !== undefined) {
      schools[i].setRoute(`${point.properties.cluster + 1}`);
    } else {
      alert(`Não foi possível incluir a escola ${schools[i].name} em uma rota`);
      schools[i].setRoute('ERRO');
    }
  });
};

export default geoCluster;
