import { Box, Divider, Stack, Typography } from "@mui/material";

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: "background.paper",
                px: { xs: 3, md: 8 },
                py: 6,
            }}
        >
            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={6}
                justifyContent="space-between"
            >
                {/* Brand */}
                <Stack spacing={1} maxWidth={300}>
                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: 24,
                            letterSpacing: "-0.05em",
                            textTransform: "uppercase",
                        }}
                    >
                        Logitrack
                    </Typography>
                    <Typography color="text.secondary" fontSize={14}>
                        Smart logistics tracking and fleet visibility platform.
                    </Typography>
                </Stack>

                {/* Links */}
                <Stack direction="row" spacing={8}>
                    <Stack spacing={1}>
                        <Typography fontWeight={600}>Product</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Features
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Pricing
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Roadmap
                        </Typography>
                    </Stack>

                    <Stack spacing={1}>
                        <Typography fontWeight={600}>Company</Typography>
                        <Typography variant="body2" color="text.secondary">
                            About
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Blog
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Careers
                        </Typography>
                    </Stack>

                    <Stack spacing={1}>
                        <Typography fontWeight={600}>Legal</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Privacy Policy
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Terms of Service
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>

            <Divider sx={{ my: 4 }} />

            {/* Bottom */}
            <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
            >
                <Typography variant="body2" color="text.secondary">
                    © {new Date().getFullYear()} Logitrack. All rights reserved.
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Built for modern logistics.
                </Typography>
            </Stack>
        </Box>
    );
}
