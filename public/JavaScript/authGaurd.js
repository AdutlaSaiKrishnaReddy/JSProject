function authGuard(requiredRole = null) {
  const authUser = JSON.parse(localStorage.getItem("authUser"));

  // Not logged in
  if (!authUser || !authUser.isAuthenticated) {
    window.location.href = "login.html";
    return false;
  }

  // If page requires ADMIN but user is not admin
  if (requiredRole === "ADMIN" && authUser.role !== "ADMIN") {
    alert("Access Denied! Admins only.");
    window.location.href = "index.html";
    return false;
  }

  return true;
}
