import type {
  ModListApiResponse,
  IModListQuery,
  ModRetrieveApiResponse,
} from "@dicecho/types";
import { APIClient, APIClientOptions } from "./apiClient";
import qs from "qs";

interface ModFilterConfig {
  rules: Array<{ _id: string; count: number }>;
  origins: Array<{ _id: string; count: number }>;
  languages: Array<{ _id: string; count: number }>;
}

class DicechoApi extends APIClient {
  constructor(opts: APIClientOptions) {
    super(opts);
  }

  module = {
    list: (params: Partial<IModListQuery> = {}) =>
      this.get<ModListApiResponse>(`/api/mod?${qs.stringify(params)}`),
    detail: (id: string) => this.get<ModRetrieveApiResponse>(`/api/mod/${id}`),
    config: () => this.get<ModFilterConfig>(`/api/mod/config`),
    // create: (data: TokenCreateData) =>
    //   this.post<TokenCreateData, ServerTransaction>('/token', data),
    // update: (typeId: string, data: TokenUpdateData) =>
    //   this.put<TokenUpdateData, Token>(`/token/${typeId}`, data),
  };
}

export type { APIClientOptions };

const options = {
  origin: process.env.NEXT_PUBLIC_API_ENDPOINT || "/",
};

export const api = new DicechoApi(options);
