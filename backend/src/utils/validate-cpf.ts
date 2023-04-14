export function validateCpf(cpf: string): boolean {
  // Remove caracteres não numéricos do CPF
  cpf = cpf.replace(/\D/g, "");

  // Verifica se o CPF tem 11 dígitos
  if (cpf.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }

  // Calcula o primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = soma % 11;
  let digito_verif1: number;
  if (resto < 2) {
    digito_verif1 = 0;
  } else {
    digito_verif1 = 11 - resto;
  }

  // Verifica o primeiro dígito verificador
  if (parseInt(cpf.charAt(9)) !== digito_verif1) {
    return false;
  }

  // Calcula o segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = soma % 11;
  let digito_verif2: number;
  if (resto < 2) {
    digito_verif2 = 0;
  } else {
    digito_verif2 = 11 - resto;
  }

  // Verifica o segundo dígito verificador
  if (parseInt(cpf.charAt(10)) !== digito_verif2) {
    return false;
  }

  // Se passou por todas as verificações, o CPF é válido
  return true;
}
