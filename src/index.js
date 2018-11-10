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
    xhr.open("GET", server + method, false);
    xhr.send();
}

function createCategoryTemplate() {
    var template = document.createElement("li");
    return template;
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
        view.innerHTML = categories[i].name;
        document.getElementById("categories").appendChild(view);
    }
}

function insertProducts(products) {
    for (let i = 0; i < products.length; i++) {
        const view = productTemplate.cloneNode();
        view.innerHTML = products[i].name;
        document.getElementById("products").appendChild(view);
    }
}

window.onload = function () {
    load(SERVER_NAME, "api/category/list", insertCategories);
    load(SERVER_NAME, "api/product/list", insertProducts);
}


