import { CreateRentalRequest, CreateRentalResponse } from "@/types";
import { useCallback, useState } from "react";

export function useCreateRental(url: string) {
  const [data, setData] = useState<CreateRentalResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRental = useCallback(async (data: CreateRentalRequest) => {
    setIsLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok && response.status === 400) {
        const error = await response.json();

        if ("disponibilidade" in error && !error.disponibilidade) {
          throw new Error("O carro já está alugado no período selecionado");
        }

        throw new Error("Erro ao criar locação");
      }

      const rental = (await response.json()) as CreateRentalResponse;
      setData(rental);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, createRental, isLoading, error };
}
