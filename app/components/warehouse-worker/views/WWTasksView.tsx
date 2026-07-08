"use client";

import { Box, Stack, Typography, Card, Avatar, useTheme } from "@mui/material";
import type {
  Task,
  WarehouseWorkerDict,
} from "@/app/lib/type/warehouseWorkerClient";
import { I } from "@/app/lib/utils/warehouseWorkerUi";
import { Ico } from "../Ico";
import WWTaskRow from "../WWTaskRow";

interface WWTasksViewProps {
  ww: WarehouseWorkerDict;
  tasks: Task[];
  openTasks: number;
  highCount: number;
  advanceTask: (id: string) => void;
}

export default function WWTasksView({
  ww,
  tasks,
  openTasks,
  highCount,
  advanceTask,
}: WWTasksViewProps) {
  const theme = useTheme();
  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
          {ww.ui.myTaskQueue}
        </Typography>
        <Typography
          sx={{ fontSize: 13, color: theme.palette.text.secondary, mt: 1 }}
        >
          {openTasks} {ww.ui.openTasksCount} · {highCount} {ww.ui.highPriority}
        </Typography>
      </Box>
      <Card
        data-tour="ww-task-list"
        sx={{
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: 3,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 2.5 }}>
          <Avatar
            sx={{
              bgcolor: `${theme.palette.primary.main}1f`,
              color: theme.palette.primary.main,
              borderRadius: 2,
            }}
          >
            <Ico d={I.tasks} size={19} />
          </Avatar>
          <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
            {ww.ui.allAssignedTasks}
          </Typography>
        </Stack>
        <Box
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          {tasks.map((t) => (
            <WWTaskRow key={t.id} t={t} advanceTask={advanceTask} ww={ww} />
          ))}
        </Box>
      </Card>
    </Stack>
  );
}
