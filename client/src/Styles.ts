import { css } from "styled-components";

const styles = {
  colors: {
    white: "#FFFFFF",
    black: "#000000",
    lightGray: "#F2F4F4",
    darkGray: "#A5A5A5",
  },
  shadows: {
    inset: css`
      box-shadow: inset 1px 2px 0 rgba(0, 0, 0, 0.25);
    `,
    smallOutset: css`
      filter: drop-shadow(2px 2px 0px rgba(0, 0, 0, 0.15));
    `,
  },
};

export default styles;
