var button = document.getElementById("enter");
var input = document.getElementById("userinput");
var ul = document.querySelector("ul");

// console.log("hello");
// if (input.value.length > 10 ) {
//     document.ATTRIBUTE_NODE.
// }

function lengthofit(){
    return input.value.length;
}
function elementcreate(){
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(input.value));
    ul.appendChild(li);
    input.value = "";
}
function addclick(){
    if (lengthofit()>0) {
        elementcreate();
    }
}
function addkey(event){
    if (lengthofit()>0 && event.key === "Enter") {
        elementcreate();
    }
}

button.addEventListener("click",addclick);
input.addEventListener("keypress",addkey);