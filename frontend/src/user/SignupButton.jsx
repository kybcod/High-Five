import React, { useEffect, useState } from "react";
import { Checkbox, Stack } from "@chakra-ui/react";

function SignupButton(props) {
  const [checkedItems, setCheckedItems] = React.useState([false, false]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  useEffect(() => {
    console.log(isAllChecked);
  }, [checkedItems[0], checkedItems[1]]);

  // const allChecked = checkedItems.every(Boolean);

  // "전체 동의" 체크박스 변경을 처리하는 함수
  function handleAllCheckedChange(e) {
    const checked = e.target.checked;
    setCheckedItems([checked, checked]);
    setIsAllChecked(checked);
  }

  // 개별 체크박스 변경을 처리하는 함수
  function handleCheckboxChange(index, isChecked) {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = isChecked;
    setCheckedItems(newCheckedItems);
  }

  return (
    <>
      <Stack mt={1} spacing={1} mt={9}>
        <Checkbox
          height={"50px"}
          size="md"
          isChecked={isAllChecked}
          onChange={handleAllCheckedChange}
          border={"1px"}
          borderColor={"gray.300"}
          color={"black"}
          borderRadius="5px"
        >
          전체동의
        </Checkbox>
        <Checkbox
          size="sm"
          isChecked={checkedItems[0]}
          onChange={(e) => handleCheckboxChange(0, e.target.checked)}
        >
          이용약관 동의 (필수)
        </Checkbox>
        <Checkbox
          size="sm"
          isChecked={checkedItems[1]}
          onChange={(e) => handleCheckboxChange(1, e.target.checked)}
        >
          개인정보 수집 이용 방침 (필수)
        </Checkbox>
      </Stack>
    </>
  );
}

export default SignupButton;