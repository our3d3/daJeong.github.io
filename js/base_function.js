function toDark(){
    window.localStorage.setItem("theme", "dark");
    document.body.setAttribute("theme", "dark");
    document.getElementById("light").style.display = "none";
    document.getElementById("dark").style.display = "flex";
}

function toLight(){
    window.localStorage.setItem("theme", "light");
    document.body.setAttribute("theme", "light");
    document.getElementById("dark").style.display = "none";
    document.getElementById("light").style.display = "flex";
}

let theme = window.localStorage.getItem("theme");
document.body.setAttribute("theme", theme);
if(theme == "light"){
    toLight();
}else{
    toDark();
}
