// No False Positive
const past_sub_fields = ['paper_id', 'author', 'metareviewers', 'most_recent_venue', 'submission_time']

// May contain False Positive
const inst_fields = ['paper_id', 'authors', 'metareviewers', 'details_of_institutional_coi', 
    'details_of_possible_past_institutional_coi']

const meta_pc_fields = ['author', 'metareviewers', 'dblp_of_metareviewers', 'paper_ids', 
    'coauthorship_during_last_3_years', 'coauthorship_during_last_10_years', 
    'coauthorship_count_in_last_10_years', 'coauthorship_history', 'comments']

const allValidFields = [['pastsub', past_sub_fields], ['inst', inst_fields], ['meta_pc', meta_pc_fields]]

const processFields = (inputString) => {
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

const areSimilarFields = (list1, list2) => {
    // Check if both lists have the same length
    if (list1.length !== list2.length) {
        return false;
    }
    // Check if all items in both lists are the same
    for (let i = 0; i < list1.length; i++) {
        if (list1[i] !== list2[i]) {
        return false;
        }
    }
    return true;
}


export const checkFields = (input_fields) => {
    // Input fields is provided by the imported file
    const formatFields = input_fields.map(word => processFields(word));
    for (let i = 0; i < allValidFields.length; i++) {

        let result = areSimilarFields(formatFields, allValidFields[i][1]);
        if (result == true){
            return allValidFields[i][0]
        }
    }
    return null
}