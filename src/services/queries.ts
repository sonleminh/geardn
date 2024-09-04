import useSWR from "swr";

export function useSignUp() {
    return useSWR<any>("/auth/signup");
  }

export function useGetFake() {
    return useSWR<any>("https://jsonplaceholder.typicode.com/posts/1");
}