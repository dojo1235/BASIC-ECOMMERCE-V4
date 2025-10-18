import { z } from 'zod'

const envSchema = z.object({
  PORT: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_EXPIRES_IN: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string(),
})

export default () => {
  const parsedEnv = envSchema.parse(process.env)
  return {
    port: Number(parsedEnv.PORT),
    database: {
      host: parsedEnv.DB_HOST,
      port: Number(parsedEnv.DB_PORT),
      username: parsedEnv.DB_USER,
      password: parsedEnv.DB_PASS,
      name: parsedEnv.DB_NAME,
    },
    jwt: {
      accessSecret: parsedEnv.JWT_ACCESS_SECRET,
      refreshSecret: parsedEnv.JWT_REFRESH_SECRET,
      accessExpiresIn: parsedEnv.JWT_ACCESS_EXPIRES_IN,
      refreshExpiresIn: parsedEnv.JWT_REFRESH_EXPIRES_IN,
    },
  }
}
