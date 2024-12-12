
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    console.log("User role from req.user:", req.user?.role); // التأكد من أن الدور موجود
    console.log("Allowed roles:", allowedRoles); // التأكد من الأدوار المسموح بها

    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission.",
      });
    }
    next();
  };
};

export default roleMiddleware;
