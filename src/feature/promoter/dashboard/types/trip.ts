export type Coordinates = {
  lat: number;
  lng: number;
};

export type TripFormData = {
  selectedUserId: string;
  vehicle: string;
  pickupLocation: string;
  dropLocation: string;
  pickupCoordinates: Coordinates | null;
  dropCoordinates: Coordinates | null;
  date: string;
  time: string;
  price: string;
  notes: string;
};

export type TripMapApplyPayload = {
  pickupLocation: string;
  dropLocation: string;
  pickupCoordinates: Coordinates | null;
  dropCoordinates: Coordinates | null;
};

export type LocationField = "pickup" | "drop";

export type LocationFieldState = {
  value: string;
  placeId: string;
  coordinates: Coordinates | null;
};
