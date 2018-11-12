import './scss/main.scss';

const SERVER_NAME = "http://nit.tron.net.ua/";
var CATEGORY_TEMPLATE;
var PRODUCT_TEMPLATE;

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

function load(server, method, onLoad, onLoadArguments) {
    const xhr = createXHR();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            onLoadArguments.push(JSON.parse(this.responseText));
            onLoad.apply(null, onLoadArguments);
        }
    };
    xhr.open("GET", server + method, true);
    xhr.send();
}

function fillProduct(product) {
    var view = PRODUCT_TEMPLATE.content.cloneNode(true);
    var link = view.getElementById("product-name-link");
    link.onclick = function () {
        showProductView(product);
    };
    link.innerHTML = product.name;
    return view;
}

function fillCategory(category) {
    var view = CATEGORY_TEMPLATE.content.cloneNode(true);
    var link = view.getElementById("category-name-link");
    link.onclick = function () {
        load(SERVER_NAME, "api/product/list/category/" + category.id, insertTemplatedContent,
            [document.getElementById("products"), fillProduct]);
    };
    link.innerHTML = category.name;
    return view;
}

function insertTemplatedContent(container, fill, array) {
    container.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        container.appendChild(fill(array[i]));
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
    CATEGORY_TEMPLATE = document.getElementById("category-template");
    PRODUCT_TEMPLATE = document.getElementById("product-template");
    load(SERVER_NAME, "api/category/list", insertTemplatedContent,
        [document.getElementById("categories"), fillCategory]);
    load(SERVER_NAME, "api/product/list", insertTemplatedContent,
        [document.getElementById("products"), fillProduct]);
    setupProductView();
};


