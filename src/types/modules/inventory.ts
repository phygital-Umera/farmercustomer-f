/* eslint-disable */
import { ApiResponse } from './common';

// **Process Interfaces**
export interface Process {
  ProcessID: string;
  ProcessName: string;
  Description: string;
}

export interface ProcessUpdateParams {
  id: string;
  token?: string;
  ProcessName: string;
  Description: string;
}

export interface ProcessesResponse {
  processes: Process[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export type GetAllProcessesApiResponse = ApiResponse<ProcessesResponse>;

export interface CreateProcessParams {
  token?: string;
  ProcessName: string;
  Description: string;
}

// **Utensil Category Interfaces**
export interface UtensilCategory {
  UtensilCategoryID: string;
  CategoryName: string;
}

export interface UtensilCategoryUpdateParams {
  UtensilCategoryID: string;
  token?: string;
  CategoryName: string;
}

export interface UtensilCategoriesResponse {
  utensilCategories: UtensilCategory[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export type GetAllUtensilCategoriesApiResponse =
  ApiResponse<UtensilCategoriesResponse>;

export interface CreateUtensilCategoryParams {
  token?: string;
  CategoryName: string;
}

// **Utensil Interfaces**
export interface Utensil {
  UtensilId: string;
  UtensilName: string;
  CategoryName: string;
  UtensilCategoryID: string;
}

export interface UtensilUpdateParams {
  id: string;
  token?: string;
  UtensilName: string;
  UtensilCategoryId: string;
}

export interface UtensilsResponse {
  DishID: string;
  utensils: Utensil[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export type GetAllUtensilsApiResponse = ApiResponse<UtensilsResponse>;

export interface CreateUtensilParams {
  UtensilName: string;
  UtensilCategoryID: string;
}

// **Disposal Category Interfaces**
export interface DisposalCategory {
  id: string;
  CategoryName: string;
}

export interface DisposalCategoryUpdateParams {
  id: string;
  token?: string;
  CategoryName: string;
}

export interface DisposalCategoriesResponse {
  disposalCategories: DisposalCategory[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export type GetAllDisposalCategoriesApiResponse =
  ApiResponse<DisposalCategoriesResponse>;

export interface CreateDisposalCategoryParams {
  token?: string;
  CategoryName: string;
}

// **Disposal Interfaces**
export interface Disposal {
  id: string;
  DisposalName: string;
  CategoryName: string;
  DisposalCategoryId?: string;
}

export interface DisposalUpdateParams {
  id: string;
  token?: string;
  DisposalName: string;
  DisposalCategoryId: string;
}

export interface DisposalsResponse {
  disposals: Disposal[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export type GetAllDisposalsApiResponse = ApiResponse<DisposalsResponse>;

export interface CreateDisposalParams {
  token?: string;
  DisposalName: string;
  DisposalCategoryId: string;
}

// event disposal interface
export interface CreateEventDisposal {
  token?: string;
  EventID: string;
  DisposalID: string;
  takenQuantity: number;
}

export interface EventDisposal {
  returned: any;
  taken: any;
  name: any;
  EventID: string;
  DisposalID: string;
  takenQuantity: number;
  returnedQuantity: number;
}

export interface EventDisposalParams {
  token?: string;
  eventId: string;
  disposalId: string;
}

export interface UpdateEventDisposal {
  token?: string;
  takenQuantity: number;
  returnedQuantity: number;
}

export interface EventDisposalResponse {
  eventDisposals: EventDisposal[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export type GetAllEventDisposalApiResponse = ApiResponse<EventDisposalResponse>;

// event utensil interface types
export interface CreateEventUtensil {
  token?: string;
  EventID: string;
  UtensilID: string;
  takenQuantity: number;
  returnedQuantity: number;
}

export interface EventUtensil {
  EventID: string;
  UtensilID: string;
  takenQuantity: number;
  returnedQuantity: number;
}

export interface EventUtensilParams {
  token?: string;
  eventId: string;
  utensilId: string;
}

export interface UpdateEventUtensil {
  token?: string;
  takenQuantity: number;
  returnedQuantity: number;
}

export interface EventUtensilResponse {
  eventUtensils: EventUtensil[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export type GetAllEventUtensilApiResponse = ApiResponse<EventUtensilResponse>;
