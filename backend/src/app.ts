import cors from "cors";
import express from "express";
import { z } from "zod";
import { areIntervalsOverlapping, differenceInHours, parseISO } from "date-fns";
import { carsModels, rentals, RentalType } from "./data/db";
import { formatValue, validateCpf } from "./utils";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/models", (_, response) => {
  return response.json({ models: carsModels });
});

app.post("/rental", (request, response) => {
  const schema = z
    .object({
      model: z
        .string()
        .nonempty({ message: "model is required" })
        .trim()
        .toLowerCase(),
      cpf: z
        .string()
        .nonempty({ message: "cpf is required" })
        .transform((cpf) => cpf.replace(/\D/g, ""))
        .refine((cpf) => cpf.length === 11, {
          message: "cpf must be required 11 chars",
        })
        .refine((cpf) => validateCpf(cpf), { message: "invalid cpf" }),
      startDate: z
        .string()
        .nonempty({ message: "start date is required" })
        .transform((date) => parseISO(date))
        .refine((date) => date < new Date(), {
          message: "startDate needs to be in the past",
        }),
      endDate: z
        .string()
        .nonempty({ message: "end date is required" })
        .transform((date) => parseISO(date))
        .refine(
          (date) => {
            const [hours, minutes, seconds] = new Date()
              .toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo",
              })
              .split(" ")[1]
              .split(":");

            const now = parseISO(
              `${
                new Date().toISOString().split("T")[0]
              }T${hours}:${minutes}:${seconds}.000Z`
            );

            return date.getTime() > now.getTime();
          },
          { message: "endDate needs to be in the future" }
        ),
    })
    .superRefine(({ endDate, startDate }, ctx) => {
      if (endDate < startDate) {
        ctx.addIssue({
          code: "invalid_date",
          message: "invalid date",
          path: ["endDate"],
        });
      }
    });

  const parsedBody = schema.safeParse(request.body);

  if (!parsedBody.success) {
    return response.status(400).json({ errors: parsedBody.error.issues });
  }

  const { model, cpf, startDate, endDate } = parsedBody.data;

  const car = carsModels.find(
    (car) => car.model.toLowerCase().trim() === model
  );

  if (!car) {
    return response.status(400).json({ message: "Model Not Found" });
  }

  const rentalFound = rentals.find(
    (rental) => rental.car.model.trim().toLowerCase() === model
  );

  if (rentalFound) {
    const isRentalOverlapping = areIntervalsOverlapping(
      {
        start: startDate,
        end: endDate,
      },
      {
        start: rentalFound?.startDate,
        end: rentalFound?.endDate,
      },
      {
        inclusive: true,
      }
    );

    if (isRentalOverlapping) {
      return response.status(400).json({ disponibilidade: false, valor: 0 });
    }
  }

  const rental = { car, cpf, startDate, endDate } satisfies RentalType;
  rentals.push(rental);

  return response.json({
    disponibilidade: true,
    valor: formatValue(car.value * differenceInHours(endDate, startDate)),
  });
});

app.listen(3333, () =>
  console.log(`http server running at: http://localhost:${3333}`)
);
