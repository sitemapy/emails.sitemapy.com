import { Hr, Button, Text, Heading } from "@react-email/components";
import clsx from "clsx";
import React from "react";
import type { CampaignContent } from "../../types/CampaignType";

export const Pricing: React.FC<
  Extract<CampaignContent, { type: "pricing" }>
> = (props) => {
  return (
    <div className="">
      <Hr className="mt-8" />
      <Heading className={clsx("text-pink-500 mt-6 text-sm font-bold")}>
        {props.name}
      </Heading>
      <Text className="mt-0 font-bold">
        <span className="text-4xl text-slate-900">{props.price}</span>

        {props.before_price && (
          <span className="text-slate-400 text-lg  pl-1 line-through">
            {props.before_price}
          </span>
        )}

        <span className="pl-1 text-lg text-slate-400">/</span>
        <span className="pl-1 text-lg text-slate-400">{props.interval}</span>
      </Text>
      <Button
        href={props.button.href}
        className={clsx(
          "text-white bg-slate-900 w-full p-2 rounded text-center font-semibold py-4"
        )}
      >
        {props.button.label}
      </Button>
      <div className="mt-4">
        {props.features.map((feature) => (
          <div key={feature} className="flex mt-1">
            <span className="text-pink-500 mr-2">✓</span>
            <span className="text-sm font-semibold">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
