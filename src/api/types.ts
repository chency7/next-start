export type ApiResponse<T = any> = {
  code: number;
  data: T;
  message: string;
};

export type ApiError = {
  code: number;
  message: string;
  details?: Record<string, any>;
};

export type PaginationParams = {
  page: number;
  pageSize: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
