const AUTH_KEY = "admin-demo-auth";

export function useAuth() {
  const authenticated = useState("admin-demo-auth", () => false);
  const hydrated = useState("admin-demo-auth-hydrated", () => false);

  function hydrate() {
    if (!import.meta.client || hydrated.value) return;
    authenticated.value = localStorage.getItem(AUTH_KEY) === "true" || sessionStorage.getItem(AUTH_KEY) === "true";
    hydrated.value = true;
  }

  async function login(username: string, password: string, remember: boolean) {
    await new Promise((resolve) => setTimeout(resolve, process.env.NODE_ENV === "test" ? 0 : 500));
    if (username !== "admin" || password !== "meteor") return false;
    authenticated.value = true;
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(AUTH_KEY, "true");
    (remember ? sessionStorage : localStorage).removeItem(AUTH_KEY);
    return true;
  }

  function logout() {
    authenticated.value = false;
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
  }

  return { authenticated, hydrate, login, logout };
}
