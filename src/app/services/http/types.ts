export type GeocodingResponse = {
  results: {
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
      viewport: {
        northeast: {
          lat: number;
          lng: number;
        };
        southwest: {
          lat: number;
          lng: number;
        };
      };
    };
  }[];
  status: string;
};

export type DirectionsResponse = {
  routes: {
    legs: {
      distance: {
        value: number;
      };
    }[];
  }[];
};

export type DistanceMatrixApiResponse = {
  status: string;
  rows: {
    elements: {
      distance: {
        value: number;
      };
      status: string;
    }[];
  }[];
};
