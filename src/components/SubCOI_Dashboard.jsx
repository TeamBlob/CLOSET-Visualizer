import Dashboard from "./DashboardCOI";
import Sub_List from "./Sub-List";

export default function SubCOIDashBoard( {SUB_COI_DASHBOARD} ){
    return (
        <>  
            <div>
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{SUB_COI_DASHBOARD.name + " Dashboard"}</h1>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <Sub_List coi_data={SUB_COI_DASHBOARD.coi_data}/>
                </div>
            </main>
        </div>
        </>
        
    )
}