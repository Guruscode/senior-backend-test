export function generateTransactionReference(): string {
  const timestamp = Date.now(); // Get current timestamp
  const random = Math.floor(Math.random() * 100000); // Generate a random number
  return `TX-${timestamp}-${random}`;
}
