import './scss/main.scss';

const SERVER_NAME = "https://nit.tron.net.ua/";
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
    let priceField = view.getElementById("product-price");
    let specialPriceField = view.getElementById("product-special-price")
    priceField.innerHTML = product.price;
    if (product.special_price) {
        priceField.style.textDecoration = "line-through";
        specialPriceField.innerHTML = product.special_price;
    }
    else {
        specialPriceField.style.display = "none";
    }
    let button = view.getElementById("add-to-cart");
    button.onclick = function (e) {
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
        row.insertCell(1).innerHTML = (product.special_price || product.price);

        let dec = row.insertCell(2);
        dec.innerHTML = "-";
        var count = row.insertCell(3);
        var index = itemsInCart.length - 1;
        dec.onclick = function () {
            if (countOfItemsInCart[index] > 1) {
                count.innerHTML--;
                countOfItemsInCart[index]--;
            }
        }
        count.innerHTML = "1";
        let inc = row.insertCell(4);
        inc.innerHTML = "+";
        inc.onclick = function () {
            countOfItemsInCart[index]++;
            count.innerHTML++;
        }

        let del = row.insertCell(5);
        del.className = "delete-button";
        del.onclick = function () {
            let index = itemsInCart.indexOf(product.id);
            table.deleteRow(index + 1);
            itemsInCart.splice(index, 1);
            countOfItemsInCart.splice(index, 1)
        }
    }
}

function fillCategory(category) {
    categoriesCount++;
    var view = CATEGORY_TEMPLATE.content.cloneNode(true);
    var nameField = view.querySelector(".category-name");
    nameField.onclick = function () {
        showListView();
        load(SERVER_NAME, "api/product/list/category/" + category.id, insertTemplatedContent,
            [document.getElementById("products"), fillProduct])
    };
    nameField.innerHTML = category.name;
    return view;
}

function insertTemplatedContent(container, fill, array) {
    container.innerHTML = "";
    for (let i = array.length - 1; i >= 0; i--) {
        container.insertBefore(fill(array[i]), container.children[0]);
    }
}

function post(server, method, params) {
    var xhr = createXHR();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if(xhr.status == 200) {
            } else {
                showModal("Помилка!", "Непередбачена помилка", false);
            }
        }
    }
    xhr.open("POST", server + method, true);
    xhr.send(params);
}

function showProductView(product) {
    document.getElementById("products").style.display = "none";
    const view = document.getElementById("product-view");
    view.style.display = "block";
    document.getElementById("product-view-name").innerHTML = product.name;
    document.getElementById("product-view-image").src = product.image_url;
    let priceField = document.getElementById("product-view-price");
    let specialPriceField = document.getElementById("product-view-special-price");
    priceField.innerText = product.price;
    if (product.special_price) {
        specialPriceField.style.display = "block";
        specialPriceField.innerHTML = product.special_price;
        priceField.style.textDecoration = "line-through";
    }
    else {
        specialPriceField.style.display = "none";
        priceField.style.textDecoration = "";
    }
    document.getElementById("product-view-description").innerHTML = product.description;
    document.getElementById("product-view-order").onclick = function () {
        var cartTable = document.getElementById("cart-view-table")
        addRowToCartTable(cartTable, product);
        showCartView();
    }
}

function showCartView() {
    document.getElementById("products").style.display = "none";
    document.getElementById("product-view").style.display = "none";
    document.getElementById("cart-view").style.display = "block";
}

function showListView() {
    const categories = document.getElementById("categories");
    if (products.style.display === "none") {
        document.getElementById("product-view").style.display = "none";
        document.getElementById("products").style.display = "block";
        document.getElementById("cart-view").style.display = "none";
    }
}

function setupProductView() {
    document.getElementById("back-button").onclick = showListView;
}

function setupCartView() {
    document.getElementById("cart-view-send").onclick = function () {
        var formData = new FormData(document.forms.cart);
        let nameIsCorrect = true;
        let phoneIsCorrect = true;
        let emailIsCorrect = true;
        var productListIsCorrect = true;
        if(formData.get("name").length < 1) {
            nameIsCorrect = false;
        }
        if(!emailCorrect(formData.get("email"))) {
            emailIsCorrect = false;
        }
        if(!phoneCorrect(formData.get("phone"))) {
            phoneIsCorrect = false;
        }
        if(itemsInCart.length < 1) {
            productListIsCorrect = false;
        }
        if(!(nameIsCorrect && emailIsCorrect && phoneIsCorrect && productListIsCorrect)) {
            let warning = "";
            if(!nameIsCorrect) {
                warning += "Некоректне ім'я <br>";
            }
            if(!emailIsCorrect) {
                warning += "Некоректна пошта <br>"
            }
            if(!phoneIsCorrect) {
                warning += "Некоректний номер телефону <br>";
            }
            if(!productListIsCorrect) {
                warning += "Ви не обрали жодного товару <br>";
            }
            showModal("Замовлення не відправлено", warning, false);
        }
        else {
            showModal("Замовлення надислано", "Ваше замовлення успішно збережене та надіслане", true)
            formData.append("token", TOKEN);
            for (let i = 0; i < itemsInCart.length; i++) {
                formData.append("products[" + itemsInCart[i].id + "]", countOfItemsInCart[i]);
            }
            post(SERVER_NAME, "api/order/add", formData);
        }
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

function showModal(header, text, successful) {
    let modal = document.querySelector(".modal");
    modal.style.display = "block";
    if(successful) {
        modal.querySelector(".modal-content").style.borderColor = "green";
        modal.querySelector(".modal-content").style.backgroundColor = "#deefd9";
    } else {
        modal.querySelector(".modal-content").style.borderColor = "red";
        modal.querySelector(".modal-content").style.backgroundColor = "#f1dede";
    }
    modal.querySelector(".modal-header").innerHTML = header;
    modal.querySelector(".modal-text").innerHTML = text;
}

function emailCorrect(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function phoneCorrect(number) {
    return number >= 100000000 && number <= 999999999;
}

// interface functions
var menuHided = true;
document.getElementById("categories-icon").onclick = function () {
    var categories = document.getElementById("list-view");
    if (menuHided) {
        categories.style.maxHeight = (document.getElementById("categories").childElementCount * 100) + "px";
    } else {
        categories.style.maxHeight = "0";
    }
    menuHided = !menuHided;
}
document.getElementById("store-header").onclick = showListView;
document.getElementById("cart-icon").onclick = showCartView;

window.onclick = function(event) {
    if (event.target === document.querySelector(".modal")) {
        document.querySelector(".modal").style.display = "none";
    }
}
document.getElementById("cart-view-back").onclick = showListView;