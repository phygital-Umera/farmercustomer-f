/* eslint-disable */
import { ApiResponse } from './common';

// **Cateror Interfaces**
export interface Cateror {
  CaterorID: string;
  createdAt: string;
  updatedAt: string;
  Username: string;
  Email: string;
  Name: string;
  Avatar: string | null;
  PhoneNo: string;
}

export interface CaterorUpdateParams {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar: string | null;
  phoneNo: string;
}

export interface CaterorsResponse {
  caterors: Cateror[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export type GetAllCaterorsApiResponse = ApiResponse<CaterorsResponse>;

export interface CreateCaterorParams {
  username: string;
  email: string;
  name: string;
  phoneNo: string;
  password: string;
}
