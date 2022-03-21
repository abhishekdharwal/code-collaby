import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import codemirror from "codemirror";
import ACTIONS from "../Actions";
const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  useEffect(() => {
    async function init() {
      // this is used to initiate the codemirror in the code text area  , we can have multiple properties
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );
      // this is used to catch the value of the changes made in the codeEditor , origin basically give us the state of the code
      // like paste input cut etc...
      // instance give the value of code change in the editor
      // getVlaue is a getter setValue is a setter
      // editorRef is a instance of codeMirror we can get and change value in editor
      editorRef.current.on("change", (instance, changes) => {
        // console.log(changes);
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code });
        }
      });
    }
    init();
  }, []);
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        // console.log("receiveing");
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);
  return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;
