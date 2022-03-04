export function sum(num1, num2) {
  const number1 = parseFloat(num1);
  const number2 = parseFloat(num2);
  if (Number.isNaN(number1) || Number.isNaN(number2)) {
    throw new Error('Please check your input');
  }
  return number1 + number2;
}
