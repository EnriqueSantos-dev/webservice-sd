export type RentalType = {
  startDate: Date;
  endDate: Date;
  car: Car;
  cpf: string;
};

type Car = {
  model: string;
  value: number;
};

export const carsModels = [
  {
    model: "Volkswagen Golf GTI",
    value: 1000,
  },
  {
    model: "Ferrari 488 GTB",
    value: 3000,
  },
  {
    model: "Lamborghini Aventador",
    value: 4000,
  },
  {
    model: "Porsche 911 Turbo",
    value: 3500,
  },
  {
    model: "Gol Quadrado",
    value: 10000,
  },
] as const;

export type CarModelUnion = typeof carsModels[number]["model"];
export const rentals: RentalType[] = [];
