  export default function Sub_List( {coi_data} ) {
    return (
      <ul role="list" className="divide-y divide-gray-100">
        {coi_data.length === 0 && "No COI data retrieved"}
        {coi_data.map((data) => (
          <li key={data.pageId} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
                <p className="text-sm text-xs leading-6 text-gray-400">paper id</p>
                <p className="mt-1 truncate font-semibold  leading-5 text-gray-900">{data.pageId}</p>
              </div>
              <div className="min-w-0 flex-auto">
                <p className="text-sm text-xs leading-6 text-gray-400">author</p>
                <p className="mt-1 truncate font-semibold  leading-5 text-gray-900">{data.author}</p>
              </div>
              <div className="min-w-0 flex-auto">
                <p className="text-sm text-xs leading-6 text-gray-400">reviewer</p>
                <p className="mt-1 truncate font-semibold  leading-5 text-gray-900">{data.reviewer}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )
  }
  