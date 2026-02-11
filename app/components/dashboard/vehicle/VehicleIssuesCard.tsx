"use client";

import { Card, CardContent, CardHeader, Typography, Box, Chip, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface CheckIssue {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    createdAt: Date;
    vehicle?: {
        plate: string;
    }
}

interface VehicleIssuesCardProps {
    issues: CheckIssue[];
}

const getPriorityColor = (priority: string) => {
    switch (priority.toUpperCase()) {
        case 'CRITICAL': return 'error';
        case 'HIGH': return 'warning';
        case 'MEDIUM': return 'info';
        case 'LOW': return 'success'; // or default
        default: return 'default';
    }
};

const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
        case 'OPEN': return <ErrorIcon color="error" />;
        case 'IN_PROGRESS': return <WarningIcon color="warning" />;
        case 'RESOLVED': return <CheckCircleIcon color="success" />;
        default: return <InfoIcon color="info" />;
    }
};

export default function VehicleIssuesCard({ issues }: VehicleIssuesCardProps) {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
                title="Open Vehicle Issues"
                subheader={`${issues.length} active issues`}
            />
            <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
                {issues.length === 0 ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Typography variant="body2" color="text.secondary">No open issues</Typography>
                    </Box>
                ) : (
                    <List>
                        {issues.map((issue) => (
                            <ListItem key={issue.id} divider>
                                <ListItemIcon>
                                    {getStatusIcon(issue.status)}
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="subtitle2">{issue.title}</Typography>
                                            <Chip
                                                label={issue.priority}
                                                size="small"
                                                color={getPriorityColor(issue.priority) as any}
                                                variant="outlined"
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <>
                                            <Typography variant="caption" display="block">
                                                {issue.vehicle?.plate ? `Vehicle: ${issue.vehicle.plate}` : ''}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {issue.description}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
}
