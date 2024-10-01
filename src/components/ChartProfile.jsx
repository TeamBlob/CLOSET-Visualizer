import ChartProfileRow from './ChartProfileRow'

export default function ProfileChart({topProfiles}) {
    return (
      <>
        {!topProfiles ? (
          <p className='py-1 font-medium'>No chart data available...</p>
        ) : (
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <p className='py-1 font-medium'>Top 5 Author (By Submission)</p>
                <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead>
                        <tr>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500">Author Name</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500">Submission Count</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500">Reviewer Count</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 border border-gray-300">
                        {topProfiles.map((profile) => (
                            <ChartProfileRow key={profile.key} pro={profile} />)
                        )}
                    </tbody>
                </table>
            </div>
        )}
      </>
    );
}