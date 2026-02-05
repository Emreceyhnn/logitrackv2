import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Stack } from "@mui/material";

interface CustomRatingProps {
  value: number;
  max?: number;
}

const CustomRating = ({ value, max = 5 }: CustomRatingProps) => {
  const stars = [];

  for (let i = 1; i <= max; i++) {
    if (value >= i) {
      stars.push(<StarIcon key={i} sx={{ color: "orange" }} />);
    } else if (value >= i - 0.5) {
      stars.push(<StarHalfIcon key={i} sx={{ color: "orange" }} />);
    } else {
      stars.push(<StarBorderIcon key={i} sx={{ color: "orange" }} />);
    }
  }

  return (
    <Stack direction="row" spacing={0.5}>
      {stars}
    </Stack>
  );
};

export default CustomRating;
