import { IMessage } from "@/types";
import React from "react";
import { useStore } from "effector-react";
import {$messages } from "@/store/messages";
import { MessageSection } from "./MessagesSection";

interface IProps {
  filter: (message: IMessage) => boolean;
}

export const LoadedMessages = ({ filter }: IProps) => {
  const messages = useStore($messages)
  
  return (
    <div>
      <MessageSection
        messages={messages.filter(filter)}
      />
    </div>
  );
};
