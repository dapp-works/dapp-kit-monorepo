import { _ } from "../lib/lodash";
import defaultTheme from "./default.json";
import primaryTheme from "./primary.json";

export type ThemeType = "default" | "primary";

export const getStyle = (theme: ThemeType, key: string) => {
  switch (theme) {
    case "default":
      return _.get(defaultTheme, key);
    case "primary":
      return _.get(primaryTheme, key);
  }
};
