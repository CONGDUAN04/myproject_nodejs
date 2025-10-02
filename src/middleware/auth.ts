import e, { NextFunction } from "express";
import { Request, Response } from "express";

const isLogin = (req: Request, res: Response, next: NextFunction) => {
  const isAuthenticated = req.isAuthenticated();
  if (isAuthenticated) {
    res.redirect("/"); // Redirect to home page if already logged in
  } else {
    next(); // Proceed to the next middleware or route handler
  }
};
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as any;
  if (user?.role?.name === "ADMIN") {
    res.redirect("/admin");
  } else {
    res.redirect("/");
  }
};

export { isLogin, isAdmin };
