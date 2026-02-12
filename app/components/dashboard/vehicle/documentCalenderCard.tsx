import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import type { PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { Badge, Divider, Tooltip, Typography } from "@mui/material";
import CustomCard from "../../cards/card";

interface VehicleDocument {
  id: string;
  plate: string;
  documentType: string;
  expiryDate: Date | null;
}

interface VehicleDocumentCalenderCardProps {
  data?: VehicleDocument[];
}

const DocumentCalenderCard = ({
  data = [],
}: VehicleDocumentCalenderCardProps) => {
  const DocumentDay = (props: PickersDayProps) => {
    const { day, ...other } = props;

    const docsForDay = data.filter((d) =>
      d.expiryDate ? dayjs(d.expiryDate).isSame(day, "day") : false
    );

    if (docsForDay.length === 0) {
      return <PickersDay day={day} {...other} />;
    }

    return (
      <Tooltip
        title={docsForDay
          .map((d) => `${d.documentType} - ${d.plate}`)
          .join(", ")}
        arrow
      >
        <Badge variant="dot" color="error">
          <PickersDay day={day} {...other} />
        </Badge>
      </Tooltip>
    );
  };

  return (
    <CustomCard sx={{ padding: "0 0 6px 0" }}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
        Expiring Soon
      </Typography>
      <Divider />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          referenceDate={dayjs()}
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
