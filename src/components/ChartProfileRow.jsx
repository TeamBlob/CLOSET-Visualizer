import { useNavigate } from 'react-router-dom';

function ChartProfileRow({ key, pro }) {
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate(`/profiledetails/${pro.key}`, { state: { profile: pro.profileData } });
  };

  return (
    <tr 
      key={key} 
      className="hover:bg-gray-100 cursor-pointer"
      onClick={handleRowClick}
      title={`Paper IDs: ${pro.profileData.paper} - Click to see details`}
    >
      <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
        {pro.name}
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-800">
        {pro.count}
      </td>
    </tr>
  );
}

export default ChartProfileRow;
