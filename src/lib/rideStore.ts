// lib/rideStore.ts
import { create } from "zustand";

type Pickup = { id: string; name?: string; lat?: number; lng?: number };
type Ride = { id: string | null; destination: string | null; pickups: Pickup[] };

type RideState = {
  ride: Ride;
  createRide: (destination: string) => void;
  attachRide: (id: string, destination: string) => void;  
  addPickup: (pickup: Pickup) => void;
  removePickup: (pickupId: string) => void;
  reset: () => void;
};

export const useRideStore = create<RideState>((set) => ({
  ride: { id: null, destination: null, pickups: [] },

  createRide: (destination) => {
    const id = Math.random().toString(36).slice(2);
    set({ ride: { id, destination, pickups: [] } });
    return id; // ✅
  },

  attachRide: (id, destination) =>
    set({ ride: { id, destination, pickups: [] } }),

  addPickup: (p) => set((s) => ({ ride: { ...s.ride, pickups: [...s.ride.pickups, p] } })),

  removePickup: (pid) => set((s) => ({ ride: { ...s.ride, pickups: s.ride.pickups.filter(p => p.id !== pid) } })),

  reset: () => set({ ride: { id: null, destination: null, pickups: [] } }),

}));
