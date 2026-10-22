import type { ComponentProps } from "./utils";
import {encodeQR} from "qr"
export interface QrCodeProps extends ComponentProps {
  href:string;
  size?: number;
}

export function QrCode({ size = 200,href,...props }: QrCodeProps) {
  const dataURL = encodeQR(href, 'data-url' , {scale : 4}); 
  return <img src={dataURL} height={size} width={size} {...props}/>

}
