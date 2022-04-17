import School from '../models/school';
import haversineDistance from './haversineDistance';

type mergeRes = {
  matched: School[];
  unmathced: [School[], School[]];
};

const mergeSchools = (s1: School[], _s2: School[]): mergeRes => {
  const s2 = [..._s2];

  const res: School[] = [];
  const unmathced: School[] = [];

  s1.forEach((school, index) => {
    let flag = true;
    const coord1 = {
      lat: school.address.lat!,
      lng: school.address.long!,
    };
    for (let i = 0; i < s2.length; i++) {
      const coord2 = {
        lat: s2[i].address.lat!,
        lng: s2[i].address.long!,
      };
      const dist = haversineDistance(coord1, coord2);
      // Probably the same school
      if (dist <= 1.5) {
        school.items = [...school.items, ...s2[i].items];
        res.push(school);
        s2.splice(i, 1);
        flag = false;
        break;
      }
    }
    if (flag) unmathced.push(school);
  });
  return {
    matched: res,
    unmathced: [unmathced, s2],
  };
};

export default mergeSchools;
