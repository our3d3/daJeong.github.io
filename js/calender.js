let today = new Date();
let curYear;
let curMonth;
let curDate;

function CreateDays(){
    let obj = document.querySelector(".dates");
    let title = document.querySelector(".year-month");
    
    let startMonth = new Date(today.getFullYear(), today.getMonth());
    let endMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    let endDate = endMonth.getDate();
    let startDay = startMonth.getDay();
    let endDay = endMonth.getDay();
    curYear = today.getFullYear();
    curMonth = today.getMonth();
    curDate = today.getDate();

    dateID = String(curYear) + String(curMonth + 1).padStart(2, "0");

    title.innerHTML += '<div><h1>' + curYear + '년 ' + (curMonth+1) + '월</h1></div>'
    blank1(obj, startDay);
    insertDate(obj, endDate, dateID, today);
    blank2(obj, endDay);
}

function NextMonth(){
    let obj = document.querySelector(".dates");
    let title = document.querySelector(".year-month");

    curMonth++;
    if(curMonth > 11){
        curYear++;
        curMonth = 0;
    }

    let startDay = new Date(curYear, curMonth).getDay();
    let endMonth = new Date(curYear, curMonth + 1, 0);
    let endDate = endMonth.getDate();
    let endDay = endMonth.getDay();

    title.innerHTML = '<div><h1>' + curYear + '년 ' + (curMonth+1) + '월</h1></div>'
    obj.innerHTML = ''

    dateID = String(curYear) + String(curMonth + 1).padStart(2, "0");

    blank1(obj, startDay);
    insertDate(obj, endDate, dateID, today);
    blank2(obj, endDay);
}

function PrevMonth(){
    let obj = document.querySelector(".dates");
    let title = document.querySelector(".year-month");

    curMonth--;
    if(curMonth < 0){
        curYear--;
        curMonth = 11;
    }

    let startDay = new Date(curYear, curMonth).getDay();
    let endMonth = new Date(curYear, curMonth + 1, 0);
    let endDate = endMonth.getDate();
    let endDay = endMonth.getDay();

    title.innerHTML = '<div><h1>' + curYear + '년 ' + (curMonth+1) + '월</h1></div>'
    obj.innerHTML = ''

    dateID = String(curYear) + String(curMonth + 1).padStart(2, "0");

    blank1(obj, startDay);
    insertDate(obj, endDate, dateID, today);
    blank2(obj, endDay);
}

let insertDate = (obj, endDate, yearMon, today) => {
    let tYear = today.getFullYear();
    let tMon = today.getMonth();
    for(var i = 1; i <= endDate; i++){
        if(tYear == curYear && tMon == curMonth && curDate == i){
            obj.innerHTML += '<div class="date" id="' + dateID + `" style="background-color: red;" onclick="show(this.id)">` + i + '</div>';
        }else{
            let day = String(i).padStart(2, '0');
            dateID = yearMon + day;
            obj.innerHTML += '<div class="date" id="' + dateID + '" onclick="show(this.id)">' + i + '</div>';
        }
    }
}
let blank1 = (obj, startDay) => {for(var i = 0; i < startDay; i++) obj.innerHTML += '<div class="date"></div>';}
let blank2 = (obj, endDay) => {for(var i = 0; i < 6 - endDay; i++) obj.innerHTML += '<div class="date"></div>';}

function show(dateID){
    window.localStorage.setItem("select-date", dateID);
    document.getElementById("fadeout").style.display = "flex";
    document.getElementById("fadein").style.display = "flex";
}

function hide(){
    document.getElementById("fadeout").style.display = "none";
    document.getElementById("fadein").style.display = "none";
}

function goMemo(dateID){
    let notetype = document.getElementsByName("note-sel");
    for(let i = 0; i < notetype.length; i++){
        if(notetype[i].checked){
            window.localStorage.setItem("notetype", notetype[i].value);
            break;
        }
    }
    location.href = "./page/memo.html";
}