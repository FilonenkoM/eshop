import './scss/main.scss';
const SERVER_NAME = "http://nit.tron.net.ua/";
function createXHR() {
    try {
        return new XMLHttpRequest();
    } catch(e) {
        try {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } catch(e) {
            return new ActiveXObject("Msxml2.XMLHTTP");
        }
    }
}
function loadCategories(server, method) {
    const xhr = createXHR();
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            document.getElementById("test").innerHTML = this.responseText;
        }
    }
    xhr.open("GET", server + method, false);
    xhr.send();
}
window.onload = function() {
    loadCategories(SERVER_NAME, "api/category/list");
}
