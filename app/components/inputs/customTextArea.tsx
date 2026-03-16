import {
  alpha,
  InputAdornment,
  SxProps,
  TextField,
  Theme,
  useTheme,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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
      SelectProps={
        select
          ? {
              IconComponent: KeyboardArrowDownIcon,
              MenuProps: {
                PaperProps: {
                  sx: {
                    mt: 1,
                    bgcolor: "#1A202C",
                    backgroundImage: "none",
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.8)",
                    "& .MuiMenuItem-root": {
                      fontSize: "0.875rem",
                      py: 1,
                      px: 2,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.main,
                      },
                      "&.Mui-selected": {
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.18),
                        },
                      },
                    },
                  },
                },
              },
            }
          : undefined
      }
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
