/* eslint-disable */
import { ApiResponse, IdAndToken } from './common';

// subscription interface types
export interface CreateSubscription {
  token?: string;
  CaterorID: string;
  Price: number;
  TimePeriod: string;
  ReceivedAmount: number;
  startDate: string;
  nextYearRenewalFees: number;
}

export interface Subscription {
  Price: number;
  TimePeriod: string;
  ReceivedAmount: number;
  RemainingAmount: number;
  startDate: string;
  endDate: string;
  nextYearRenewalFees: number;
}

export interface SubscriptionsResponse {
  subscriptions: Subscription[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export type SubscriptionUpdateParams = CreateSubscription & IdAndToken;

export type GetAllSubscriptionApiResponse = ApiResponse<SubscriptionsResponse>;

// transaction types
export interface Transaction {
  ClientID: string;
  CaterorID: string;
  Description: string;
  Amount: number;
  Type: 'Income' | 'Expense' | 'Receivable' | 'Payable';
}

export type TransactionParams = Omit<Transaction, 'Amount' | 'Description'>;

export enum IncomeExpense {
  Income = 'INCOME',
  Expense = 'EXPENDITURE',
  Payable = 'PAYABLE',
  Recivable = 'RECEIVABLE',
}
