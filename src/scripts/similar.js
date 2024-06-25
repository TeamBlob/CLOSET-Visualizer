export function similar(str1, str2) // Used to check the similarity between two individual
{
    str1 = str1 + ' '.repeat(Math.max(0, str2.length - str1.length));
    str2 = str2 + ' '.repeat(Math.max(0, str1.length - str2.length));
    let count = 0;
    for (let i = 0; i < str1.length; i++) {
        if (str1[i] === str2[i]) {
            count++;
        }
    }
    return count / str1.length;
}