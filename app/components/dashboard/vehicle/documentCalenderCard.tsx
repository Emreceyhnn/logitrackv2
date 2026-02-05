"use client";

import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import type { PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { Badge, Divider, Tooltip, Typography } from "@mui/material";
import CustomCard from "../../cards/card";
import { getExpiringDocuments } from "@/app/lib/analyticsUtils";

const values = getExpiringDocuments();

const DocumentDay = (props: PickersDayProps) => {
  const { day, ...other } = props;

  const docsForDay = values.filter((d) =>
    dayjs(d.expiresOn).isSame(day, "day")
  );

  if (docsForDay.length === 0) {
    return <PickersDay day={day} {...other} />;
  }

  return (
    <Tooltip
      title={docsForDay
        .map((d) => {
          return `${d.type} - ${d.plate}`;
        })
        .join(", ")}
      arrow
    >
      <Badge variant="dot" color="error">
        <PickersDay day={day} {...other} />
      </Badge>
    </Tooltip>
  );
};

const DocumentCalenderCard = () => {
  return (
    <CustomCard sx={{ padding: "0 0 6px 0" }}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
        Expiring Soon
      </Typography>
      <Divider />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          referenceDate={dayjs("2026-01-25")}
          views={["year", "month", "day"]}
          slots={{
            day: DocumentDay,
          }}
        />
      </LocalizationProvider>
    </CustomCard>
  );
};

export default DocumentCalenderCard;
