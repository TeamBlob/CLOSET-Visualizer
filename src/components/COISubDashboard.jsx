import Sub_List from "./Sub-List"
import Tooltip from "./ToolTips"

export default function COISubDashboard({dashboardData})
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
                    {Object.keys(dashboardData).length > 0 && Object.values(dashboardData).map((sub_coi) => (
                        <div key={sub_coi.key} className="border-b border-gray-300 pb-6 mb-6">
                            <div className="flex">
                                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                    {sub_coi.name}
                                </h2>
                                <Tooltip message={sub_coi.description}>
                                    <svg className="h-5 w-5 text-slate-900 m-2"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </Tooltip>
                            </div>
                            <div className="mt-6 mr-6 mb-6 ml-6">
                                <Sub_List coi_data={sub_coi.coi_data} type={sub_coi.type} />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>

    )
}