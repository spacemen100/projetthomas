import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import GlobalContext from "../context/GlobalContext";
import { getMonth } from "../util";
import { Box, Text, Flex, Button, Grid, GridItem } from "@chakra-ui/react";

export default function SmallCalendar() {
  const [currentMonthIdx, setCurrentMonthIdx] = useState(dayjs().month());
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  
  useEffect(() => {
    setCurrentMonth(getMonth(currentMonthIdx));
  }, [currentMonthIdx]);

  const { monthIndex, setSmallCalendarMonth, setDaySelected, daySelected } = useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonthIdx(monthIndex);
  }, [monthIndex]);

  function handlePrevMonth() {
    setCurrentMonthIdx(currentMonthIdx - 1);
  }

  function handleNextMonth() {
    setCurrentMonthIdx(currentMonthIdx + 1);
  }

  function getDayClass(day) {
    const format = "DD-MM-YY";
    const nowDay = dayjs().format(format);
    const currDay = day.format(format);
    const slcDay = daySelected && daySelected.format(format);
    if (nowDay === currDay) {
      return { bg: "blue.500", color: "white", borderRadius: "full" };
    } else if (currDay === slcDay) {
      return { bg: "blue.100", color: "blue.600", fontWeight: "bold", borderRadius: "full" };
    } else {
      return {};
    }
  }

  return (
    <Box p={2} m={2} border="1px" borderRadius="10px" borderColor="gray.200">
      <Flex justifyContent="between">
        <Text color="gray.500" fontWeight="bold">
          {dayjs(new Date(dayjs().year(), currentMonthIdx)).format("MMMM YYYY")}
        </Text>
        <Box m={2}>
          <Button onClick={handlePrevMonth}>
            <MdChevronLeft className="cursor-pointer text-gray-600 mx-2" />
          </Button>
          <Button onClick={handleNextMonth}>
            <MdChevronRight className="cursor-pointer text-gray-600 mx-2" />
          </Button>
        </Box>
      </Flex>
      <Grid templateColumns="repeat(7, 1fr)" templateRows="repeat(6, 1fr)">
        {currentMonth[0].map((day, i) => (
          <GridItem key={i} textAlign="center">
            <Text fontSize="sm" py={1}>{day.format("dd").charAt(0)}</Text>
          </GridItem>
        ))}
        {currentMonth.map((row, i) => (
          <React.Fragment key={i}>
            {row.map((day, idx) => (
              <Button
                key={idx}
                onClick={() => {
                  setSmallCalendarMonth(currentMonthIdx);
                  setDaySelected(day);
                }}
                {...getDayClass(day)}
                w="full"
                py={1}
              >
                <Text fontSize="sm">{day.format("D")}</Text>
              </Button>
            ))}
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  );
}
