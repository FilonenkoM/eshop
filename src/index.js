import './scss/main.scss';

const SERVER_NAME = "http://nit.tron.net.ua/";

function createXHR() {
    try {
        return new XMLHttpRequest();
    } catch (e) {
        try {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
            return new ActiveXObject("Msxml2.XMLHTTP");
        }
    }
}

function load(server, method, onLoad) {
    const xhr = createXHR();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            onLoad(JSON.parse(this.responseText));
        }
    }
    xhr.open("GET", server + method, true);
    xhr.send();
}

function createCategoryTemplate() {
    var template = document.createElement("li");
    return template;
}
function message() {
    alert("hello");
}
var categoryTemplate = createCategoryTemplate();

function createProductTemplate() {
    var template = document.createElement("li");
    return template;
}
var productTemplate = createProductTemplate();

function insertCategories(categories) {
    for (let i = 0; i < categories.length; i++) {
        const view = categoryTemplate.cloneNode();
        view.onclick = function() {
            const id = categories[i].id;
            load(SERVER_NAME, "api/product/list/category/" + id, insertProducts);
        }
        view.innerHTML = "<a href='#'>" + categories[i].name + "</a>";
        document.getElementById("categories").appendChild(view);
    }
}

function insertProducts(products) {
    let container = document.getElementById("products");
    container.innerHTML = "";
    for (let i = 0; i < products.length; i++) {
        const view = productTemplate.cloneNode();
        view.onclick = function() {
            showProductView(products[i]);
        }
        view.innerHTML = "<a href='#'>" +  products[i].name + "</a>";
        container.appendChild(view);
    }
}
function showProductView(product) {
    document.getElementById("list-view").style.display = "none";
    const view = document.getElementById("product-view");
    view.style.display = "block";
    document.getElementById("product-view-name").innerHTML = product.name;
}
function showListView() {
    document.getElementById("product-view").style.display = "none";
    document.getElementById("list-view").style.display = "block";
}
function setupProductView() {
    document.getElementById("back-button").onclick = showListView;
}
window.onload = function () {
    load(SERVER_NAME, "api/category/list", insertCategories);
    load(SERVER_NAME, "api/product/list", insertProducts);
    setupProductView();
}


