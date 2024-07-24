import Sub_List from "./Sub-List"
import Tooltip from "./ToolTips"

export default function ProfileDashboard({profileData})
{
    console.log(profileData)
    return (
        <div>
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Profile</h1>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                        <thead>
                        <tr>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500">Name</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500">Email</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500">Possible Violation</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500">Positive Violation</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500">Total Violation</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 border border-gray-300">
                            {
                                Object.values(profileData).map((pro) => (
                                    <tr key={pro.key} className="hover:bg-gray-100">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">{pro.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">{pro.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">{pro.violator.possible.length}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">{pro.violator.positive.length}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{pro.violator.positive.length + pro.violator.possible.length}</td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                </div>
            </main>
        </div>

    )
}