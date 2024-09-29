import ChartPaperRow from './ChartPaperRow'

export default function PaperView({selectedPaper}) {
    return (
      <>
        {!selectedPaper ? (
          <p>Select a paper...</p>
        ) : (
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <p className="text-sm">Paper: {selectedPaper.group}</p>
                <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead>
                        <tr>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500">Author</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500">Reviewer</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 border border-gray-300">
                        
                        {selectedPaper.paper.map((paper) => (
                            <ChartPaperRow key={paper.key} paper={paper.coi_data} type={paper.type}/>)
                        )}
                    </tbody>
                </table>
            </div>
        )}
      </>
    );
}