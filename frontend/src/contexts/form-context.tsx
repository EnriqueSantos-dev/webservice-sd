import { createContext, useContext, useState } from "react";

export type FormValues = {
  cpf: string;
  carModel: string;
  startDate: string;
  endDate: string;
};

type FormContextType = {
  data: FormValues;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  setData: (data: Partial<FormValues>) => void;
  onSubmit: (callback: (data: FormValues) => any) => Promise<any>;
};

const FormContext = createContext<FormContextType>({} as FormContextType);

export const FormContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<FormValues>({} as FormValues);

  const onSubmit = async (callback: (data: FormValues) => any) => {
    return await callback(data);
  };

  const onChangeData = (data: Partial<FormValues>) => {
    setData((prev) => ({ ...prev, ...data }));
  };

  const handleNextStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <FormContext.Provider
      value={{
        data,
        setData: onChangeData,
        onSubmit,
        currentStep,
        setCurrentStep: handleNextStep,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => useContext(FormContext);
