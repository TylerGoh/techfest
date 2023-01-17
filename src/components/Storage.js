import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button'
import { useEffect, useState } from 'react'
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Box, TextField } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 200,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

  function Storage(){
        const [threshy, setThresy] = useState(0);
        const [amt, setAmt] = useState(0);
      const [data, setData] = useState({})
      const [selected,setSelected] = useState('')
      const [open, setOpen] = useState(false);
        const handleOpen = () => setOpen(true);
        const handleClose = () => setOpen(false);
    useEffect(()=>{
        axios.get("http://localhost:5000/storage").then((response)=>
        {
            setData(response.data)
            console.log(data)
        }
        )
      },[])

    return (
        <div>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Model</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Threshold</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {
                    Object.keys(data).map((keyName,i)=>(
                        <TableRow
                        key={keyName}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {keyName}
                        </TableCell>
                        <TableCell align="right">{data[keyName]['sales']}</TableCell>
                        <TableCell align="right">{data[keyName]['threshold']}</TableCell>
                        <TableCell align="right"><Button onClick={()=>{
                            setOpen(true);
                            setSelected(keyName)
                        }}>Edit</Button></TableCell>
                        </TableRow>)
                    )
                }
            </TableBody>
          </Table>
        </TableContainer>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <TextField onChange={(e)=>setThresy(e.target.value)}id="outlined-basic" label="Threshold" variant="outlined" />
        <TextField onChange={(e)=>setAmt(e.target.value)}style={{marginTop:"30px"}}id="outlined-basic" label="Amount" variant="outlined" />
        <Button style={{marginTop:"30px"}} onClick={()=>{
            axios.post("http://localhost:5000/storage",{
                amount:amt,
                threshold:threshy,
                model:selected,
            }).then(()=>{
                window.location.reload();
            })
        }}>Change</Button>
        </Box>
      </Modal>
        </div>
      );
}

export default Storage