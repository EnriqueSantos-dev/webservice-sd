import { CarModel } from "@/types";
import { useState, useEffect } from "react";

const getCarsModel = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.models as CarModel[];
};

export const useGetCarModels = (url: string) => {
  const [models, setCarModels] = useState<CarModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCarsModel(url)
      .then((data) => {
        setCarModels(data);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, []);

  return { models, loading };
};
