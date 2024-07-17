// Function to calculate similarity score (number of matching words)
function calculateSimilarityScore(str1, str2) {
    const words1 = str1.toLowerCase().split(' ');
    const words2 = str2.toLowerCase().split(' ');
    
    let score = 0;
    words1.forEach(word1 => {
        if (words2.includes(word1)) {
            score++;
        }
    });
    
    return score;
}

// Function to find the most similar item from list2 for each item in list1
export const similar = (list1, list2) => {
    let maxScore = -1;
    let mostSimilarPair = null;
    
    list1.forEach(item1 => {
        list2.forEach(item2 => {
            const score = calculateSimilarityScore(item1, item2);
            if (score > maxScore) {
                maxScore = score;
                mostSimilarPair = { item1, item2 };
            }
        });
    });
    
    return mostSimilarPair;
}