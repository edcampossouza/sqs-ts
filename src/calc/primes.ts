export function numberOfDivisors(n: number): number {
  let divisors = 0;

  for (let i = 1; i <= n; i++) {
    if (n % i === 0) divisors++;
  }

  return divisors;
}
