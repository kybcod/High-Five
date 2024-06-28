export function CategorySwitchCase({ categoryName }) {
  let translatedName = "";

  switch (categoryName) {
    case "":
      translatedName = "전체";
      break;
    case "clothes":
      translatedName = "의류";
      break;
    case "goods":
      translatedName = "잡화";
      break;
    case "food":
      translatedName = "식품";
      break;
    case "digital":
      translatedName = "디지털";
      break;
    case "sport":
      translatedName = "스포츠";
      break;
    case "e-coupon":
      translatedName = "e-쿠폰";
      break;
    default:
      translatedName = categoryName;
  }

  return translatedName;
}
