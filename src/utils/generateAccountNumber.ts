export const generateAccountNumber = (): string => {
  const prefix = '10'; // You can customize this prefix
  const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  return prefix + randomNumber.substring(0, 8);
};