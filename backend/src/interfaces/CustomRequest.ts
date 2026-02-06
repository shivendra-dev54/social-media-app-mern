import { IUser } from "../db/schema/user.model";

export class CustomRequest extends Request {
  user: IUser;
  file?;
  cookies;
}