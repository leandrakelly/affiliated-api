export function logoutAndReload(): void {
  localStorage.removeItem("token");
  window.location.reload();
}
