export const buildResponse = (data: any = null, message: string | null = null) => ({
  success: true,
  message,
  data,
})
