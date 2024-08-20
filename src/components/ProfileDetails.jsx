import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ViolationTable } from "./ProfileViolationDetails";

export default function ProfileDetails() {
    const location = useLocation();
    const [profile, setProfile] = useState({});
    const [positive, setPositive] = useState([]);
    const [possible, setPossible] = useState([]);

    useEffect(() => {
        if (location.state.profile) {
            setProfile(location.state.profile);
            if (location.state.profile.violator){
                setPositive(location.state.profile.violator.positive)
                setPossible(location.state.profile.violator.possible)
            }
            console.log('location', location.state.profile);


        }
        
    }, [location.state]); // Only run when state changes

    if (!location.state) {
        // Handle case when location.state is null or undefined
        return <div>No data available</div>;
    }

    return (
        <>
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{profile.name}</h1>
                </div>
            </header>
            <div className="flex flex-col min-h-screen p-4">
                {/* Circle Section */}
                <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-y-0 md:space-x-8">
                    <div key={1} className="relative w-24 h-24 bg-gray-300 rounded-full flex flex-col items-center justify-center text-gray-700">
                        <div className="absolute top-1/2 transform -translate-y-1/2 text-sm md:text-lg">
                            {profile.author}
                        </div>
                        <div className="absolute bottom-2 text-xs md:text-base text-gray-900">
                            Author
                        </div>
                    </div>
                    <div key={2} className="relative w-24 h-24 bg-gray-300 rounded-full flex flex-col items-center justify-center text-gray-700">
                        <div className="absolute top-1/2 transform -translate-y-1/2 text-sm md:text-lg">
                            {profile.reviewer}
                        </div>
                        <div className="absolute bottom-2 text-xs md:text-base text-gray-900">
                            Review
                        </div>
                    </div>
                    <div key={3} className="relative w-24 h-24 bg-gray-300 rounded-full flex flex-col items-center justify-center text-gray-700">
                        <div className="absolute top-1/2 transform -translate-y-1/2 text-sm md:text-lg">
                            {positive.length}
                        </div>
                        <div className="absolute bottom-2 text-xs md:text-base text-gray-900">
                            Positive
                        </div>
                    </div>
                    <div key={4} className="relative w-24 h-24 bg-gray-300 rounded-full flex flex-col items-center justify-center text-gray-700">
                        <div className="absolute top-1/2 transform -translate-y-1/2 text-sm md:text-lg">
                            {possible.length}
                        </div>
                        <div className="absolute bottom-2 text-xs md:text-base text-gray-900">
                            Possible
                        </div>
                    </div>
                </div>

                {/* Separator Line */}
                <div className="w-full border-t-2 border-gray-300 my-4"></div>

                {/* Tables Section */}
                <div className="flex flex-col md:flex-row md:space-x-8 w-full flex-grow gap-4">
                    <div className="flex-1">
                        <ViolationTable type="Positive" data={positive}/>
                    </div>
                    <div className="flex-1">
                        <ViolationTable type="Possible" data={possible}/>
                    </div>
                </div>
            </div>
        </>
    );
}
