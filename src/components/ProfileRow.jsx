import { useNavigate } from 'react-router-dom';

function ProfileRow({ pro }) {
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate(`/profiledetails/${pro.key}`, { state: { profile: pro } });
  };

  return (
    <tr 
      key={pro.key} 
      className="hover:bg-gray-100 cursor-pointer"
      onClick={handleRowClick}
      title={`Paper IDs: ${pro.paper} - Click to see details`}
    >
      <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
        {pro.name}
      </td>
      <td className="px-6 py-4 text-sm text-gray-800">{pro.email}</td>
      <td className="px-6 py-4 text-sm text-gray-800">
        {pro.paper.size}
      </td>
      <td className="px-6 py-4 text-sm text-gray-800">
        {pro.reviewer.size}
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-800">
        {pro.violator.positive.length + pro.violator.possible.length}
      </td>
    </tr>
  );
}

export default ProfileRow;
