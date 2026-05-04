import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAppointmentStore = create(
  persist(
    (set) => ({
      appointments: [],
      bookAppointment: (doctor, date, time) =>
        set((state) => {
          const newAppointment = {
            ...doctor,
            appointmentId: Date.now(),
            date: date,
            time: time,
          };
          return { appointments: [...state.appointments, newAppointment] };
        }),
      cancelAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.filter(
            (app) => app.appointmentId !== id,
          ),
        })),
    }),
    { name: "appointments-storage" },
  ),
);
