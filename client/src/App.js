import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import io from "socket.io-client";
import Image from "./Image";
import styles from "./App.css";

const Page = styled.div`
  display: flex;
  height: 97vh;
  width: 100%;
  align-items: center;
  background-color: #1a202c;
  flex-direction: column;
  @import url("https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap");
`;

const Heading = styled.h1`
  margin-top: 0px;
  color: white;
  font-family: "Roboto";
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  width: 400px;
  border: 2px solid #ffb200;
  border-radius: 10px;
  padding-bottom: 10px;
`;

const TextArea = styled.textarea`
  width: 97%;
  height: 100px;
  margin-top: 10px;
  padding-left: 10px;
  padding-top: 10px;
  font-size: 17px;
  background-color: transparent;
  border: 2px solid #ffb200;
  border-radius: 0.5rem;
  outline: none;
  color: white;
  letter-spacing: 1px;
  line-height: 20px;
  ::placeholder {
    color: lightgray;
  }
  font-family: "Roboto";
`;

const Button = styled.button`
  background-color: #66b8e1;
  width: 100%;
  border: none;
  height: 50px;
  border-radius: 10px;
  color: black;
  font-size: 17px;
`;

const Form = styled.form`
  width: 400px;
`;

const MyRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const MyMessage = styled.div`
  width: 45%;
  background-color: #67b9e1;
  color: black;
  border: 0.1rem solid #66b8e1;
  border-radius: 0.5rem;

  padding: 10px;
  margin-right: 10px;
  font-family: "Roboto";
  display: flex;
  justify-content: flex-end;
`;

const PartnerRow = styled(MyRow)`
  justify-content: flex-start;
`;

const PartnerMessage = styled.div`
  width: 45%;
  background-color: #ffb200;
  border: 0.1rem solid #ffb200;
  border-radius: 0.5rem;
  color: black;
  padding: 10px;
  margin-left: 10px;
  font-family: "Roboto";
`;

const App = () => {
  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState();

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect("/");

    socketRef.current.on("your id", (id) => {
      setYourID(id);
    });

    socketRef.current.on("message", (message) => {
      console.log("here");
      receivedMessage(message);
    });
  }, []);

  function receivedMessage(message) {
    setMessages((oldMsgs) => [...oldMsgs, message]);
  }

  function sendMessage(e) {
    e.preventDefault();
    if (file) {
      const messageObject = {
        id: yourID,
        type: "file",
        body: file,
        mimeType: file.type,
        fileName: file.name,
      };
      setMessage("");
      setFile();
      socketRef.current.emit("send message", messageObject);
    } else {
      const messageObject = {
        body: message,
        id: yourID,
      };
      setMessage("");
      socketRef.current.emit("send message", messageObject);
    }
  }

  function handleChange(e) {
    setMessage(e.target.value);
  }

  function selectFile(e) {
    setMessage(e.target.files[0].name);
    setFile(e.target.files[0]);
  }

  function renderMessages(message, index) {
    if (message.type === "file") {
      const blob = new Blob([message.body], { type: message.type });
      if (message.id === yourID) {
        return (
          <MyRow key={index}>
            <Image fileName={message.fileName} blob={blob} />
          </MyRow>
        );
      }
      return (
        <PartnerRow key={index}>
          <Image fileName={message.fileName} blob={blob} />
        </PartnerRow>
      );
    } else {
      if (message.id === yourID) {
        return (
          <MyRow key={index}>
            <MyMessage>{message?.body}</MyMessage>
          </MyRow>
        );
      }
      return (
        <PartnerRow key={index}>
          <PartnerMessage>{message.body}</PartnerMessage>
        </PartnerRow>
      );
    }
  }

  return (
    <Page>
      <Heading>🌌 Space Chat</Heading>
      <Container>{messages.map(renderMessages)}</Container>
      <Form onSubmit={sendMessage}>
        <TextArea
          required
          value={message}
          onChange={handleChange}
          placeholder="Say something..."
        />
        <input onChange={selectFile} type="file" />
        <Button className={styles.input}>Send</Button>
      </Form>
    </Page>
  );
};

export default App;
