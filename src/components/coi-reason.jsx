import { useState, useEffect } from "react";


export default function ReasonPanel({violation}) {
  const PositiveInstReason = (reason) => {
    return (
        <tr className="hover:bg-gray-100">
            <td className="px-6 py-4 text-sm font-medium text-gray-800">{reason.authorName}</td>
            <td className="px-6 py-4 text-sm text-gray-800">{reason.reviewerName}</td>
            <td className="px-6 py-4 text-sm text-gray-800 whitespace-normal">{reason.institution}</td>
        </tr>
    );
  }

  const PossibleInstReason = (reason) => {
      return (
          <tr className="hover:bg-gray-100">
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
  const MetaPCReason = (reason) => {
    console.log(reason.history)
    return (
        <tr className="hover:bg-gray-100">
            <td className="px-6 py-4 text-sm font-medium text-gray-800">{reason.authorName}</td>
            <td className="px-6 py-4 text-sm font-medium text-gray-800">{reason.reviewerName}</td>
            <td className="px-6 py-4 text-sm text-gray-800">{                <ul>
                  {reason.history.map(data => (
                    <li className="list-item-with-dash" key={data}>
                      {data[0]}
                    </li>
                  ))}
                </ul>}</td>
            <td className="px-6 py-4 text-sm text-gray-800 whitespace-normal">{reason.comment}</td>
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
      "metapc": {
        build: MetaPCReason
      }
    }
  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                    {violation.header.map(header => (
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">{header}</th>
                    ))}
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
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
