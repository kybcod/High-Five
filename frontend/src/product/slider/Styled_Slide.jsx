import styled from "@emotion/styled";
import Slider from "react-slick";

export const Styled_Slide = styled(Slider)`
  .slick-list {
    width: 100%;
    height: 300px;
    margin: 0 auto;
    overflow: hidden;
  }

  .slick-track {
    display: flex;
  }

  .slick-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    width: 100%;
    object-fit: contain;
  }

  .slick-prev:before,
  .slick-next:before {
    font-size: 40px;
    line-height: 1;
    opacity: 0.75;
    color: #ffffff;
    -webkit-font-smoothing: antialiased;
  }
`;
