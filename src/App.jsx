import { useState } from 'react'
import Header from "./components/Header"
import Dashboard from "./components/DashboardCOI"
import './App.css'
import SubCOIDashBoard from './components/SubCOI_Dashboard'
import {Routes, Route} from 'react-router-dom'
import COIMetaData from './components/COIMetaData'
import GraphUI from './components/GraphUI'
import XLSXReader from './components/XLSXReader'

const COI_DASHBOARD = [
  {
      key: crypto.randomUUID(),
      name: "Possible COI Violation",
      description: "It contains possible COI violations (based on the conference-specified policy for COI) with the assigned reviewers",
      coi_data: [
          {
              pageId: "865",
              author: [{ 
                          name: 'Zhaoyuan Su',
                          email: 'acf7ea@virginia.edu'
                       }
                      ],
              reviewer: [{ 
                          name: 'Aditya Parameswaran',
                          email: "adityagp@berkeley.edu",
                          url: 'https://dblp.org/pid/40/7459.html'
                          }
                      ],
          },
          {
              pageId: "927",
              author: [{ 
                          name: 'Yi Li',
                          email: 'acf7ea@virginia.edu'
                       }
                      ],
              reviewer: [{ 
                          name: 'Yao Lu',
                          email: "i@yao.lu",
                          url: 'https://dblp.org/pid/26/5662.html'
                          }
                      ],
          },
        ]
  },
  {
      key: crypto.randomUUID(),
      name: "Instituional COI Violation",
      description: "It contains (potential) COI violation due to institutional match.",
      coi_data: [
          {
              pageId: "906",
              author: [{"name": "yao lu ", "email": "i@yao.lu", "institute": "national university of singapore"}, {"name": "song bian ", "email": "songbian@cs.wisc.edu", "institute": "university of wisconsinmadison"}, {"name": "lequn chen ", "email": "lqchen@cs.washington.edu", "institute": "university of washington"}, {"name": "yongjun he ", "email": "yongjun.he@inf.ethz.ch", "institute": "eth zurich"}, {"name": "yulong hui ", "email": "huiyl22@mails.tsinghua.edu.cn", "institute": "tsinghua university"}, {"name": "matthew lentz ", "email": "mlentz@cs.duke.edu", "institute": "duke university"}, {"name": "beibin li ", "email": "beibin.li@microsoft.com", "institute": "microsoft research"}, {"name": "fei liu ", "email": "jupiturliu@gmail.com", "institute": "bytedance"}, {"name": "jialin li ", "email": "lijl@comp.nus.edu.sg", "institute": "nus"}, {"name": "liu qi ", "email": "liuqi@cs.hku.hk", "institute": "university of oxford"}, {"name": "rui liu ", "email": "ruiliu@cs.uchicago.edu", "institute": "university of chicago"}, {"name": "xiaoxuan liu ", "email": "xiaoxuan_liu@berkeley.edu", "institute": "uc berkeley"}, {"name": "lin ma ", "email": "linmacse@umich.edu", "institute": "university of michigan"}, {"name": "kexin rong ", "email": "krong@gatech.edu", "institute": "georgia institute of technology"}, {"name": "jianguo wang ", "email": "csjgwang@purdue.edu", "institute": "purdue university"}, {"name": "yongji wu ", "email": "yongji.wu769@duke.edu", "institute": "duke university"}, {"name": "huanchen zhang ", "email": "huanchen@tsinghua.edu.cn", "institute": "tsinghua university"}, {"name": "yingjun wu ", "email": "yingjunwu@risingwave-labs.com", "institute": "risingwave labs"}, {"name": "minjia zhang ", "email": "minjiaz@microsoft.com", "institute": "microsoft ai and research"}, {"name": "qizhen zhang ", "email": "qz@cs.toronto.edu", "institute": "university of toronto"}, {"name": "tianyi zhou ", "email": "tianyi@umd.edu", "institute": "university of maryland"}, {"name": "danyang zhuo ", "email": "danyang@cs.duke.edu", "institute": "duke university"}],
              reviewer: [{"name": "zhaojing luo ", "email": "zhaojing@comp.nus.edu.sg", "institute": "national university of singapore"}],
          },
      ]
  },
]

function App() {
  return (
    <>
    <Header/>
    <XLSXReader />
    <Routes>
      <Route path='/' element={<Dashboard COI_DASHBOARD={COI_DASHBOARD} />}></Route>
      <Route path='/PossibleCOI' element={<SubCOIDashBoard SUB_COI_DASHBOARD={COI_DASHBOARD[0]}/>}></Route>
      <Route path='/InstituionalCOI' element={<SubCOIDashBoard SUB_COI_DASHBOARD={COI_DASHBOARD[1]}/>}></Route>
      <Route path='/COIMetaData' element={<COIMetaData />}></Route>
      <Route path='/GraphUI' element={<GraphUI />}></Route>
    </Routes>
    </>

  )
}

export default App
