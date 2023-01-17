import axios from 'axios';
import {useState, useEffect} from 'react'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import {AreaChart, XAxis, YAxis, CartesianGrid, Tooltip , Area} from 'recharts'
import Select from '@mui/material/Select';
import { TextField, Button, Alert } from '@mui/material';


function Main(){
    const [models, setModels] = useState([])
    const [model, setModel] = useState('')
    const [year, setYear] = useState(0)
    const [actualData, setActualData] = useState([])
    const [week, setWeek] = useState(0)
    const [sales, setSales] = useState(0)
    const [alert, setAlert] = useState(false);
    const rows = [];
    for (let i = 1; i <= 52; i++) {
        rows.push(<MenuItem value={i}>{i}</MenuItem>
        );
    }

    useEffect(()=>{
    axios.get('http://localhost:5000/getModels').then(function(response){
        setModels(response.data);
    })
    },[]);

    const handleChange = (event) => {
        setModel(event.target.value);
    if(year == 0)
        return;
    axios.post('http://localhost:5000/getGraphs', {model:model, year:year}).then(function(response){
        var finishedData = []
        let data = JSON.parse(response.data);
        let week = data["Week ID"]
        let actual = data["# Actuals"]
        let forecast = data["# Forecast"]
            for (const [key,value] of Object.entries(week)){
        finishedData.push({
            "name": week[key],
            "Actual": actual[key],
            "Forecast": forecast[key]
        })
        }
        setActualData(finishedData)
    })
    };


    const handleChange2 = (event) => {
        setYear(event.target.value);
    if(model == '')
        return;
    axios.post('http://localhost:5000/getGraphs', {model:model, year:event.target.value}).then(function(response){
        var finishedData = []
        let data = JSON.parse(response.data);
        let week = data["Week ID"]
        let actual = data["# Actuals"]
        let forecast = data["# Predicted"]
            for (const [key,value] of Object.entries(week)){
        finishedData.push({
            "name": week[key],
            "Actual": actual[key],
            "Forecast": forecast[key]
        })
        }
        setActualData(finishedData)
    })
    };

    const addSale = () =>{
        axios.post("http://localhost:5000/addSale",{year:year,model:model,sales:sales,week:week}).then((res)=>{
            if(res.data == "danger"){
                setAlert(true);
            }
            axios.post('http://localhost:5000/getGraphs', {model:model, year:year}).then(function(response){
        var finishedData = []
        let data = JSON.parse(response.data);
        let week = data["Week ID"]
        let actual = data["# Actuals"]
        let forecast = data["# Forecast"]
            for (const [key,value] of Object.entries(week)){
        finishedData.push({
            "name": week[key],
            "Actual": actual[key],
            "Forecast": forecast[key]
        })
        }
        setActualData(finishedData)
    })
        })
    }

    return(
        <div>
            {alert ? <Alert severity='error'>Your projected sales for the next 3 months has projected your inventory to be lower than the threshold!</Alert> : <></> }
        <div style={{display:"flex"}}>
        <Box style={{marginTop:"20px", marginLeft:"40px", width:"30%"}} sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Model</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={model}
            label="Model"
            onChange={handleChange}
        >
            {models.map((value) => 
                <MenuItem key={value} value={value}>{value}</MenuItem>
            )}
        </Select>
         </FormControl>
        </Box>
        <Box style={{marginTop:"20px", marginLeft:"40px", width:"30%"}} sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Year</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={year}
            label="Year"
            onChange={handleChange2}
        >
            <MenuItem value={2022}>2022</MenuItem>
            <MenuItem value={2023}>2023</MenuItem>
            <MenuItem value={2024}>2024</MenuItem>
        </Select>
         </FormControl>
        </Box>
        </div>
        <div>
            
        <AreaChart width={730} height={250} data={actualData}
            margin={{ top: 30, right: 30, left: 50, bottom: 0 }}>
        <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
        </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area type="monotone" dataKey="Actual" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
        <Area type="monotone" dataKey="Forecast" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
        </AreaChart>

        </div>
        <div style={{display:"flex"}}>
        <Box style={{marginTop:"20px", marginLeft:"40px", width:"10%"}} sx={{ minWidth: 120 }}>
        <TextField onChange={(e)=>setSales(e.target.value)} id="outlined-basic" label="Sales" variant="outlined" />
        </Box>
        <Box style={{marginTop:"20px", marginLeft:"40px", width:"10%"}} sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label3">Week</InputLabel>
        <Select
            labelId="demo-simple-select-label3"
            id="demo-simple-select"
            value={week}
            label="Week"
            onChange={(e)=>setWeek(e.target.value)}
            >

            {rows}
        </Select>
         </FormControl>
        </Box>
        <Box style={{marginTop:"30px", marginLeft:"10px", width:"13%"}} sx={{ minWidth: 120 }}>
        <Button onClick={addSale} variant="contained">Add Sales</Button>
        </Box>
            </div>
        </div>
    )}

export default Main