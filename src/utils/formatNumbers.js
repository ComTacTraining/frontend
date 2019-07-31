export function formatUSD(stripeAmount) {
  return `$${(stripeAmount / 100).toFixed(2)}`;
}

export function formatStripeAmount(USDString) {
  return parseFloat(USDString) * 100;
}

export function nextBill(currentPeriodEnd) {
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const timeBetween = currentPeriodEnd - currentTime;
  return Math.floor(timeBetween / (24 * 60 * 60)) + 1;
}
