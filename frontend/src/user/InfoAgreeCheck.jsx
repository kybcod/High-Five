import React, { useEffect, useState } from "react";
import { Checkbox, Stack } from "@chakra-ui/react";

function InfoAgreeCheck({ isAllChecked, setIsAllChecked }) {
  const [checkedItems, setCheckedItems] = useState([false, false]);

  useEffect(() => {
    const allChecked = checkedItems.every(Boolean);
    setIsAllChecked(allChecked);
  }, [checkedItems]);

  const handleAllCheckedChange = (e) => {
    const checked = e.target.checked;
    setCheckedItems([checked, checked]);
    setIsAllChecked(checked);
  };

  const handleCheckboxChange = (index, isChecked) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = isChecked;
    setCheckedItems(newCheckedItems);
  };

  return (
    <>
      <Stack mt={10} spacing={1}>
        <Checkbox
          iconSize={"0.5rem"}
          pl={4}
          height={"50px"}
          size="sm"
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
          pl={4}
          size="sm"
          isChecked={checkedItems[0]}
          onChange={(e) => handleCheckboxChange(0, e.target.checked)}
        >
          이용약관 동의 (필수)
        </Checkbox>
        <Checkbox
          pl={4}
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

export default InfoAgreeCheck;
