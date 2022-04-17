// import { distances } from '../mock/distances';

const POPULATION_SIZE = 50000;
const NUM_GENERATIONS = 100;
const MUTATION_RATE = 0.6;

type route = number[];

type individual = {
  route: route;
  fitness: number;
};

class OptimalRoute {
  private distances: number[][];
  private population: individual[];
  private routeSize: number;

  constructor(distances: number[][]) {
    this.distances = distances;
    this.population = [];
    this.routeSize = distances.length;
  }
  async getRoute(): Promise<[number[], number]> {
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    await delay(200);
    this.populate();
    // MAIN LOOP
    for (let i = 0; i < NUM_GENERATIONS; i++) {
      // mutations
      const mutated: individual[] = [];
      this.population.forEach((route) => {
        const rnd = Math.random();
        if (rnd <= MUTATION_RATE) mutated.push(this.mutateRoute(route));
        if (rnd <= MUTATION_RATE * 0.5) mutated.push(this.mutateRoute(route));
      });

      // calculating fitness
      this.population.forEach((route) => {
        route.fitness = this.routeFitness(route);
      });

      // ordering by fitness
      this.population = this.population.sort((a, b) => a.fitness - b.fitness);

      // removing worst routes
      const numMutaded = mutated.length;
      this.population.splice(this.routeSize, numMutaded);

      // appending mutated routes
      this.population = [...this.population, ...mutated];

      // best route of current generation

      // console.log(
      //   `Geração ${i + 1}: [${this.population[0].route}] : ${
      //     this.population[0].fitness
      //   } / [${this.population[this.population.length - 1].route}]${
      //     this.population[this.population.length - 1].fitness
      //   }`
      // );
    }
    return [this.population[0].route, this.population[0].fitness];
  }

  private populate() {
    for (let i = 0; i < POPULATION_SIZE; i++) {
      const route: route = [];
      const notAvailable: number[] = [];
      for (let j = 0; j < this.routeSize; j++) {
        let randomNumber: number = Math.floor(Math.random() * this.routeSize);
        while (notAvailable.includes(randomNumber)) {
          randomNumber = Math.floor(Math.random() * this.routeSize);
        }
        notAvailable.push(randomNumber);
        route.push(randomNumber);
      }
      this.population.push({ route, fitness: Number.MAX_SAFE_INTEGER });
    }
  }

  private routeFitness(ind: individual): number {
    const { route } = ind;
    let sum = 0;

    route.forEach((_, i) => {
      if (i === route.length - 1) return;
      const dist = this.distances[route[i]][route[i + 1]];
      sum += dist;
    });
    return sum;
  }

  private mutateRoute(ind: individual): individual {
    const { route } = ind;

    const index1 = Math.floor(Math.random() * this.routeSize);
    let index2 = Math.floor(Math.random() * this.routeSize);

    while (index1 == index2)
      index2 = Math.floor(Math.random() * this.routeSize);

    const child = [...route];
    [child[index1], child[index2]] = [child[index2], child[index1]];

    return {
      route: child,
      fitness: Number.MAX_SAFE_INTEGER,
    };
  }
}

export default OptimalRoute;

// const obj = new OptimalRoute(distances);
// obj.getRoute();
