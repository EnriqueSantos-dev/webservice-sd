export type CarModel = {
  model: string;
  value: number;
};

export type CreateRentalResponse = {
  disponibilidade: boolean;
  valor: number;
};

export type CreateRentalRequest = Record<
  "startDate" | "endDate" | "model" | "cpf",
  string
>;
