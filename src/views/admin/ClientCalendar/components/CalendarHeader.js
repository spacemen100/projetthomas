import React, { useContext } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FcCalendar } from "react-icons/fc";
import dayjs from "dayjs";
import 'dayjs/locale/fr';
import GlobalContext from "../context/GlobalContext";
import { Flex, Button, Text, Icon } from "@chakra-ui/react";

export default function CalendarHeader() {
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);
  dayjs.locale('fr');

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }

  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  function handleReset() {
    setMonthIndex(
      monthIndex === dayjs().month() ? monthIndex + Math.random() : dayjs().month()
    );
  }

  return (
    <Flex
      alignItems="center"
      p={1}
      flexWrap={["wrap", "nowrap"]} // Wrap on small screens, no wrap on larger screens
    >
      <Icon as={FcCalendar} w={12} h={12} mr={2} />
      <Text mr={10} fontSize="xl" color="gray.500" fontWeight="bold">
        Calendrier
      </Text>
      <Button onClick={handleReset} borderRadius="md" py={2} px={4} mr={5}>
        Aujourd'hui
      </Button>
      <Button onClick={handlePrevMonth}>
        <MdChevronLeft className="cursor-pointer text-gray-600" />
      </Button>
      <Button onClick={handleNextMonth}>
        <MdChevronRight className="cursor-pointer text-gray-600" />
      </Button>
      <Text
        ml={[0, 4]} // Adjust left margin based on screen size
        fontSize="xl"
        color="gray.500"
        fontWeight="bold"
        flexBasis={["100%", "auto"]} // Full width (i.e., new line) on small screens, auto width on larger screens
      >
        {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
      </Text>
    </Flex>
  );
}
