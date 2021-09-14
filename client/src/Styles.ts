import { css } from "styled-components";

const Styles = {
  Colors: {
    White: "#FFFFFF",
    Black: "#000000",
    LightGray: "#F2F4F4",
    MediumGray: "#A5A5A5",
    DarkGray: "#6F6F6F",
    Orange: "#F76902",
    Red: "#DA291C",
  },
  Shadows: {
    Inset: css`
      box-shadow: inset 1px 2px 0 rgba(0, 0, 0, 0.25);
    `,
    SmallOutset: css`
      filter: drop-shadow(2px 2px 0px rgba(0, 0, 0, 0.15));
    `,
  },
};

export default Styles;
