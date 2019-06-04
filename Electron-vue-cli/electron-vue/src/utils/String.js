

function Trim(tempString) {  
    return tempString.replace(/(^\s*)|(\s*$)/g, "");
}

function LTrim(tempString) {  
    return tempString.replace(/(^\s*)/g, "");  
}

function RTrim(tempString) {  
    return tempString.replace(/(\s*$)/g, "");  
}

export {
    Trim,
    LTrim,
    RTrim
}