import { useState } from 'react';

export default function ReasonPanel({violation}) {
  console.log(violation)
  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Author</th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Reviewer</th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">John Brown</td>
                  <td className="px-6 py-4 text-sm text-gray-800">45</td>
                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-normal">New York No. 1 Lake Park</td>
                </tr>

                <tr className="hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">Jim Green</td>
                  <td className="px-6 py-4 text-sm text-gray-800">27</td>
                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-normal">London No. 1 Lake Park</td>
                </tr>

                <tr className="hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">Joe Black</td>
                  <td className="px-6 py-4 text-sm text-gray-800">31</td>
                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-normal">Sidney No. 1 Lake Park</td>
                </tr>

                <tr className="hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">Edward King</td>
                  <td className="px-6 py-4 text-sm text-gray-800">16</td>
                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-normal">LA No. 1 Lake Park</td>
                </tr>

                <tr className="hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">Jim Red</td>
                  <td className="px-6 py-4 text-sm text-gray-800">45</td>
                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-normal">Melbourne No. 1 Lake Park</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
