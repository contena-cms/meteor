export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return;
  const { authenticated, hydrate } = useAuth();
  hydrate();
  if (to.path !== "/login" && !authenticated.value) return navigateTo("/login");
  if (to.path === "/login" && authenticated.value) return navigateTo("/dashboard");
});
