import React, { useState } from 'react';
import {
   Table,
   TableHead,
   TableRow,
   TableCell,
   TableBody,
   Button,
   TableContainer,
   Paper,
   TablePagination,
   Grid,
} from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import useFetch from './hooks/useFetch';
import { ErrorMessage, Loader } from './components';

const columns = [
   {
      id: 'transactionDate',
      label: 'Date & Time',
      minWidth: 170,
      format: (value) =>
         new Date(parseInt(String(value))).toLocaleString('en-US', { hour12: false }),
   },
   {
      id: 'currencyFrom',
      label: 'Currency From',
      minWidth: 100,
   },
   {
      id: 'amount1',
      label: 'Amount1',
      minWidth: 170,
      format: (value) => value.toLocaleString('en-US'),
   },
   { id: 'currencyTo', label: 'Currency To', minWidth: 100 },
   {
      id: 'amount2',
      label: 'Amount2',
      minWidth: 170,
      format: (value) => value.toLocaleString('en-US'),
   },
   {
      id: 'type',
      label: 'Type',
      minWidth: 100,
      format: (value) => {
         return value
            .toLowerCase()
            .split('_')
            .reduce((s, c) => s + '' + (c.charAt(0).toUpperCase() + c.slice(1) + ' '), '');
      },
   },
];

function App() {
   const { data, loading, error } = useFetch();
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);

   const handleChangePage = (event, newPage) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
   };

   const printPdf = () => {
      const input = document.getElementById('pdfdiv');
      html2canvas(input).then((canvas) => {
         const imgWidth = 200;
         const imgHeight = (canvas.height * imgWidth) / canvas.width;
         const imgData = canvas.toDataURL('image/png');
         const pdf = new jsPDF('p', 'mm', 'a4');
         const position = 0;
         pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
         pdf.save('Transactions.pdf');
      });
   };

   if (loading || (!data && !error)) return <Loader />;
   if (error) return <ErrorMessage />;

   return (
      <Paper sx={{ width: '100%' }}>
         <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ marginTop: '50px' }}
         >
            <Grid item xs={3}>
               <Button onClick={() => printPdf()} variant="contained" color="primary">
                  Generate Pdf
               </Button>
            </Grid>
         </Grid>
         <TableContainer id="pdfdiv" sx={{ maxHeight: 920 }}>
            <Table stickyHeader aria-label="sticky table">
               <TableHead>
                  <TableRow>
                     {columns.map((column) => (
                        <TableCell
                           key={column.id}
                           align={column.align}
                           style={{ top: 57, minWidth: column.minWidth }}
                        >
                           {column.label}
                        </TableCell>
                     ))}
                  </TableRow>
               </TableHead>
               <TableBody>
                  {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                     return (
                        <TableRow key={row._id}>
                           {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                 <TableCell key={column.id} align={column.align}>
                                    {column.format ? column.format(value) : value}
                                 </TableCell>
                              );
                           })}
                        </TableRow>
                     );
                  })}
               </TableBody>
            </Table>
         </TableContainer>
         <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
         />
      </Paper>
   );
}

export default App;
