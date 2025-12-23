declare module "qrcode.react" {
  import * as React from "react";
  export interface QRCodeProps {
    value: string;
    size?: number;
  }
  export const QRCodeSVG: React.ComponentType<QRCodeProps>;
  export const QRCodeCanvas: React.ComponentType<QRCodeProps>;
}

declare module "moment" {
  import moment from "moment";
  export = moment;
}

declare module "js-cookie" {
  const Cookies: any;
  export default Cookies;
}
