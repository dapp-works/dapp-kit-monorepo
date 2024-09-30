import React from "react";
import { JSONDataType } from "..";

const CardWidget = <T extends Record<string, any>>({ jsondata }: { jsondata: JSONDataType<T> }) => {
  const keys = Object.keys(jsondata);
  return (
    <div className="p-2 shadow-sm rounded-lg border dark:border-[#3e3e3e] space-y-2">
      {keys.map(key => {
        return (
          <div className="flex items-center justify-between" key={key}>
            <div>
              {key}
            </div>
            <div>
              {jsondata[key]}
            </div>
          </div>
        )
      })}
    </div>
  );
}

export default CardWidget;