import React from "react";
import Page from "../../Page";
import { Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface SwipePageState {
  buffer: string;
  swipes: string[];
}

export default class SwipePage extends React.Component<any,SwipePageState> {

  constructor(props: any) {
    super(props);
    this.state = { buffer: "", swipes: [] };
    this.handleID = this.handleID.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keypress", (event) => {
      // Add a key to the buffer.
      let key = event.key;
      console.log("key");
      console.log(this.state.buffer);
      this.setState((prevState) => (
        {
          buffer: (prevState.buffer + key).substring(prevState.buffer.length - 15),
          swipes: prevState.swipes
        }
      ));
      this.handleID();
    }, false);
  }

  handleID() {
    console.log("handled");
    console.log(this.state.swipes);
    // Handle the id if the buffer is valid.
    if (this.state.buffer.length != 16) return;
    if (this.state.buffer[0] != ";") return;
    if (this.state.buffer[10] != "=") return;
    if (this.state.buffer[15] != "?") return;
    let matches = this.state.buffer.match(/(\d+)/);
    if (matches != null && matches?.length) {
      const uid = matches[0];
      this.setState((prevState) => {
        console.log(prevState);
        return {
          buffer: prevState.buffer,
          swipes: [...prevState.swipes, uid]
        };
      });
    }
  }

  render() {
    return (
      <Page title="Swipe In">
        <Stack direction="column" flexWrap="wrap">
          {
            this.state.swipes.map((swipe, index) => {
              return (
                <Typography key={index}>{swipe}</Typography>
              )
            })
          }
        </Stack>
        </Page>
    );
  }
}

function SwipePageFunctional() {
  const navigate = useNavigate();
  let buffer = "";
  const [swipes, setSwipes] = useState<string[]>([]);

  const handleID = (uid: string) => {
    console.log("handled");
    console.log(swipes);
    setSwipes(swipes.concat([uid]));
  }

  useEffect(() => {
    document.addEventListener("keypress", (event) => {
      // Add a key to the buffer.
      let key = event.key;
      buffer += key;
      // console.log(buffer);
      if (buffer.length) {
          buffer = buffer.substring(buffer.length - 16);
      }
    }, false);
  }, []);

  useEffect(
    () => {
        // Handle the id if the buffer is valid.
        if (buffer.length != 16) return;
        if (buffer[0] != ";") return;
        if (buffer[10] != "=") return;
        if (buffer[15] != "?") return;
        let matches = buffer.match(/(\d+)/);
        if (matches?.length) {
          handleID(matches[0]);
        }
  }, [swipes]);

  console.log("render");
  console.log(swipes);

  return (
    <Page title="Swipe In">
      <Stack direction="row" flexWrap="wrap">
        {
          swipes.map((swipe, index) => {
            return (
              <Typography key={index}>{swipe}</Typography>
            )
          })
        }
      </Stack>
      </Page>
  );
}
