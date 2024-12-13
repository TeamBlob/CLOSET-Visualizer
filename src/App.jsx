import { useState } from 'react'
import Header from "./components/Header"
import COISubDashboard from "./components/COISubDashboard"
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import COIMetaData from './components/COIMetaData'
import XLSXReader from './components/XLSXReader'
import ProfileDashboard from './components/ProfileDashboard'
import ProfileDetails from './components/ProfileDetails'
import COIGraphDashboard from './components/COIGraphDashboard'
import Footer from './components/Footer';



function App() {
  const [coiDashboard, setDashboard] = useState({});
  const [coiDashboardGraph, setCOIDashboardGraph] = useState({});
  const [profiles, setProfiles] = useState({});
  const [isAll, setIsAll] = useState(false);
  const navigationHeader = [
    { name: 'Upload File', href: '/', current: true, show: true },
    { name: 'Dashboard Overview', href: '/overview', current: false, show: false  },
    { name: 'Possible Violation', href: '/possible', current: false, show: false  },
    { name: 'Positive Violation', href: '/positive', current: false, show: false  },
    { name: 'Profile', href: '/profile', current: false, show: false  },
  ];
  const [navigation, setNavigation] = useState(navigationHeader);

  return (
    <>
    <Header navigation={navigation} setNavigation={setNavigation}/>
    
    <Routes>
      <Route path='/' element={<XLSXReader setDashboard={setDashboard} setProfiles={setProfiles} setCOIDashboardGraph={setCOIDashboardGraph} setNavigation={setNavigation} setIsAll={setIsAll} />}></Route>
      {
        Object.keys(coiDashboard).length > 0 && 
        <>
          { 
            <Route key={crypto.randomUUID()} path='/possible' element={<COISubDashboard dashboardData={coiDashboard.possible} />}></Route>
          }
          { 
            <Route key={crypto.randomUUID()} path='/positive' element={<COISubDashboard dashboardData={coiDashboard.positive}/>}></Route>
          }
        </>
      }
      {
        Object.keys(coiDashboardGraph).length > 0 && 
        <>
          { 
            <Route key={crypto.randomUUID()} path='/overview' element={<COIGraphDashboard dashboardGraph={coiDashboardGraph} />}></Route>
          }
        </>
      }
      {
        Object.keys(profiles).length > 0 && 
        <>
          { 
            <Route key={crypto.randomUUID()} path='/profile' element={<ProfileDashboard profileData={profiles} isAll={isAll} />}></Route>
          }
        </>
      }
      <Route path='/coidetails/:pageid' element={<COIMetaData/>}></Route>
      <Route path='/profiledetails/:profilekey' element={<ProfileDetails/>}></Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <Footer />
    </>

  )
}

export default App
