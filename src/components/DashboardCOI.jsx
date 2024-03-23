import Sub_List from "./Sub-List"
import Tooltip from "./ToolTips"

const SUB_COI_DASHBOARD = [
    {
        key: crypto.randomUUID(),
        name: "Possible COI Violation",
        description: "It contains possible COI violations (based on the conference-specified policy for COI) with the assigned reviewers",
        coi_data: [
            {
                pageId: "865",
                author: 'Zhaoyuan Su',
                authorEmail: "acf7ea@virginia.edu",
                reviewer: 'Aditya Parameswaran',
                reviewerEmail: "adityagp@berkeley.edu",
                reviewerUrl: 'https://dblp.org/pid/40/7459.html',
            },
            {
                pageId: "927",
                author: 'Yi Li',
                authorEmail: "liyi@dlut.edu.cn",
                reviewer: 'Yao Lu',
                reviewerEmail: "i@yao.lu",
                reviewerUrl: 'https://dblp.org/pid/26/5662.html',
            },
          ]
    },
    {
        key: crypto.randomUUID(),
        name: "Instituional COI Violation",
        description: "It contains (potential) COI violation due to institutional match.",
        coi_data: []
    },
]

export default function Dashboard()
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
                    {SUB_COI_DASHBOARD.map((sub_coi) => (
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