// lib/rideStore.ts
import { create } from "zustand";

type Pickup = { id: string; name?: string; lat?: number; lng?: number };
type Ride = {
  id: string | null;
  destination: string | null;
  pickups: Pickup[];
};

type RideState = {
  ride: Ride;
  createRide: (destination: string) => void;
  addPickup: (pickup: Pickup) => void;
  reset: () => void;
};

export const useRideStore = create<RideState>((set) => ({
  ride: { id: null, destination: null, pickups: [] },
  createRide: (destination) =>
    set({
      ride: {
        id: Math.random().toString(36).slice(2), // simple rideId for MVP
        destination,
        pickups: [],
      },
    }),
  addPickup: (pickup) =>
    set((s) => ({ ride: { ...s.ride, pickups: [...s.ride.pickups, pickup] } })),
  reset: () => set({ ride: { id: null, destination: null, pickups: [] } }),
}));
