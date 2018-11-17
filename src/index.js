import './scss/main.scss';

const SERVER_NAME = "http://nit.tron.net.ua/";
const CATEGORY_TEMPLATE = document.getElementById("category-template");
const PRODUCT_TEMPLATE = document.getElementById("product-template")
const TOKEN = "Y96gIp0vkAZpHhh1L3iI";
var cartTable = document.getElementById("cart-view-table");
var itemsInCart = [];
var countOfItemsInCart = [];
var categoriesCount = 0;

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

function load(server, method, onLoad, onLoadArguments = []) {
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
    view.getElementById("product-container").onclick = function () {
        showProductView(product);
    };
    link.innerHTML = product.name;
    view.getElementById("product-image").src = product.image_url;
    view.getElementById("product-price").innerHTML = product.price;
    view.getElementById("product-special-price").innerHTML = product.special_price;
    view.getElementById("add-to-cart").onclick = function (e) {
        e.stopPropagation();
        showCartView();
        addRowToCartTable(cartTable, product);
    }
    return view;
}

function addRowToCartTable(table, product) {
    if (!itemsInCart.includes(product.id)) {
        itemsInCart.push(product.id);
        countOfItemsInCart.push(1);
        var row = cartTable.insertRow(cartTable.rows.length);
        row.insertCell(0).innerHTML = product.name;
        row.insertCell(1).innerHTML = product.price;
        row.insertCell(2).innerHTML = "1";
        row.insertCell(3).innerHTML = "Видалити";
    }
}

function fillCategory(category) {
    categoriesCount ++;
    var view = CATEGORY_TEMPLATE.content.cloneNode(true);
    var nameField = view.querySelector(".category-name");
    nameField.onclick = function () {
        load(SERVER_NAME, "api/product/list/category/" + category.id, insertTemplatedContent,
            [document.getElementById("products"), fillProduct])
    };
    nameField.innerHTML = category.name;
    return view;
}

function insertTemplatedContent(container, fill, array) {
    container.innerHTML = "";
    for(let i=array.length-1;i>=0;i--) {
        container.insertBefore(fill(array[i]), container.children[0]);
    }
}

function post(server, method, params) {
    var xhr = createXHR();
    console.log(server + method);
    console.log(params.getAll());
    xhr.open("POST", server + method);
    xhr.send(params);
}

function showProductView(product) {
    document.getElementById("products").style.display = "none";
    const view = document.getElementById("product-view");
    view.style.display = "block";
    document.getElementById("product-view-name").innerHTML = product.name;
    document.getElementById("product-view-image").src = product.image_url;
    document.getElementById("product-view-price").innerText = product.price;
    document.getElementById("product-view-special-price").innerHTML = product.special_price;
    document.getElementById("product-view-description").innerHTML = product.description;
    document.getElementById("product-view-order").onclick = function () {
        var cartTable = document.getElementById("cart-view-table")
        addRowToCartTable(cartTable, product);
        showCartView();
    }
}

function showCartView() {
    document.getElementById("product-view").style.display = "none";
    document.getElementById("list-view").style.display = "none";
    document.getElementById("cart-view").style.display = "block";
}

function showListView() {
    document.getElementById("product-view").style.display = "none";
    document.getElementById("list-view").style.display = "block";
}

function setupProductView() {
    document.getElementById("back-button").onclick = showListView;
}

function setupCartView() {
    document.getElementById("cart-view-send").onclick = function () {
        var formData = new FormData(document.forms.cart);
        formData.append("token", TOKEN);
        for (let i = 0; i < itemsInCart.length; i++) {
            formData.append("products[" + itemsInCart[i].id + "]", countOfItemsInCart[i]);
        }
        post(SERVER_NAME, "api/order/add", formData);
    }
}

window.onload = function () {
    load(SERVER_NAME, "api/category/list", insertTemplatedContent,
        [document.getElementById("categories"), fillCategory]);
    load(SERVER_NAME, "api/product/list", insertTemplatedContent,
        [document.getElementById("products"), fillProduct]);
    setupProductView();
    setupCartView();
};

// interface functions
var menuHided = true;
document.getElementById("categories-icon").onclick = function () {
    var categories = document.getElementById("list-view");
    if(menuHided) {
        categories.style.maxHeight = (document.getElementById("categories").childElementCount * 100) + "px";
    } else {
        categories.style.maxHeight = "0";
    }
    menuHided = !menuHided;
}

