function saveCanvas(){
    let canvas = document.getElementById("Canvas");
    let download = document.createElement("a");

    download.href = canvas.toDataURL();
    download.download = "mycanvas.png";
    download.click();

    location.href = "../index.html";
}

function exitCanvas(){
    alert("해당 캔버스는 저장되지 않습니다. 나가시겠습니까?");
    location.href = "../index.html";
}

