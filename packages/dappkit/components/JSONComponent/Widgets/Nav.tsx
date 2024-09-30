import React from "react";
import { JSONDataType } from "..";

const NavWidget = <T extends Record<string, any>>({ jsondata }: { jsondata: JSONDataType<T> }) => {
  return (
    <div>
      <h1>Nav</h1>
    </div>
  );
}

export default NavWidget;