/* eslint-disable */
import React from 'react';

// **Common Interfaces**
export interface ApiResponse<T> {
  statusCode: number;
  status: boolean;
  message: string;
  data: T;
}

export interface PaginationParams {
  token?: string;
  page?: number;
  limit?: number;
  query?: string;
}

export interface IdAndToken {
  id: string;
  token?: string;
}

// **Pagination Interfaces**
export interface LimitSelectorProps {
  pageOptions?: number[];
  selectedLimit: number;
  onLimitChange: (newLimit: number) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// **Loader Interfaces**
export interface LoadingErrorNoDataProps {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  hasData: boolean;
  children: React.ReactNode;
}
