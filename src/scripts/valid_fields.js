past_sub_fields = ['paper_id', 'author', 'metareviewers', 'most_recent_venue', 'submission_time']

meta_pc_fields = ['author', 'metareviewers', 'dblp_of_metareviewers', 'paper_ids', 
    'coauthorship_during_last_3_years', 'coauthorship_during_last_10_years', 
    'coauthorship_count_in_last_10_years', 'coauthorship_history', 'comments']

inst_fields = ['paper_id', 'authors', 'metareviewers', 'details_of_institutional', 
    'coidetails_of_possible', 'past_institutional_coi']

processFields = (inputString) => {
    // Lowercase the input string
    let result = inputString.toLowerCase();
    // Define the regular expression pattern for special characters
    const specialPattern = /[^a-zA-Z0-9\s]/g; // Pattern to match special characters
    // Replace special characters with an empty string
    result = result.replace(specialPattern, "");
    // Replace spaces with underscores
    result = result.replace(/ /g, "_");
    return result;
    }

areSimilarFields = (list1, list2) => {
    // Check if both lists have the same length
    if (list1.length !== list2.length) {
        return false;
    }
    // Sort both lists
    const sortedList1 = [...list1].sort();
    const sortedList2 = [...list2].sort();
    // Check if all items in both lists are the same
    for (let i = 0; i < sortedList1.length; i++) {
        if (sortedList1[i] !== sortedList2[i]) {
        return false;
        }
    }
    return true;
}
check_fields = (input_fields, valid_fields) => {
    // Input fields is provided by the imported file
    // Valid fields is provided by the name of file
    formatFields = input_fields.map(word => processFields(word));
    
    return areSimilarFields(formatFields, valid_fields);
}