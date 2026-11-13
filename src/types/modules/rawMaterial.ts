/* eslint-disable */
import { ApiResponse } from './common';

// Raw Material Interfaces
export interface CreateRawMaterialCategory {
  Name: string;
  token?: string;
}

export interface RawMaterials {
  RawMaterialID: string;
  RawMaterialName: string;
  RawMaterialCategoryID: string;
  RawMaterialUnit: string;
}

export interface RawMaterialCategoryUpdateParams {
  token?: string;
  id: string;
  Name: string;
}

export interface CreateRawMaterial {
  Name: string;
  CategoryID: string;
  Unit: string;
  token?: string;
}

export interface RawMaterialUpdateParams {
  token?: string;
  id: string;
  Name: string;
  CategoryID: string;
  RawMaterialUnit: string;
}

// raw Material
export interface RawMaterial {
  RawMaterialID: string;
  RawMaterialName: string;
  RawMaterialUnit: 'LITRE' | 'GRAM' | 'KILOGRAM' | 'BOTTLE' | 'METER';
  ProcessID: string;
}

export interface RawMaterialParams extends RawMaterial {
  token?: string;
}

export interface RawMaterialResponse {
  rawMaterials: RawMaterial[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export type GetAllRawMaterialResponse = ApiResponse<RawMaterialResponse>;
