/* eslint-disable */
import { ApiResponse } from './common';

// Maharaj types declaration
export interface CreateMaharaj {
  token?: string;
  username: string;
  email: string;
  phoneNo: string;
  password: string;
  name: string;
  specialization: string;
  experience: string;
  caterorID: string;
}

export interface UpdateMaharaj {
  id: string;
  token?: string;
  Specialization: string;
  Experience: number;
  isAvailable: boolean;
}

// Client type declaration
export interface Clients {
  ClientID: string;
  Username: string;
  Email: string;
  PhoneNo: string;
  Name: string;
  isVeg: boolean;
  isJain: boolean;
  Address: string;
  Caste: string;
}

export interface CreateClient {
  token?: string;
  username: string;
  email: string;
  phoneNo: string;
  password: string;
  caterorID: string;
  name: string;
  isVeg: boolean;
  isJain: boolean;
  Address: string;
  Caste: string;
}

export interface UpdateClient {
  id: string;
  token?: string;
  isVeg: boolean;
  isJain: boolean;
  Address: string;
  Caste: string;
}

export interface ClientResponse {
  clients: Clients[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export type GetAllClientApiResponse = ApiResponse<ClientResponse>;

// Staff type declaration
export interface Staff {
  token?: string;
  StaffID: string;
  Username: string;
  Email: string;
  PhoneNo: string;
  Name: string;
  JobType: string;
  Address: string;
}

export interface CreateStaff {
  token?: string;
  username: string;
  email: string;
  phoneNo: string;
  password: string;
  name: string;
  jobType: string;
  address: string;
  caterorID: string;
}

export interface UpdateStaff {
  id: string;
  token?: string;
  jobType: string;
  address: string;
}
