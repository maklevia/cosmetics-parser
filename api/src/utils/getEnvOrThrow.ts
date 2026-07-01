export function getEnvOrThrow(name: string) {
  const envValue = process.env[name];
  if (!envValue || envValue.trim() === '') {
    throw new Error(`Env Variable ${name} is not set or empty`);
  }
  return envValue;
}
