import { Select } from '@material-ui/core';
import React,{useState,useEffect} from 'react';
import {MenuItem,FormControl,Card,CardContent} from "@material-ui/core";
import Infobox from './Infobox';
import Table from './Table';
import './App.css';
import {sortData,preetyPrintStat} from "./util";
import "leaflet/dist/leaflet.css";
import Linegraph from './Linegraph'; 


function App() {
  const [countries,setCountries] = useState([]);
  const [country,setCountry] = useState('worldwide');
  const [countryInfo,setCountryInfo] = useState({});
  const [tableData,setTableData] = useState([]);
  const [casesType,setCasesType] = useState("cases");

 
  useEffect(() =>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response =>response.json())
    .then(data =>{
      setCountryInfo(data);  
    });
  },[]);
  useEffect(() => {
   const getCountriesData = async () =>{
     await fetch("https://disease.sh/v3/covid-19/countries")
     .then((response) =>response.json())
     .then((data) =>{
        const countries = data.map((country) => ({
          
            
              name: country.country,
              value: country.countryInfo.iso2,
              
        }));
        const sortedData = sortData(data);
        setTableData(sortedData);
        
        setCountries(countries);
     });
   };
   getCountriesData();
  },[]);
  const onCountryChange = async (event) =>{
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data =>{
       setCountry(countryCode);
       setCountryInfo(data);
      
    });
  };
  return (
    <div className="app">
      <div className="app__left">
       <div className="app__header">
       <h1>COVID-19 TRACKER</h1>
       <FormControl className="app__dropdown">
         <Select variant="outlined" value={country} onChange={onCountryChange}>
           
             <MenuItem value="worldwide">Worldwide</MenuItem>
            { countries.map(country =>(
             <MenuItem value={country.value}>{country.name}</MenuItem> 
             ))}
           
       
         </Select>
       </FormControl>
      </div>
      <div className="app__stats">
        <Infobox
        isRed
        active={casesType ==="cases"}
         onClick={(e) =>setCasesType('cases')}
         title="Coronavirus Cases" cases={preetyPrintStat(countryInfo.todayCases)} total={preetyPrintStat(countryInfo.cases)}/>

        <Infobox
        active={casesType ==="recovered"}
        onClick={(e) =>setCasesType('recovered')}
         title="Recovered" cases={preetyPrintStat(countryInfo.todayRecovered)} total={preetyPrintStat(countryInfo.recovered)} />

        <Infobox 
        isRed
        active={casesType ==="deaths"}
        onClick={(e) =>setCasesType('deaths')}
        title="Death" cases={preetyPrintStat(countryInfo.todayDeaths)} total={preetyPrintStat(countryInfo.deaths)} />

      </div>
      <div className="line__graph">
        <h3>Worldwide new <span>{casesType}</span></h3> 
        <Linegraph className="app__graph" casesType={casesType} />
      </div> 
       
      </div>
      <Card className="app__right">
       <CardContent>
         <h3>Live Cases by Country</h3>  
         <Table countries={tableData}/>
        
       </CardContent>
      </Card>
     </div>
     

  );
}

export default App;
