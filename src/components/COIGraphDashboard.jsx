import DonutChart from './ChartDonut'
import BarChart from './ChartBar'
import ProfileChart from './ChartProfile'

export default function COIGraphDashboard({ dashboardGraph }) {
    return (
        <>  
            <div>
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {/* Use CSS grid for 2 by 2 layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DonutChart chartSetting={dashboardGraph.paperGraph} />
                            <BarChart chartSetting={dashboardGraph.violationGraph} />
                            <BarChart chartSetting={dashboardGraph.positivePossibleGraph} />
                            <ProfileChart topProfiles={dashboardGraph.topProfiles} />
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
