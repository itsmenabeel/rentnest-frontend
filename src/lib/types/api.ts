export interface ApiErrorDetail {
  path: string
  message: string
}

export interface ApiSuccess<T> {
  success: true
  message: string
  data: T
}

export interface ApiErrorBody {
  success: false
  message: string
  errorDetails?: ApiErrorDetail[]
}

export type ApiResponseBody<T> = ApiSuccess<T> | ApiErrorBody

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type Paginated<T, Key extends string> = {
  meta: PaginationMeta
} & Record<Key, T[]>
