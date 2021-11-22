export interface ConfigProps {
  speed: number
  width: number
  height: number
  viewBox: string
  backgroundColor: string
  foregroundColor: string
}

export interface FieldProps {
  style: string
  x?: any
  y?: any
  r?: any
  width?: any
}

export interface LoaderProps {
  params: {
    rx?: number
    ry?: number
    height: number
    margin: number
    width: number
    config: ConfigProps
    fields: FieldProps[]
  },
}