export function generateNumber() {
  const givenSet = '0123456789';

  let code = '';
  for (let i = 0; i < 6; i++) {
    const pos = Math.floor(Math.random() * givenSet.length);
    code += givenSet[pos];
  }

  return code;
}
