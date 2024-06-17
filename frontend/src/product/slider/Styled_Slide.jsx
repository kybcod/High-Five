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
    align-items: center; /* 추가: 이미지가 가운데 정렬되도록 */
  }

  .slick-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    width: 100%;
    object-fit: contain;
  }
`;
