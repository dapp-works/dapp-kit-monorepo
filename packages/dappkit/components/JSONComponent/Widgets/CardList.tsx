import React from "react";
import { JSONDataType } from "..";
import CardWidget from "./Card";

const CardListWidget = <T extends Record<string, any>>({ jsondata }: { jsondata: JSONDataType<T> }) => {
  if (Array.isArray(jsondata)) {
    const firstData = jsondata[0];
    if (firstData && firstData.constructor === Object) {
      return (
        <div className="space-y-2">
          {jsondata.map((item, index) => {
            return (
              <CardWidget jsondata={item} key={index} />
            )
          })}
        </div>
      )
    }
  }
  return (
    <CardWidget jsondata={jsondata} />
  );
}

export default CardListWidget;