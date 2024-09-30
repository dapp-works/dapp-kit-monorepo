import React from "react";
import Card from "./Widgets/Card";
import CardList from "./Widgets/CardList";
import Nav from "./Widgets/Nav";

const COMPONENTS = {
  Card,
  CardList,
  Nav,
};

export type JSONDataType<T extends Record<string, any>> = Array<T> | T;

export interface JSONComponentProps<T extends Record<string, any>> {
  className?: string;
  jsondata: JSONDataType<T>;
  type?: keyof typeof COMPONENTS;
}

export const JSONComponent = <T extends Record<string, any>>({ className, jsondata, type }: JSONComponentProps<T>) => {
  const _type = type || (Array.isArray(jsondata) ? 'CardList' : 'Card');
  const Comp = COMPONENTS[_type];
  return (
    <div className={className}>
      <Comp jsondata={jsondata} />
    </div>
  );
}
