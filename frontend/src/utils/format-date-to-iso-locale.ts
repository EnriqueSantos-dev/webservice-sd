export const formatDateToIso = (date: Date) => {
  const localDate = new Date(date)
    .toLocaleString("pt-BR")
    .replaceAll(" ", "")
    .replaceAll("/", "-")
    .replace(",", "T");

  return `${localDate.substring(6, 10)}-${localDate.substring(
    3,
    5
  )}-${localDate.substring(0, 2)}${localDate.substring(10)}`;
};
