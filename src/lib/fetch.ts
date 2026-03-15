import ky from "ky";

export const fetcher = <T>(url: string): Promise<T> =>
  ky.get(url).json<T>();
