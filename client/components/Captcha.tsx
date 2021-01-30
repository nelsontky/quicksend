import React from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export type CaptchaProps = {
  onVerify: (token: string) => any;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export default function Captcha(props: CaptchaProps) {
  const { onVerify, ...rest } = props;

  return <div {...rest}>
    <HCaptcha
      onVerify={onVerify}
      sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
    />
  </div>;
}
