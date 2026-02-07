import { IUser } from "../db/schema/user.model.js";

export class CustomRequest extends Request {
  user!: IUser;
  file?: any;
  cookies: any;
}