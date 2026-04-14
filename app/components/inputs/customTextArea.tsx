import {
  
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
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
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
  onBlur,
}: Props) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  /* ---------------------------------- style --------------------------------- */
  const baseStyles: SxProps<Theme> = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.text.darkBlue._alpha.main_50,
      borderRadius: 2,
      "& fieldset": {
        borderColor: theme.palette.divider_alpha.main_10,
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary._alpha.main_30,
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
      onBlur={onBlur}
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
                    border: `1px solid ${theme.palette.divider_alpha.main_10}`,
                    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.8)",
                    "& .MuiMenuItem-root": {
                      fontSize: "0.875rem",
                      py: 1,
                      px: 2,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: theme.palette.primary._alpha.main_08,
                        color: theme.palette.primary.main,
                      },
                      "&.Mui-selected": {
                        bgcolor: theme.palette.primary._alpha.main_12,
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        "&:hover": {
                          bgcolor: theme.palette.primary._alpha.main_18,
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
