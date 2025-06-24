import { _ } from "../lib/lodash";
import defaultTheme from "./default.json";
import primaryTheme from "./primary.json";

export type ThemeType = "default" | "primary";
export type StyleKeyType = keyof typeof defaultTheme;

// Define the return type for style objects
export type StyleObject = {
  classNames?: Record<string, string>;
  dateInputClassNames?: Record<string, string>;
  className?: string;
  [key: string]: any;
};

export const getStyle = (theme: ThemeType, key: StyleKeyType): StyleObject => {
  switch (theme) {
    case "default":
      return _.get(defaultTheme, key) || {};
    case "primary":
      return _.get(primaryTheme, key) || {};
    default:
      return {};
  }
};
