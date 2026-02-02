import { Chip } from "@mui/material"


export const PriorityChip = ({ status }: { status: string }) => {


    const getPriorityColor = (status: string) => {
        const normalizedStatus = status.toUpperCase();

        // Success - Green
        if (["HIGH"].includes(normalizedStatus)) {
            return { bgColor: "rgba(246, 116, 116, 0.12)", color: "rgba(246, 116, 116, 1)", borderColor: "rgba(246, 116, 116, 0.9)" };
        }

        if (["MEDIUM", "NORMAL"].includes(normalizedStatus)) {
            return { bgColor: "rgba(238, 207, 43, 0.12)", color: "rgba(238, 207, 43, 1)", borderColor: "rgba(238, 207, 43, 0.9)" };
        }


        if (["LOW"].includes(normalizedStatus)) {
            return { bgColor: "rgba(55, 187, 245, 0.12)", color: "rgba(55, 187, 245, 1)", borderColor: "rgba(55, 187, 245, 0.9)" };
        }

        // Neutral - Grey (Default)
        return { bgColor: "#f5f5f5", color: "#616161" };
    }

    const formatStatusText = (status: string) => {
        return status.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }

    return (
        <Chip variant="filled" size="small" label={formatStatusText(status)} sx={{
            borderRadius: "4px",
            p: "2px 4px",
            fontSize: "0.75rem",
            fontWeight: 500,
            lineHeight: 1.5,
            letterSpacing: "0.02857em",
            textTransform: "none",
            backgroundColor: getPriorityColor(status).bgColor,
            color: getPriorityColor(status).color,
            border: "2px solid transparent",
            borderColor: getPriorityColor(status).borderColor,
        }} />
    )
}

