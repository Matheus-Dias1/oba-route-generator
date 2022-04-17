type Address = {
  rawAddr: string;
  geocodedAddr?: string;
  lat?: number;
  long?: number;
  boundingbox?: number[];
  route?: string;
};

export type Items = {
  description: string;
  amount: number;
  unit: string;
}[];

class School {
  name: string;
  address: Address;

  items: Items = [];

  constructor(name: string, address: string, items: Items, route?: string) {
    this.name = name;
    this.address = { rawAddr: address };
    this.items = items;
    if (route) this.address = { ...this.address, route };
  }

  setCoordinates(
    addr: string,
    lat: number,
    long: number,
    boundingbox: number[]
  ) {
    this.address = {
      ...this.address,
      geocodedAddr: addr,
      lat,
      long,
      boundingbox,
    };
  }

  setRoute(route: string) {
    this.address = { ...this.address, route };
  }
}

export default School;
