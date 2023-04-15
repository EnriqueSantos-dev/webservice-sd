import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Input } from "@/components/Input";
import { FormValues, useFormContext } from "@/contexts/form-context";
import { formatDateToIso, validateCpf } from "@/utils";
import { Button } from "@/components/Button";
import { differenceInHours, addHours } from "date-fns";

const schema = z
	.object({
		cpf: z
			.string({ required_error: "O CPF é obrigatório" })
			.transform((cpf) => cpf.replace(/\D/g, ""))
			.refine((cpf) => cpf.length === 11, {
				message: "O CPF deve conter 11 dígitos",
			})
			.refine((cpf) => validateCpf(cpf), { message: "O CPF inválido" }),
		startDate: z
			.string()
			.nonempty({ message: "A data inicial é obrigatória" })
			.transform((date) => `${formatDateToIso(new Date(date))}.000Z`),
		endDate: z
			.string()
			.nonempty({ message: "A data final é obrigatória" })
			.transform((date) => `${formatDateToIso(new Date(date))}.000Z`),
	})
	.superRefine((data, ctx) => {
		const startDate = new Date(data.startDate);
		const endDate = new Date(data.endDate);

		if (endDate.getTime() < startDate.getTime()) {
			ctx.addIssue({
				code: "invalid_date",
				message: "A data final deve ser maior que a data inicial",
				path: ["endDate"],
			});

			return z.NEVER;
		}

		if (differenceInHours(endDate, startDate) < 1) {
			ctx.addIssue({
				code: "invalid_date",
				message: "A locação deve ter pelo menos 1 hora",
				path: ["endDate"],
			});

			return z.NEVER;
		}

		return true;
	});

const makeMaskCpf = (cpf: string) => {
	return (
		cpf
			.replace(/\D/g, "")
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d{1,2})/, "$1-$2")
			.replace(/(-\d{2})\d+?$/, "$1") ?? ""
	);
};

type Output = z.infer<typeof schema>;

export function Step1() {
	const { setData, setCurrentStep } = useFormContext();
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			startDate: formatDateToIso(new Date()).substring(0, 16),
			endDate: formatDateToIso(addHours(new Date(), 1)).substring(0, 16),
			cpf: "",
		},
		resolver: zodResolver(schema),
	});

	const onSubmit = (data: Output) => {
		setData(data);
		setCurrentStep(2);
		navigate("/step2");
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="mt-10 container max-w-md flex flex-col gap-4 px-4 md:px-0"
		>
			<label className="flex flex-col gap-3 text-white">
				<span className="font-bold">CPF</span>
				<Controller
					name="cpf"
					control={control}
					render={({ field: { onChange, value }, formState: { errors } }) => (
						<Input
							type="text"
							placeholder="Ex: 000.000.000-00"
							value={value}
							onChange={({ target: { value } }) => onChange(makeMaskCpf(value))}
							errorMessage={errors.cpf?.message}
						/>
					)}
				/>
			</label>

			<div className="flex flex-col md:flex-row gap-3 items-stretch w-full">
				<label className="flex flex-col gap-3 text-white">
					<span className="font-bold">Data Inicial</span>
					<Input
						type="datetime-local"
						min={formatDateToIso(new Date()).substring(0, 16)}
						errorMessage={errors.startDate?.message}
						{...register("startDate")}
					/>
				</label>

				<label className="flex flex-col gap-3 text-white">
					<span className="font-bold">Data Final</span>
					<Input
						type="datetime-local"
						min={formatDateToIso(new Date()).substring(0, 16)}
						errorMessage={errors.endDate?.message}
						{...register("endDate")}
					/>
				</label>
			</div>

			<Button>Escolher Modelo do Carro</Button>
		</form>
	);
}
