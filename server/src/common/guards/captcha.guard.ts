import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import axios from "axios";
import qs from "qs";
import FormData from "form-data";

@Injectable()
export class CaptchaGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { hCaptchaResponse } = request.body;
    
    const form = new FormData();
    form.append("response", hCaptchaResponse);
    form.append("secret", process.env.HCAPTCHA_SECRET_KEY);

    const response = await axios.post("https://hcaptcha.com/siteverify", form, {
      headers: form.getHeaders(),
    });

    return response.data.success;
  }
}
