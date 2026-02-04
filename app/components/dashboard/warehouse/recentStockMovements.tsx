"use client"
import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import mockData from "@/app/lib/mockData.json";
import CustomCard from "../../cards/card";

const RecentStockMovements = () => {
    const movements = mockData.inventory.movements;


    return (
        <CustomCard sx={{ p: 3, borderRadius: "12px", boxShadow: 3, flex: 7 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
                Recent Stock Movements
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>WAREHOUSE</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>SKU</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>TYPE</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>QTY</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', textAlign: 'right' }}>TIMESTAMP</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {movements.map((move) => {
                            const warehouse = mockData.warehouses.find(w => w.id === move.warehouseId);
                            const sku = mockData.inventory.catalog.find(s => s.id === move.skuId);
                            const isPick = move.type === "PICK";


                            const timeDisplay = move.timestamp.split('T')[1].substring(0, 5);

                            return (
                                <TableRow key={move.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ fontWeight: 600 }}>{warehouse?.code || move.warehouseId}</TableCell>
                                    <TableCell>{sku?.name || move.skuId}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={move.type}
                                            size="small"
                                            sx={{
                                                bgcolor: isPick ? 'rgba(251, 191, 36, 0.1)' : 'rgba(52, 211, 153, 0.1)',
                                                color: isPick ? '#fbbf24' : '#34d399',
                                                fontWeight: 700,
                                                borderRadius: '6px',
                                                fontSize: '0.7rem'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>
                                        {isPick ? '-' : '+'}{move.qty}
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: 'text.secondary' }}>

                                        {timeDisplay}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {/* Adding some dummy rows to fill the table to look like the design if only 2 exist */}
                        {movements.length < 5 && [1, 2, 3].map((i) => (
                            <TableRow key={`dummy-${i}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell sx={{ fontWeight: 600 }}>IST-01</TableCell>
                                <TableCell>Pallet Wrap Stretch</TableCell>
                                <TableCell>
                                    <Chip
                                        label="PICK"
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(251, 191, 36, 0.1)',
                                            color: '#fbbf24',
                                            fontWeight: 700,
                                            borderRadius: '6px',
                                            fontSize: '0.7rem'
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>-12</TableCell>
                                <TableCell align="right" sx={{ color: 'text.secondary' }}>45 mins ago</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </CustomCard>
    )
}

export default RecentStockMovements
