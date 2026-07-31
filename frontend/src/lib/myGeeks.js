function myGeeks() {

    // Input string
    let str = "34 minutes";
    console.log(str)

    // Using match with regEx
    let matches = str.match(/(\d+)/);
    
    // Display output if number extracted
    if (matches) {
        console.log(matches[0]);
    }
}