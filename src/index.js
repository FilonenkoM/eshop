import './scss/main.scss';

const SERVER_NAME = "http://nit.tron.net.ua/";
const CATEGORY_TEMPLATE = document.getElementById("category-template");
const PRODUCT_TEMPLATE = document.getElementById("product-template")

var cartTable = document.getElementById("cart-view-table");
var itemsInCart = [];
var countOfItemsInCart = [];

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
    link.onclick = function () {
        showProductView(product);
    };
    link.innerHTML = product.name;
    view.getElementById("product-image").src = product.image_url;
    view.getElementById("product-price").innerHTML = product.price;
    view.getElementById("product-special-price").innerHTML = product.special_price;
    view.getElementById("add-to-cart").onclick = function () {
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

function post(server, method, params) {
    var xhr = createXHR();
    xhr.open("POST", serve + method, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/json');

}

function showProductView(product) {
    document.getElementById("list-view").style.display = "none";
    const view = document.getElementById("product-view");
    view.style.display = "block";
    document.getElementById("product-view-name").innerHTML = product.name;
    document.getElementById("product-view-image").src = product.image_url;
    document.getElementById("product-view-price").innerText = product.price;
    document.getElementById("product-view-special-price").innerHTML = product.special_price;
    document.getElementById("product-view-description").innerHTML = product.description;
    document.getElementById("to-cart-button").onclick = function () {
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
        var email = document.getElementById("cart-view-email").value;
        var name = document.getElementById("cart-view-name").value;
        var phone = document.getElementById("cart-view-phone").value;
        var params = {
            "name": name,
            "phone": phone,
            "email": email,
        };
        for(let i=0;i<itemsInCart;i++) {
            var param = "products[" + itemsInCart[i] + "]";
            params[param] = countOfItemsInCart[i];
        }
        post(SERVER_NAME, "api/order/add", params);
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


