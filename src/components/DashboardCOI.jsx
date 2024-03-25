import Sub_List from "./Sub-List"
import Tooltip from "./ToolTips"

// const SUB_COI_DASHBOARD = [
//     {
//         key: crypto.randomUUID(),
//         name: "Possible COI Violation",
//         description: "It contains possible COI violations (based on the conference-specified policy for COI) with the assigned reviewers",
//         coi_data: [
//             {
//                 pageId: "865",
//                 author: [{ 
//                             name: 'Zhaoyuan Su',
//                             email: 'acf7ea@virginia.edu'
//                          }
//                         ],
//                 reviewer: [{ 
//                             name: 'Aditya Parameswaran',
//                             email: "adityagp@berkeley.edu",
//                             url: 'https://dblp.org/pid/40/7459.html'
//                             }
//                         ],
//             },
//             {
//                 pageId: "927",
//                 author: [{ 
//                             name: 'Yi Li',
//                             email: 'acf7ea@virginia.edu'
//                          }
//                         ],
//                 reviewer: [{ 
//                             name: 'Yao Lu',
//                             email: "i@yao.lu",
//                             url: 'https://dblp.org/pid/26/5662.html'
//                             }
//                         ],
//             },
//           ]
//     },
//     {
//         key: crypto.randomUUID(),
//         name: "Instituional COI Violation",
//         description: "It contains (potential) COI violation due to institutional match.",
//         coi_data: [
//             {
//                 pageId: "906",
//                 author: [{"name": "yao lu ", "email": "i@yao.lu", "institute": "national university of singapore"}, {"name": "song bian ", "email": "songbian@cs.wisc.edu", "institute": "university of wisconsinmadison"}, {"name": "lequn chen ", "email": "lqchen@cs.washington.edu", "institute": "university of washington"}, {"name": "yongjun he ", "email": "yongjun.he@inf.ethz.ch", "institute": "eth zurich"}, {"name": "yulong hui ", "email": "huiyl22@mails.tsinghua.edu.cn", "institute": "tsinghua university"}, {"name": "matthew lentz ", "email": "mlentz@cs.duke.edu", "institute": "duke university"}, {"name": "beibin li ", "email": "beibin.li@microsoft.com", "institute": "microsoft research"}, {"name": "fei liu ", "email": "jupiturliu@gmail.com", "institute": "bytedance"}, {"name": "jialin li ", "email": "lijl@comp.nus.edu.sg", "institute": "nus"}, {"name": "liu qi ", "email": "liuqi@cs.hku.hk", "institute": "university of oxford"}, {"name": "rui liu ", "email": "ruiliu@cs.uchicago.edu", "institute": "university of chicago"}, {"name": "xiaoxuan liu ", "email": "xiaoxuan_liu@berkeley.edu", "institute": "uc berkeley"}, {"name": "lin ma ", "email": "linmacse@umich.edu", "institute": "university of michigan"}, {"name": "kexin rong ", "email": "krong@gatech.edu", "institute": "georgia institute of technology"}, {"name": "jianguo wang ", "email": "csjgwang@purdue.edu", "institute": "purdue university"}, {"name": "yongji wu ", "email": "yongji.wu769@duke.edu", "institute": "duke university"}, {"name": "huanchen zhang ", "email": "huanchen@tsinghua.edu.cn", "institute": "tsinghua university"}, {"name": "yingjun wu ", "email": "yingjunwu@risingwave-labs.com", "institute": "risingwave labs"}, {"name": "minjia zhang ", "email": "minjiaz@microsoft.com", "institute": "microsoft ai and research"}, {"name": "qizhen zhang ", "email": "qz@cs.toronto.edu", "institute": "university of toronto"}, {"name": "tianyi zhou ", "email": "tianyi@umd.edu", "institute": "university of maryland"}, {"name": "danyang zhuo ", "email": "danyang@cs.duke.edu", "institute": "duke university"}],
//                 reviewer: [{"name": "zhaojing luo ", "email": "zhaojing@comp.nus.edu.sg", "institute": "national university of singapore"}],
//             },
//         ]
//     },
// ]

export default function Dashboard({COI_DASHBOARD})
{
    return (
        <div>
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {COI_DASHBOARD.map((sub_coi) => (
                        <div key={sub_coi.key}>
                            <div className="flex">
                                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                    {sub_coi.name}
                                </h2>
                                <Tooltip message={sub_coi.description}>
                                    <svg class="h-5 w-5 text-slate-900 m-2"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </Tooltip>

                            </div>
                            <div className="mt-6 mr-6 mb-6 ml-6">
                                <Sub_List coi_data={sub_coi.coi_data} />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>

    )
}