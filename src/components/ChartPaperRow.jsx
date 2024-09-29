import { useNavigate } from 'react-router-dom';

function ChartPaperRow({ paper, type }) {
  const navigate = useNavigate();
  console.log(type)

  const handleRowClick = () => {
    navigate(`/coidetails/${paper.key}`, 
    { 
      state: { 
        coi_data: paper,
        type: type
      } 
    });
  };

  return (
    <tr 
      key={paper.key} 
      className="hover:bg-gray-100 cursor-pointer"
      onClick={handleRowClick}
    >
      <td className="px-6 py-4 text-xs font-medium text-gray-800">
        {paper.author.length > 1 ? 
          paper.author[0].name + "[+" + (paper.author.length - 1).toString() + "]" : 
          paper.author[0].name
        }
      </td>
      <td className="px-6 py-4 text-xs font-medium text-gray-800">
        {paper.reviewer.length > 1 ? 
          paper.reviewer[0].name + "[+" + (paper.reviewer.length - 1).toString() + "]" : 
          paper.reviewer[0].name
          }
      </td>
    </tr>
  );
}

export default ChartPaperRow;
