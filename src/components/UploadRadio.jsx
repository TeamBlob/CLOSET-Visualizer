const UploadRadioComponent = ({selectedOption, setSelectedOption}) => {

    const handleRadioChange = (event) => {
        setSelectedOption(event.target.value);
        console.log(event.target.value)
    };

    return (
        <div className="flex pl-10">
            <div className="flex items-center me-4">
                <input 
                    id="inline-radio" 
                    type="radio" 
                    value="published" 
                    name="inline-radio-group" 
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                    checked={selectedOption === "published"}
                    onChange={handleRadioChange}
                />
                <label 
                    htmlFor="inline-radio" 
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Published (Without <span className="font-semibold">All-</span> prefix)
                </label>
            </div>
            <div className="flex items-center me-4">
                <input 
                    id="inline-2-radio" 
                    type="radio" 
                    value="unpublished" 
                    name="inline-radio-group" 
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                    checked={selectedOption === "unpublished"}
                    onChange={handleRadioChange}
                />
                <label 
                    htmlFor="inline-2-radio" 
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Unpublished (With <span className="font-semibold">All-</span> prefix)
                </label>
            </div>
        </div>
    );
};

export default UploadRadioComponent;
