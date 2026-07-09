const KEY = 'wf_token';

export const tokenHelper = {
  get(): string | null {
    return sessionStorage.getItem(KEY);
  },
  set(token: string): void {
    sessionStorage.setItem(KEY, token);
  },
  remove(): void {
    sessionStorage.removeItem(KEY);
  },
};
