import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import "./Todo.css";
import { SEND_MAIN_PING, SEND_WEB_PING } from "../constants";

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
`;
const Menu = styled.div`
  margin: auto;
  border: 1px solid white;
  width: 50vw;
  height: 70vh;
  display: flex;
  flex-direction: column;
`;
const Make = styled.div`
  margin-top: 50px;
`;
const Show = styled.div`
  margin-top: 50px;
  overflow: overlay;
`;

const TodoBox = styled.div`
  height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
const TodoText = styled.div`
  min-width: 20vw;
`;

const Error = styled.div`
  color: red;
  height: 10px;
`;

const TodoInput = styled.input`
  border: 1px solid black;

  &:focus-visible {
    outline: 2px solid red;
  }
`;
const Button = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  margin-left: 10px;
`;

interface Todo {
  id: number;
  title: string;
  done: boolean;
  top: boolean;
}

const Todo = () => {
  const { ipcRenderer } = window.require("electron");
  const sendMessage = (chat_list: Todo[]) => {
    ipcRenderer.send(SEND_MAIN_PING, chat_list);
  };
  const [todo_list, setTodo_list] = useState<Todo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error_message, setError_message] = useState<string>("");
  const [max_length, setMax_length] = useState<number>(0);

  ipcRenderer.on(SEND_WEB_PING, (event: any, payload: Todo[]) => {
    setTodo_list(payload);
  });
  const imply_list = () => {
    if (inputRef.current?.value !== "") {
      if (inputRef.current?.value.trim().length !== 0) {
        new Promise((resolve) => {
          setTodo_list((prev) => [
            ...prev,
            {
              id: max_length,
              title: inputRef.current!.value,
              done: false,
              top: false,
            },
          ]);
          setMax_length((prev) => prev + 1);
          resolve("hi");
          sendMessage([
            ...todo_list,
            {
              id: max_length,
              title: inputRef.current!.value,
              done: false,
              top: false,
            },
          ]);
        }).then(() => (inputRef.current!.value = ""));
      } else {
        setError_message("You kidding me? 🤔");
        inputRef.current!.value = "";
        setTimeout(() => {
          setError_message("");
        }, 1000);
      }
    } else {
      setError_message("Nothing 🤗");
      setTimeout(() => {
        setError_message("");
      }, 1000);
    }
  };
  return (
    <Container>
      <Menu>
        <Make>
          <TodoInput
            type="text"
            ref={inputRef}
            onKeyPress={(e) => {
              if (e.code === "Enter") {
                imply_list();
              }
            }}
          />
          <Button onClick={imply_list}>✅</Button>
          <Error>{error_message}</Error>
        </Make>
        <Show>
          {[
            ...todo_list.filter((cur) => cur.done === false),
            ...todo_list.filter((cur) => cur.done === true),
          ].map((todo: Todo) => {
            return (
              <TodoBox
                key={todo.id}
                className={todo.done ? "TodoBox" : "CreateBox"}
              >
                <input
                  type="checkbox"
                  onClick={(e) =>
                    setTodo_list((prev) => [
                      ...prev.filter((cur) => cur.id !== todo.id),
                      {
                        id: todo.id,
                        done: !todo.done,
                        title: todo.title,
                        top: false,
                      },
                    ])
                  }
                />
                <TodoText
                  style={
                    todo.done
                      ? { textDecoration: "line-through", color: "#4a4a4a" }
                      : { textDecoration: "none", color: "white" }
                  }
                >
                  {todo.title}
                </TodoText>
                <Button
                  className={todo.done ? "TodoBox" : ""}
                  onClick={() =>
                    setTodo_list(todo_list.filter((cur) => cur.id !== todo.id))
                  }
                >
                  ❌
                </Button>
              </TodoBox>
            );
          })}
        </Show>
      </Menu>
    </Container>
  );
};

export default Todo;
