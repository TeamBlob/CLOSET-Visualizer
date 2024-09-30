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
                    <div className="mx-auto max-w-8xxl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex space-x-4">
                            <div className="w-2/4">
                                <DonutChart chartSetting={dashboardGraph.paperGraph}/>
                            </div>
                            <div className="w-2/4">
                                <BarChart chartSetting={dashboardGraph.violationGraph} />
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <div className="w-2/4">
                                <BarChart chartSetting={dashboardGraph.positivePossibleGraph} />
                            </div>
                            <div className="w-2/4">
                                <ProfileChart topProfiles={dashboardGraph.topProfiles} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
