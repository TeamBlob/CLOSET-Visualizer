import { useLocation } from "react-router-dom";
import { buildGraph } from "../scripts/graph"
import { constructUIJson } from "../scripts/violation_ui_structure";
import { useState, useEffect } from "react";
import GraphUI from './GraphUI';
import ReasonPanel from './COIReason';



export default function COIMetaData(){
    const location = useLocation();
    const state  = location.state;
    const [graph, setGraph] = useState(null);
    const [violation, setViolation] = useState(null);
    if (!state) {
        // Handle case when jsonData is null or undefined
        return <div>No data available...</div>;
    } 
    const coi_data = state.coi_data;

    useEffect(() => {
        console.log(state)
        if (state) {
            setGraph(buildGraph(state.coi_data));
            setViolation(constructUIJson(state.coi_data, state.type))
        }
    }, [state]); // Only run when state changes

    return (
        <div>
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex-col">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{'Page ID: ' + coi_data.pageId}</h1>
                    <p className="text-xs font-light text-gray-500">{'File: ' + coi_data.filename}</p>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-base font-semibold leading-7 text-gray-900">Author</h3>
                    </div>
                    <table className="min-w-full bg-white shadow-md rounded my-6">
                        <thead>
                            <tr className="bg-gray-800 text-white uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-left">Email</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {coi_data.author.map(a => (
                                <tr key={a.key} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left whitespace-nowrap">{a.name}</td>
                                    <td className="py-3 px-6 text-left">{a.email}</td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                </div>
            </main>
            <main>
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-base font-semibold leading-7 text-gray-900">Reviewer</h3>
                    </div>
                    <table className="min-w-full bg-white shadow-md rounded my-6">
                        <thead>
                            <tr className="bg-gray-800 text-white uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-left">Email</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {coi_data.reviewer.map(a => (
                                <tr
                                    key={a.key}
                                    className="border-b border-gray-200 hover:bg-gray-100"
                                    onClick={() => window.open(a.url, "_blank", "noopener noreferrer")}
                                    style={{ cursor: a.url ? 'pointer' : 'default' }}
                                 >
                                    <td className="py-3 px-6 text-left whitespace-nowrap">
                                        {a.name}
                                    </td>
                                    <td className="py-3 px-6 text-left">{a.email}</td>
                              </tr>
                            ))}
                        </tbody>
                        </table>
                </div>
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="px-4 sm:px-0">
                      <p className="text-base font-semibold leading-6 text-gray-900">Violation Details</p>
                    </div>
                    <div className="flex-1 flex flex-col">
                        {graph && <GraphUI graph={graph} className="flex-1" />}
                    </div>
                    <div className="flex-1 flex flex-col">
                        {violation && <ReasonPanel violation={violation} className="flex-1" />}
                    </div>
                </div>
            </main>
        </div>
    )
}