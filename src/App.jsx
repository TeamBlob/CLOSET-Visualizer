import { useState } from 'react'
import Header from "./components/Header"
import Dashboard from "./components/DashboardCOI"
import './App.css'
import SubCOIDashBoard from './components/SubCOI_Dashboard'
import {Routes, Route} from 'react-router-dom'
import COIMetaData from './components/COIMetaData'
import GraphUI from './components/GraphUI'
import XLSXReader from './components/XLSXReader'



function App() {
  const [coiDashboard, setCOIDashboard] = useState([]);
  return (
    <>
    <Header/>
    <XLSXReader setdashboard={setCOIDashboard}/>
    <Routes>
      {Object.keys(coiDashboard).length === 0 && "upload"}
      {Object.keys(coiDashboard).length > 0 && 
      <>
      <Route path='/' element={<Dashboard COI_DASHBOARD={coiDashboard} />}></Route>
      { coiDashboard.map((sub_coi) => (
        <>
          {console.log(sub_coi)};
          <Route key={sub_coi.key} path={sub_coi.link} element={<SubCOIDashBoard SUB_COI_DASHBOARD={sub_coi}/>}></Route>
        </>

      ))}
      </>
}
      <Route path='/COIMetaData' element={<COIMetaData />}></Route>
      <Route path='/GraphUI' element={<GraphUI />}></Route>
    </Routes>
    </>

  )
}

export default App
