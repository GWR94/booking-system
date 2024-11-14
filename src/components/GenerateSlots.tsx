import React, { useState, useEffect } from "react";
import Slot, { iSlot } from "./Slot";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import { Container, Typography } from "@mui/material";

interface GenerateSlotProps {
  selectedDate: Dayjs;
  session: 1 | 2 | 3 | 4;
}

const GenerateSlots = ({ selectedDate, session }: GenerateSlotProps) => {
  // Helper function to check if two slots are consecutive
  const isConsecutive = (slot1: iSlot, slot2: iSlot) => {
    const end1 = dayjs(slot1.endTime);
    const start2 = dayjs(slot2.startTime);
    return end1.isSame(start2);
  };

  const [slots, setSlots] = useState<iSlot[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    console.log("selectedDate");
    // Fetch available slots for the selected date (current date as default)
    const getAvailableSlots = async (from?: Date) => {
      // console.log(selectedDate);
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_API}/api/slots`,
        {
          params: {
            from: dayjs(selectedDate).startOf("day").toDate(),
            to: dayjs(selectedDate).endOf("day").toDate(),
          },
        }
      );

      const updatedSlots = getAllSlotTimes(data);

      console.log(updatedSlots);

      setSlots(updatedSlots);
      setLoading(false);
    };
    getAvailableSlots();
  }, [selectedDate]);

  const handleBooking = () => {
    console.log("coo");
  };

  const getAllSlotTimes = (slots: iSlot[]) => {
    const updatedSlots = slots.reduce((acc, slot, index) => {
      const nextSlot1 = slots[index + 1]; // Next slot
      const nextSlot2 = slots[index + 2]; // Slot after next

      // Always push the 1-hour duration for each slot
      acc.push({
        ...slot,
        endTime: slot.endTime,
        slots: [slot.id],
      });

      // Add 2-hour duration if the next slot is consecutive
      if (nextSlot1 && isConsecutive(slot, nextSlot1)) {
        acc.push({
          ...slot,
          endTime: nextSlot1.endTime,
          slots: [slot.id, nextSlot1.id],
        });
      }

      // Add 3-hour duration if two consecutive slots are available
      if (
        nextSlot1 &&
        nextSlot2 &&
        isConsecutive(slot, nextSlot1) &&
        isConsecutive(nextSlot1, nextSlot2)
      ) {
        acc.push({
          ...slot,
          endTime: nextSlot2.endTime,
          slots: [slot.id, nextSlot1.id, nextSlot2.id],
        });
      }
      return acc;
    }, [] as iSlot[]);
    return updatedSlots;
  };

  return (
    <Container>
      {slots.length}
      <Typography>Available Slots</Typography>
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <div>
          {slots
            .filter((slot) =>
              session !== 4 ? slot.slots.length === session : slot
            )
            .map((slot, i) => (
              <Slot key={i} slot={slot} handleBooking={handleBooking} />
            ))}
        </div>
      )}
    </Container>
  );
};

export default GenerateSlots;
