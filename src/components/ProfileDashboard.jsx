import { useState } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "flowbite-react";

export default function ProfileDashboard({ profileData }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Calculate the current items to display based on the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = Object.values(profileData).slice(startIndex, endIndex);
    const totalPages = Math.ceil(Object.values(profileData).length / itemsPerPage);
    const onPageChange = (page) => setCurrentPage(page);

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
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead>
                <tr>
                <th
                    scope="col"
                    className="px-6 py-3 text-start text-xs font-medium text-gray-500"
                >
                    Name
                </th>
                <th
                    scope="col"
                    className="px-6 py-3 text-start text-xs font-medium text-gray-500"
                >
                    Email
                </th>
                <th
                    scope="col"
                    className="px-6 py-3 text-start text-xs font-medium text-gray-500"
                >
                    Possible Violation
                </th>
                <th
                    scope="col"
                    className="px-6 py-3 text-start text-xs font-medium text-gray-500"
                >
                    Positive Violation
                </th>
                <th
                    scope="col"
                    className="px-6 py-3 text-start text-xs font-medium text-gray-500"
                >
                    Total Violation
                </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 border border-gray-300">
                {currentItems.map((pro) => (
                <tr key={pro.key} className="hover:bg-gray-100">
                    <Link
                    to={{ pathname: `/profiledetails/${pro.key}` }}
                    state={{ profile: pro }}
                    className="flex min-w-0 gap-x-4"
                    >
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                        {pro.name}
                    </td>
                    </Link>
                    <td className="px-6 py-4 text-sm text-gray-800">
                    {pro.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                    {pro.violator.possible.length}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                    {pro.violator.positive.length}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {pro.violator.positive.length + pro.violator.possible.length}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
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
        </main>
    </div>
    );
}
