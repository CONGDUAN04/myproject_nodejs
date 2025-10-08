import e, { NextFunction } from "express";
import { Request, Response } from "express";
const isLogin = (req: Request, res: Response, next: NextFunction) => {
  const isAuthenticated = req.isAuthenticated();
  if (isAuthenticated) {
    res.redirect("/"); // Redirect to home page if already logged in
    return;
  } else {
    next(); // Proceed to the next middleware or route handler
  }
};
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith("/admin")) {
    const user = req.user;
    if (user?.role?.name === "ADMIN") {
      next(); // Proceed to the next middleware or route handler
    } else res.render("status/403.ejs");
    return;
  }
  next(); // Proceed to the next middleware or route handler
};

export { isLogin, isAdmin };
