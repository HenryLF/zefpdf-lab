import { createCanvas } from "@napi-rs/canvas";
import type { ChartConfiguration } from "chart.js";
import { Chart as ChartJS } from "chart.js/auto";
import type { ComponentProps } from "./utils";

export interface ChartProps extends ComponentProps {
  config: ChartConfiguration;
  width?: number;
  height?: number;
}

export const ChartObj = ChartJS;

export function Chart({
  config,
  width = 800,
  height = 500,
  ...props
}: ChartProps) {
  const canvas = createCanvas(width, height);

  const chart = new ChartJS(canvas as unknown as HTMLCanvasElement, {
    ...config,
    options: {
      ...config.options,
      animation: false,
      responsive: false,
    },
  });

  const dataUrl = `data:image/png;base64,${canvas.toBuffer("image/png").toString("base64")}`;
  chart.destroy();

  return <img src={dataUrl} width={width} height={height} {...props} />;
}
