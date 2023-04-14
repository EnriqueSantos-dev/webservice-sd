import { Button } from "@/components/Button";
import { InputCarModel } from "@/components/InputCarModel";
import { Spinner } from "@/components/Spinner";
import { useFormContext } from "@/contexts/form-context";
import { useCreateRental } from "@/hooks/useCreateRental";
import { useGetCarModels } from "@/hooks/useGetCarModels";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ToastOptions, toast } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";

const BASE_URL = "http://localhost:3333";

const schema = z.object({
  model: z.string({ required_error: "O modelo é obrigatório" }),
});

type FormData = z.infer<typeof schema>;

const TOAST_OPTIONS = {
  duration: 3000,
} satisfies ToastOptions;

export function Step2() {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { models, loading } = useGetCarModels(`${BASE_URL}/models`);
  const {
    data: createRentalData,
    createRental,
    error: createRentalError,
    isLoading: isLoadingCreateRental,
  } = useCreateRental(`${BASE_URL}/rental`);
  const [selectedModel, setSelectedModel] = useState("");
  const { currentStep, setCurrentStep, data } = useFormContext();

  const handleSelectModel = (model: string) => setSelectedModel(model);

  const handleSubmitForm: SubmitHandler<FormData> = async (
    formData: FormData
  ) => {
    const dataForRental = { model: formData.model, ...data };
    await createRental(dataForRental);
  };

  useEffect(() => {
    if (createRentalError) {
      toast.error(createRentalError, TOAST_OPTIONS);
      return;
    }

    if (createRentalData && !isLoadingCreateRental) {
      toast.success(
        `Locação criada com sucesso, valor: ${createRentalData.valor}`,
        TOAST_OPTIONS
      );
      setCurrentStep(1);
      navigate("/step1");
    }
  }, [isLoadingCreateRental, createRentalData, createRentalError]);

  if (currentStep !== 2) return <Navigate to="/step1" />;

  return (
    <div className="container px-6 md:px-0 py-8">
      {loading && <Spinner />}
      {!loading && (
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-4">
            {models.map(({ model, value: price }) => (
              <Controller
                key={model}
                name="model"
                control={control}
                render={({ field: { onChange, ...rest } }) => (
                  <InputCarModel
                    id={model}
                    type="radio"
                    handleSelect={handleSelectModel}
                    model={model}
                    price={price}
                    selectedModel={selectedModel}
                    {...rest}
                    value={model}
                    onChange={(e) => {
                      handleSelectModel(model);
                      onChange(model);
                    }}
                    hidden
                  />
                )}
              />
            ))}

            {errors.model && (
              <p className="text-bold text-red-500 text-center text-sm">
                {errors.model?.message}
              </p>
            )}
          </div>

          <div className="max-w-xs mx-auto w-full">
            <Button>Alugar Carro</Button>
          </div>
        </form>
      )}
    </div>
  );
}
