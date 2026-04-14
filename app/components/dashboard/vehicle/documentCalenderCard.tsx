import dayjs from "dayjs";
import "dayjs/locale/tr";
import "dayjs/locale/en";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import type { PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { Badge, Divider, Tooltip, Typography } from "@mui/material";
import CustomCard from "../../cards/card";
import { useParams } from "next/navigation";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

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
  const dict = useDictionary();
  const params = useParams();
  const lang = (params?.lang as string) || "en";

  const DocumentDay = (props: PickersDayProps) => {
    const { day, ...other } = props;

    const docsForDay = data.filter((d) =>
      d.expiryDate ? dayjs(d.expiryDate).isSame(day, "day") : false
    );

    if (docsForDay.length === 0) {
      return <PickersDay day={day} {...other} />;
    }

    const getLocalizedDocType = (type: string) => {
      return (dict.vehicles.docTypes as Record<string, string>)?.[type] || type;
    };

    return (
      <Tooltip
        title={docsForDay
          .map((d) => `${getLocalizedDocType(d.documentType)} - ${d.plate}`)
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
        {dict.vehicles.dashboard.expiringSoon}
      </Typography>
      <Divider />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={lang}>
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
