import * as React from "react";
import { type ScaleLinear } from "d3-scale";
import { Line, Text, vec, type SkFont } from "@shopify/react-native-skia";
import type { InputDatum } from "../types";
import type { ValueOf } from "../types";

export type GridProps<
  T extends InputDatum,
  XK extends keyof T,
  YK extends keyof T,
> = {
  font?: SkFont | null;
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  labelOffset: number;
  xTicks: number;
  yTicks: number;
  lineColor: string;
  axisColor: string;
  formatXLabel: (label: T[XK]) => string;
  formatYLabel: (label: T[YK]) => string;
};

export const Grid = <
  T extends InputDatum,
  XK extends keyof T,
  YK extends keyof T,
>({
  xScale,
  yScale,
  xTicks,
  yTicks,
  labelOffset,
  lineColor,
  font,
  axisColor,
  formatXLabel,
  formatYLabel,
}: GridProps<T, XK, YK>) => {
  const [x1, x2] = xScale.domain();
  const [y1, y2] = yScale.domain();
  const [_, x2r] = xScale.range();
  const fontSize = font?.getSize() ?? 0;

  if (
    typeof x1 === "undefined" ||
    typeof x2 === "undefined" ||
    typeof y1 === "undefined" ||
    typeof y2 === "undefined" ||
    typeof x2r === "undefined"
  )
    return null;

  return (
    <>
      {xScale.ticks(xTicks).map((tick) => {
        const contentX = formatXLabel(tick as never);
        const labelWidth = font?.getTextWidth?.(contentX) ?? 0;
        const labelX = xScale(tick) - (labelWidth ?? 0) / 2;
        return (
          <React.Fragment key={`x-tick-${tick}`}>
            <Line
              p1={vec(xScale(tick), yScale(y2))}
              p2={vec(xScale(tick), yScale(y1))}
              color={lineColor}
            />
            {font && labelWidth && labelX + labelWidth < x2r ? (
              <>
                <Text
                  text={contentX}
                  font={font}
                  y={yScale(y2) + labelOffset + fontSize}
                  x={labelX}
                />
              </>
            ) : null}
          </React.Fragment>
        );
      })}
      {yScale.ticks(yTicks).map((tick) => {
        const contentY = formatYLabel(tick as never);
        const labelWidth = font?.getTextWidth?.(contentY) ?? 0;
        const labelY = yScale(tick) + fontSize / 3;
        return (
          <React.Fragment key={`y-tick-${tick}`}>
            <Line
              p1={vec(xScale(x1), yScale(tick))}
              p2={vec(xScale(x2), yScale(tick))}
              color={lineColor}
            />
            {font
              ? labelY > fontSize && (
                  <>
                    <Text
                      text={contentY}
                      font={font}
                      y={labelY}
                      x={xScale(x1) - (labelWidth + labelOffset)}
                    />
                  </>
                )
              : null}
          </React.Fragment>
        );
      })}

      <Line
        p1={vec(xScale(x1), yScale(y2))}
        p2={vec(xScale(x2), yScale(y2))}
        strokeWidth={2}
        color={axisColor}
      />
    </>
  );
};

Grid.defaultProps = {
  labelOffset: 0,
  xTicks: 10,
  yTicks: 10,
  formatXLabel: (label: ValueOf<InputDatum>) => String(label),
  formatYLabel: (label: ValueOf<InputDatum>) => String(label),
  labelBackgroundColor: "hsla(0, 0%, 100%, 0.9)",
  lineColor: "hsla(0, 0%, 0%, 0.25)",
  axisColor: "black",
};
