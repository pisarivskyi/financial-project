/* eslint @typescript-eslint/no-namespace: 0 */
import { CurrencyEnum } from '@financial-project/common';

export namespace ApiMonobank {
  export namespace ClientInfo {
    export interface ResponseInterface {
      clientId: string;
      name: string;
      webHookUrl: string;
      permissions: string;
      accounts: AccountInterface[];
    }

    export interface AccountInterface {
      id: string;
      sendId: string;
      currencyCode: CurrencyEnum;
      cashbackType: string;
      balance: number;
      creditLimit: number;
      maskedPan: string[];
      // TODO: set bank specific type here
      type: string;
      iban: string;
    }
  }

  export namespace Statement {
    export type ResponseType = StatementInterface[];

    export interface StatementInterface {
      id: string;
      time: number;
      description: string;
      mcc: number;
      originalMcc: number;
      hold: boolean;
      amount: number;
      operationAmount: number;
      currencyCode: number;
      commissionRate: number;
      cashbackAmount: number;
      balance: number;
      comment: string;
      receiptId: string;
      invoiceId: string;
      counterEdrpou: string;
      counterIban: string;
      counterName: string;
    }
  }

  export namespace Currencies {
    export type ResponseType = CurrencyInterface[];

    export interface CurrencyInterface {
      currencyCodeA: CurrencyEnum;
      currencyCodeB: CurrencyEnum;
      date: number;
      rateBuy: number;
      rateSell: number;
    }
  }
}
