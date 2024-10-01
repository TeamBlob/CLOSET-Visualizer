import { useState, useEffect, useMemo } from "react";
import { Pagination } from "flowbite-react";
import ProfileRow from "./ProfileRow";
import BarChart from './ChartBar.jsx'
import { buildSubmissionProfileGraph, buildReviewerProfileGraph } from '../scripts/dashboard_profile.js'

export default function ProfileDashboard({ profileData }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [chartSubmissionSetting, setChartSubmissionSetting] = useState({});
    const [chartReviewerSetting, setChartReviewerSetting] = useState({});
    const itemsPerPage = 10;

    // Memoize current items to prevent unnecessary recalculations
    const currentItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return Object.values(profileData).slice(startIndex, endIndex);
    }, [profileData, currentPage]);

    const totalPages = Math.ceil(Object.values(profileData).length / itemsPerPage);
    const onPageChange = (page) => setCurrentPage(page);

    useEffect(() => {
        // Rebuild chart settings only when currentItems change
        setChartSubmissionSetting(buildSubmissionProfileGraph(currentItems));
        setChartReviewerSetting(buildReviewerProfileGraph(currentItems));
    }, [currentItems]);

    return (
        <div>
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Profile Dashboard
                    </h1>
                </div>
            </header>
            <main>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex justify-between space-x-4">
                    {/* First Bar Chart (Submission Profile) */}
                    <div className="flex-1">
                        <BarChart chartSetting={chartSubmissionSetting} />
                    </div>

                    {/* Second Bar Chart (Reviewer Profile) */}
                    <div className="flex-1">
                        <BarChart chartSetting={chartReviewerSetting} />
                    </div>
                </div>
                
                {totalPages > 1 && (
                    <div className="flex overflow-x-auto sm:justify-center mt-4">
                        <Pagination
                            layout="navigation"
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                            showIcons
                        />
                    </div>
                )}
            </div>
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <p className='py-1 font-medium'>Details of Authors</p>
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                        <thead>
                            <tr>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500">Author Name</th>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500">Email</th>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500">Submission Count</th>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500">Reviewer Count</th>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500">Total Violation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 border border-gray-300">
                            {currentItems.map((pro) => (
                                <ProfileRow key={pro.key} pro={pro} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
