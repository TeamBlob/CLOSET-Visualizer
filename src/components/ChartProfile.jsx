import { useState, useEffect } from 'react';
import ChartProfileRow from './ChartProfileRow';
import { buildTopProfile } from "../scripts/profile";

export default function ProfileChart({ profileData }) {
  const [topProfiles, setTopProfiles] = useState([]);
  const [sortBy, setSortBy] = useState('submission_count'); // Initial sort by submission count

  useEffect(() => {
    // Rebuild profiles based on the current sorting criteria
    setTopProfiles(buildTopProfile(profileData, sortBy).topProfiles);
  }, [profileData, sortBy]); // Re-run when profileData or sortBy changes

  // Toggle sort criteria when headers are clicked
  const handleSortBySubmission = () => setSortBy('submission_count');
  const handleSortByReviewer = () => setSortBy('reviewer_count');

  return (
    <>
      {topProfiles.length === 0 ? (
        <p className='py-1 font-medium'>No chart data available...</p>
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className='py-1 font-medium'>Top 5 Authors (Sorted by {sortBy === 'submission_count' ? 'Submission' : 'Reviewer'})</p>
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500">Author Name</th>
                <th
                  scope="col"
                  className="px-6 py-3 text-start text-xs font-medium text-gray-500 cursor-pointer"
                  onClick={handleSortBySubmission} // Sort by submission when clicked
                >
                  Submission Count
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-start text-xs font-medium text-gray-500 cursor-pointer"
                  onClick={handleSortByReviewer} // Sort by reviewer when clicked
                >
                  Reviewer Count
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 border border-gray-300">
              {topProfiles.map((profile, index) => (
                <ChartProfileRow key={index} pro={profile} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
