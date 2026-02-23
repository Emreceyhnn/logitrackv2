import {
  alpha,
  InputAdornment,
  SxProps,
  TextField,
  Theme,
  useTheme,
} from "@mui/material";

interface Props {
  label?: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  select?: boolean;
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

const CustomTextArea = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  type = "text",
  select = false,
  children,
  sx,
  disabled = false,
  error = false,
  helperText,
}: Props) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  /* ---------------------------------- style --------------------------------- */
  const baseStyles: SxProps<Theme> = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: alpha("#1A202C", 0.5),
      borderRadius: 2,
      "& fieldset": {
        borderColor: alpha(theme.palette.divider, 0.1),
      },
      "&:hover fieldset": {
        borderColor: alpha(theme.palette.primary.main, 0.3),
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
    "& .MuiInputLabel-root": {
      color: "text.secondary",
      fontSize: "0.85rem",
      "&.Mui-focused": {
        color: theme.palette.primary.main,
      },
    },
    "& .MuiOutlinedInput-input": {
      color: "white",
    },
  };

  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={!select ? type : undefined}
      select={select}
      error={error}
      helperText={helperText}
      sx={[baseStyles, ...(Array.isArray(sx) ? sx : [sx])]}
      InputProps={
        !select
          ? {
              startAdornment: children ? (
                <InputAdornment position="start">{children}</InputAdornment>
              ) : undefined,
            }
          : undefined
      }
      disabled={disabled}
    >
      {select ? children : null}
    </TextField>
  );
};

export default CustomTextArea;
