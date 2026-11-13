/* eslint-disable */
import { ApiResponse } from './common';

// Dish Category Interfaces
export interface DishCategoryUpdateParams {
  token?: string;
  id: string;
  Name: string;
}

export interface CreateDish {
  token?: string;
  Name: string;
  CategoryID: string;
  Description: string;
}

export interface CreateDishParams {
  token?: string;
  Name: string;
  CategoryID: string;
  Description?: string;
  DishUnit: number;
  rawMaterials: {
    RawMaterialID: string;
    RawMaterialQuantity: number;
  }[];
}

export interface Dishes {
  DishID: string;
  DishName: string;
  DishDescription: string;
  DishCategoryID: string;
  DishCategoryName: string;
}

export interface DishResponse {
  dishes: Dishes[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export type GetAllDishApiResponse = ApiResponse<DishResponse>;

// Cateror Dish
export interface CaterorDish {
  DishID: string;
  DishName: string;
  DishCategoryID: string;
}

export type CreateCaterorDish = {
  DishName: string;
  DishCategoryID: string;
  CaterorID: string;
};

export type UpdateCaterorDishParams = CreateCaterorDish;

export interface CaterorDishResponse {
  caterorDishes: CaterorDish[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export type GetAllCaterorDishResponse = ApiResponse<CaterorDishResponse>;

// Cateror Dish Raw Material
export interface CaterorDishRawMaterial {
  DishID: string;
  RawMaterialID: string;
  CaterorID: string;
  PeopleCount: number;
  Quantity: number;
  UnitPrices: number;
}

export type CreateCaterorDishRawMaterial = CaterorDishRawMaterial & {
  token?: string;
};

export type CaterorDishRawMaterialParams = Omit<
  CaterorDishRawMaterial,
  'PeopleCount' | 'Quantity' | 'UnitPrices'
>;

export type UpdateCaterorDishRawMaterial = CaterorDishRawMaterial;

export interface CaterorDishRawMaterialResponse {
  CaterorDishRawMaterial: CaterorDishRawMaterial[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export type GetAllCaterorDishRawMaterialResponse =
  ApiResponse<CaterorDishRawMaterialResponse>;

// Create Dish (merged with above CreateDish interface)
export interface CreateDish {
  DishName: string;
  DishCategoryID: string;
  DishDescription: string;
}

// Dish Category
export interface DishCategory {
  id: string;
  name: string;
}

export interface CreateDishCategory {
  token?: string;
  CategoryName: string;
}

export interface DishCategoryParams extends DishCategory {
  token?: string;
}

export interface DishCategoriesResponse {
  dishCategories: DishCategory[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export type GetAllDishCategories = ApiResponse<DishCategoriesResponse>;

// Raw materials in the dish
export interface CreateDishRawMaterial extends Omit<
  CaterorDishRawMaterial,
  'CaterorID'
> {
  token?: string;
}

export interface PredictRawMaterialQuantity extends Omit<
  CaterorDishRawMaterial,
  'Quantity' | 'number' | 'UnitPrices' | 'CaterorID'
> {
  token?: string;
}

export interface UpdateDishRawMaterialParams extends CreateDishRawMaterial {}

export interface DishRawMaterialParams {
  token?: string;
  DishID: string;
  RawMaterialID: string;
}

export interface GetDishRawMaterialsParams {
  DishID: string;
}
