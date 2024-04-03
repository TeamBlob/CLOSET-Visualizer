import { useLocation } from "react-router-dom";
import { buildGraph } from "../scripts/graph"
import GraphUI from "./GraphUI"
import SidePanel from "./SidePanel";
import { useState, useEffect } from "react";



export default function COIMetaData(){
    const location = useLocation();
    const state  = location.state;
    const [open, setOpen] = useState(false)

    if (!state) {
        // Handle case when jsonData is null or undefined
        return <div>No data available</div>;
    } 
    const coi_data = state.coi_data;
    const [graph, setGraph] = useState({});

    useEffect(() => {
        if (state) {
            setGraph(buildGraph(state.coi_data));
        }
    }, [state]); // Only run when state changes

    function showGraph() {
        setOpen(true);
    }

    return (
        <div>
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex space-x-4">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{'Page ID: ' + coi_data.pageId}</h1>
                    <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow"
                            onClick={() => showGraph()}>
                        View Graph
                    </button>
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
                <SidePanel open={open} setOpen={setOpen}graph={graph}/>
            </main>
        </div>
    )
}