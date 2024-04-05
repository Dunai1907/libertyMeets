import Geocode from "react-geocode";

interface AddressComponent {
  long_name: string;
  types: Array<string>;
}

export interface Location {
  address_components: Array<AddressComponent>;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

const apiKey = process.env.GEOCODE;
const filterCountry = process.env.FILTER_COUNTRY;

export interface LocationSearchResult {
  locations: Location[];
}

const getLocations = async (
  searchTerm: string
): Promise<LocationSearchResult | null> => {
  try {
    if (!apiKey) {
      throw new Error("Not found Api key");
    }

    Geocode.setApiKey(apiKey);
    Geocode.setRegion("us");

    const response: { results: Array<Location> } = await Geocode.fromAddress(
      `${searchTerm}`
    );

    const locationsInUSA = response.results.filter((location) =>
      location.formatted_address.includes(filterCountry || "USA")
    );

    if (locationsInUSA.length === 0) {
      return null;
    }

    return { locations: locationsInUSA };
  } catch (e) {
    return null;
  }
};

export default getLocations;
