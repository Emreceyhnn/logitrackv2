import CreateUserForm from "@/app/components/forms/CreateUserForm";
import { Box } from "@mui/material";

export default function CreateUserPage() {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "80vh",
            }}
        >
            <CreateUserForm />
        </Box>
    );
}
