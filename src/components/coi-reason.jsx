export default function ReasonPanel({violation}) {
  const PositiveInstReason = (reason) => {
    return (
        <tr key={0} className="hover:bg-gray-100">
            <td className="px-6 py-4 text-sm font-medium text-gray-800">{reason.authorName}</td>
            <td className="px-6 py-4 text-sm text-gray-800">{reason.reviewerName}</td>
            <td className="px-6 py-4 text-sm text-gray-800 whitespace-normal">{reason.institution}</td>
        </tr>
    );
  }

  const PossibleInstReason = (reason) => {
      return (
          <tr key={0} className="hover:bg-gray-100">
              <td className="px-6 py-4 text-sm font-medium text-gray-800">{reason.authorName}</td>
              <td className="px-6 py-4 text-sm text-gray-800">
                <ul>
                  {reason.authorInst.map(data => (
                    <li className="list-item-with-dash" key={data}>
                      {data}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-800">{reason.reviewerName}</td>
              <td className="px-6 py-4 text-sm text-gray-800">                
              <ul>
                {reason.reviewerInst.map(data => (
                  <li className="list-item-with-dash" key={data}>
                    {data}
                  </li>
                ))}
              </ul>

              </td>
              <td className="px-6 py-4 text-sm text-gray-800 whitespace-normal">
                <ul>
                  {reason.similarity.map(data => (
                    <li className="list-item-with-dash" key={data}>
                      {data}
                    </li>
                  ))}
                </ul>
              </td>
          </tr>
      );
  }

  const HistoryTable = ({ history }) => {
    return (
      
        <tbody>
          {history.flags.map((record, index) => (
            <tr key={record.key} className="hover:bg-gray-100">
              {index === 0 && (
                <td rowSpan={history.flags.length} className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">{history.name}</td>
              )}
              <td className="px-6 py-4 text-sm text-gray-800">{record[0]}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{record[1]}</td>
            </tr>
          ))}
        </tbody>
      
    );
  };

  const MetaPCReason = (reason) => {
    return (
        <tr className="hover:bg-gray-100">
            <td className="px-6 py-4 text-sm font-medium text-gray-800">{reason.authorName}</td>
            <td className="px-6 py-4 text-sm font-medium text-gray-800">{reason.reviewerName}</td>
            <td>  
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                <thead>
                  <tr key={0}>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500">Name</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500">Year</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500">Count</th>
                  </tr>
                </thead>
                  {reason.history.map(data => (
                    <HistoryTable history={data}/>
                  ))}
              </table>
              </td>
            <td className="px-6 py-4 text-sm text-gray-800 whitespace-normal">{reason.comment}</td>
        </tr>
    );
  }

  const PastSubReason = (reason) => {
    return (
        <tr className="hover:bg-gray-100">
            <td className="px-6 py-4 text-sm font-medium text-gray-800">{reason.authorName}</td>
            <td className="px-6 py-4 text-sm font-medium text-gray-800">{reason.reviewerName}</td>
            <td className="px-6 py-4 text-sm text-gray-800 whitespace-normal">{reason.recent_venue}</td>
            <td className="px-6 py-4 text-sm text-gray-800 whitespace-normal">{reason.submission}</td>
        </tr>
    );
  }




  const coiFunction = {
      "positive_inst": {
        build: PositiveInstReason
      },
      "possible_inst": {
        build: PossibleInstReason
      },
      "meta_pc": {
        build: MetaPCReason
      },
      "past_sub": {
        build: PastSubReason
      }
    }
  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead >
                <tr>
                    {violation.header.map((header, index) => (
                        <th key={index} scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">{header}</th>
                    ))}
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 border border-gray-300">

                {violation.dataset.map(data => (
                        coiFunction[violation.type].build(data)
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
