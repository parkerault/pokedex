import * as HTTP from "temp-rest-client";
import { Validator } from "entities/decoders/Decoders";

export const apiClient = new HTTP.RestClient(
  "Pokedex",
  process.env.RAZZLE_API_ROOT
);

export const localClient = new HTTP.RestClient(
  "Local",
  process.env.RAZZLE_CLIENT_ROOT
);

export interface IRestResponse<T> extends HTTP.IRestResponse<T> {}

export function responseDecoder<T>(decoder: Validator<T>) {
  return (response: HTTP.IRestResponse<T>) => decoder.decode(response.result);
}

export function isRestResponseError(error: Error): error is IRestResponseError {
  return error.hasOwnProperty("statusCode");
}

interface IRestResponseError extends Error {
  statusCode: number;
  result: any;
}
