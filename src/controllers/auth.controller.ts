import { AuthValidations } from "../models/Auth/Auth.validations";
import { AuthService } from "../services/Auth";
import catchAsync from "../utils/catch";
import { removeCookie, setCookie } from "../utils/jwt";
import { validate } from "../utils/validate";

const login = catchAsync(async (req, res) => {
  const { body } = await validate(AuthValidations.login, req);
  const user = await AuthService.login(body.email, body.password);
  setCookie(user, res);
  res.send({ user });
});

const logout = catchAsync(async (req, res) => {
  removeCookie(res);
  res.send({ message: "Logout successfull" });
});

export const AuthController = {
  login,
  logout,
};
