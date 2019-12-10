import {
  Body,
  BadRequestError,
  JsonController,
  Post
} from "routing-controllers";
import User from "../users/entity";
import { IsString } from "class-validator";
import { sign } from "../jwt";

// src/logins/controller.ts
class AuthenticatePayload {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

@JsonController()
export default class LoginController {
  @Post("/logins")
  async authenticate(@Body() { email, password }: AuthenticatePayload) {
    // if user exists
    const user = await User.findOne({ where: { email } });
    if (!user)
      throw new BadRequestError("A user with this email does not exist");
    // if password is correct
    if (!(await user.checkPassword(password)))
      throw new BadRequestError("The password is not correct");
    // send back a jwt token
    const jwt = sign({ id: user.id! });
    return { jwt };
    // else: send some HTTP 400 Bad request error
  }
}
