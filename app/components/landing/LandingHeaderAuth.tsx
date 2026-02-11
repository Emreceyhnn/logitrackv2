import { useState, useEffect } from "react";
import { Button, Stack, CircularProgress, Dialog, DialogContent, IconButton, Box } from "@mui/material";
import { alpha } from "@mui/system";
import Link from "next/link";
import { getUserFromToken } from "@/app/lib/controllers/users";
import CreateCompanyForm from "@/app/components/forms/createCompanyForm";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function LandingHeaderAuth() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [openCompanyModal, setOpenCompanyModal] = useState(false);

    const checkAuth = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const userData = await getUserFromToken(token);
                setUser(userData);
            } catch (error) {
                console.error("Auth check failed:", error);
                localStorage.removeItem("token");
                setUser(null);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const handleSuccess = () => {
        setOpenCompanyModal(false);
        checkAuth(); // Refresh auth state to show "Go to Dashboard"
    };

    if (loading) {
        return <CircularProgress size={24} sx={{ color: "#38bdf8" }} />;
    }

    if (user) {
        if (user.companyId) {
            return (
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        component={Link}
                        href="/overview"
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            px: 3,
                            borderRadius: "999px",
                            background: "linear-gradient(135deg, #22d3ee, #2563eb)",
                            boxShadow: "0 12px 30px rgba(37, 99, 235, 0.35)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #0ea5e9, #1d4ed8)",
                            },
                        }}
                    >
                        Go to Dashboard
                    </Button>
                </Stack>
            );
        } else {
            return (
                <>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            onClick={() => setOpenCompanyModal(true)}
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                px: 3,
                                borderRadius: "999px",
                                background: "linear-gradient(135deg, #22d3ee, #2563eb)",
                                boxShadow: "0 12px 30px rgba(37, 99, 235, 0.35)",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #0ea5e9, #1d4ed8)",
                                },
                            }}
                        >
                            Create Company
                        </Button>
                    </Stack>

                    <Dialog
                        open={openCompanyModal}
                        onClose={() => setOpenCompanyModal(false)}
                        PaperProps={{
                            sx: {
                                bgcolor: "transparent",
                                boxShadow: "none",
                                overflow: "visible"
                            }
                        }}
                    >
                        <Box sx={{ position: "relative", bgcolor: "#151515", borderRadius: "16px", overflow: "hidden" }}>
                            <IconButton
                                onClick={() => setOpenCompanyModal(false)}
                                sx={{
                                    position: "absolute",
                                    right: 8,
                                    top: 8,
                                    color: "rgba(255,255,255,0.5)",
                                    zIndex: 1
                                }}
                            >
                                <CloseRoundedIcon />
                            </IconButton>
                            <CreateCompanyForm onSuccess={handleSuccess} />
                        </Box>
                    </Dialog>
                </>
            );
        }
    }

    // Not logged in
    return (
        <Stack direction="row" spacing={2}>
            <Button
                variant="text"
                component={Link}
                href="/auth/sign-in"
                sx={{
                    color: alpha("#e2e8f0", 0.8),
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": { color: "#38bdf8" },
                }}
            >
                Login
            </Button>
            <Button
                variant="contained"
                sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    px: 3,
                    borderRadius: "999px",
                    background: "linear-gradient(135deg, #22d3ee, #2563eb)",
                    boxShadow: "0 12px 30px rgba(37, 99, 235, 0.35)",
                    "&:hover": {
                        background: "linear-gradient(135deg, #0ea5e9, #1d4ed8)",
                    },
                }}
            >
                Request a Demo
            </Button>
        </Stack>
    );
}
