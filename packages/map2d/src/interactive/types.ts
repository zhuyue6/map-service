export type InteractiveEvent<T extends Record<string, unknown>> = {
  enabled: boolean,
  enable(): void 
  close(): void
  destroy(): void
} & T

export type Interactive<T extends Record<string, unknown> = Record<string, unknown>> = {
  id: number
  type: string
} & InteractiveEvent<T>