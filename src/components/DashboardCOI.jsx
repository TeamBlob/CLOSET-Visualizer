import Sub_List from "./Sub-List"
import Tooltip from "./ToolTips"

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
                    {Object.keys(COI_DASHBOARD).length > 0 && COI_DASHBOARD.map((sub_coi) => (
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