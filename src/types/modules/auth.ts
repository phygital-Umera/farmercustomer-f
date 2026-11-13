/* eslint-disable */
import React from 'react';

// **User and Auth Interfaces**
export interface User {
  email: string; // User's email
  exp: number; // Expiration timestamp (usually in seconds since Unix epoch)
  fullname: string; // User's full name
  iat: number; // Issued-at timestamp (when the token was created, in seconds since Unix epoch)
  id: string; // User's unique identifier (likely a string, depending on how it's generated)
  role: string; // User's role (could be 'admin', 'user', etc.)
  username: string;
  languageId?: string;
  caterorId?: string;
  phoneNumber?: string;
  address?: string;
  GSTin: string;
  plan: string;
  isCounter: boolean;
  employeeRestriction: {
    eventPage: boolean;
    clientPage: string;
    vehiclepage: string;
    dresscodepage: string;
    cutlerypage: string;
    cutlerycategorypage: string;
    mastercutlerypage: string;
    crmprocesspage: string;
    crmdashboardpage: string;
    maharajPage: string;
    packagePage: string;
    rawMaterialCategoryPage: string;
    rawMaterialPage: string;
    dishPage: string;
    dishCategoryPage: string;
    settingPage: string;
    rawMaterialProcessPage: string;
    utensilCategoryPage: string;
    utensilPage: string;
    utensilProcessPage: string;
    utensilsInventoryPage: string;
    utensilpeoplepage: string;
    disposalCategoryPage: string;
    disposalPage: string;
    disposalInventoryPage: string;
    disposalpeoplepage: string;
    rawmaterialvendorpage: string;
    displayvendorpage: string;
    disposalvendorpage: string;

    addonServicePage: string;
    foodVendorPage: string;
    incomeExpenditurePage: string;
    notificationDishPage: string;
    expenseMasterPage: string;
    vendorPage: string;
    reportsPage: string;
    counterpage: string;
  };
}

export type UserRole = {
  Role: string;
};

export type Token = {
  accessToken?: string;
  refreshToken?: string;
};

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
  token: Token | null;
  setToken: React.Dispatch<React.SetStateAction<Token | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  /** True while restoring auth state from localStorage on mount */
  isLoading: boolean;
  /** Atomically sets all auth state and persists to localStorage */
  login: (accessToken: string, userData?: any, refreshToken?: string) => void;
  /** Clears all auth state and removes from localStorage */
  logout: () => void;
}
