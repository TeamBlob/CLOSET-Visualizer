import { useState } from "react";
import { Pagination } from "flowbite-react";
import { Link } from "react-router-dom";

export default function Sub_List({ coi_data, type }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate the current items to display based on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = coi_data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(coi_data.length / itemsPerPage)
  const onPageChange = (page) => setCurrentPage(page);

  return (
    <>
      <div>
        <ul role="list" className="divide-y divide-gray-100">
          {currentItems.length === 0 && "No COI data retrieved"}
          {currentItems.map((data) => (
            <li key={data.key} className="flex justify-between gap-x-6 py-5">
              <Link
                to={{ pathname: `/coidetails/${data.key}` }}
                state={{ coi_data: data, type: type }}
                className="flex min-w-0 gap-x-4"
              >
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm text-xs leading-6 text-gray-400">
                      paper id
                    </p>
                    <p className="mt-1 truncate font-semibold leading-5 text-gray-900">
                      {data.pageId}
                    </p>
                  </div>
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm text-xs leading-6 text-gray-400">
                      author
                    </p>
                    <p className="mt-1 truncate font-semibold leading-5 text-gray-900">
                      {data.author.length > 1
                        ? data.author[0].name +
                          "[+" +
                          (data.author.length - 1).toString() +
                          "]"
                        : data.author[0].name}
                    </p>
                  </div>
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm text-xs leading-6 text-gray-400">
                      reviewer
                    </p>
                    <p className="mt-1 truncate font-semibold leading-5 text-gray-900">
                      {data.reviewer.length > 1
                        ? data.reviewer[0].name +
                          "[+" +
                          (data.reviewer.length - 1).toString() +
                          "]"
                        : data.reviewer[0].name}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {totalPages > 1 && (
        <div className="flex overflow-x-auto sm:justify-center">
          <Pagination
            layout="navigation"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            showIcons
          />
        </div>
      )}
    </>
  );
}
