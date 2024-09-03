import {
  CSSProperties,
  FC,
  ReactNode,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import useStore from "./useStore";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import "./index.scss";
import { createPortal } from "react-dom";
import { useTimer } from "./useTimer";

export type Position = "top" | "bottom";

export interface MessageProps {
  style?: CSSProperties;
  className?: string | string[];
  content: ReactNode | string;
  duration?: number;
  onClose?: (...args: any) => void;
  id?: number;
  position?: Position;
}

const MessageItem: FC<MessageProps> = (item) => {
  const { onMouseEnter, onMouseLeave } = useTimer({
    id: item.id!,
    duration: item.duration,
    remove: item.onClose!,
  });

  return (
    <div
      className="message-item"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {item.content}
    </div>
  );
};

export interface MessageRef {
  add: (messageProps: MessageProps) => number;
  remove: (id: number) => void;
  update: (id: number, messageProps: MessageProps) => void;
  clearAll: () => void;
}

export const MessageProvider = forwardRef<MessageRef, {}>((props, ref) => {
  const { messageList, add, update, remove, clearAll } = useStore("top");

  // useEffect(() => {
  //   setInterval(() => {
  //     add({
  //       content: Math.random().toString().slice(2, 8),
  //     });
  //   }, 2000);
  // }, []);
  if ("current" in ref!) {
    ref.current = {
      add,
      update,
      remove,
      clearAll,
    };
  }

  // useImperativeHandle(ref, () => {
  //   return {
  //     add,
  //     update,
  //     remove,
  //     clearAll,
  //   };
  // });

  const position = Object.keys(messageList) as Position[];
  const messageWrapper = (
    <div className="message-wrapper">
      {position.map((direction) => {
        return (
          <>
            <TransitionGroup
              className={`message-wrapper-${direction}`}
              key={direction}
            >
              {messageList[direction].map((item) => {
                return (
                  <CSSTransition
                    key={item.id}
                    timeout={1000}
                    classNames="message"
                  >
                    {/* <div className="message-item">{item.content}</div> */}
                    <MessageItem onClose={remove} {...item}></MessageItem>
                  </CSSTransition>
                );
              })}
            </TransitionGroup>
          </>
        );
      })}
    </div>
  );
  const el = useMemo(() => {
    const el = document.createElement("div");
    el.className = `wrapper`;

    document.body.appendChild(el);
    return el;
  }, []);

  return createPortal(messageWrapper, el);
});
