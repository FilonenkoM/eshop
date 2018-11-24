import './scss/main.scss';

const SERVER_NAME = "https://nit.tron.net.ua/";
const CATEGORY_TEMPLATE = document.getElementById("category-template");
const PRODUCT_TEMPLATE = document.getElementById("product-template")
const TOKEN = "Y96gIp0vkAZpHhh1L3iI";
const CART_VIEW_TABLE = document.getElementById("cart-view-table");
let itemsInCart = [];
let countOfItemsInCart = [];

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

function post(server, method, params) {
    const xhr = createXHR();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
            } else {
                showModal("Помилка!", "Непередбачена помилка", false);
            }
        }
    }
    xhr.open("POST", server + method, true);
    xhr.send(params);
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

function insertTemplatedContent(container, fill, array) {
    container.innerHTML = "";
    for (let i = array.length - 1; i >= 0; i--) {
        container.insertBefore(fill(array[i]), container.children[0]);
    }
}

function emailCorrect(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function phoneCorrect(number) {
    return number >= 100000000 && number <= 999999999;
}

function fillCategory(category) {
    const view = CATEGORY_TEMPLATE.content.cloneNode(true);
    const nameField = view.querySelector(".category-name");
    nameField.onclick = function () {
        showListView();
        load(SERVER_NAME, "api/product/list/category/" + category.id, insertTemplatedContent,
            [document.getElementById("products"), fillProduct])
    };
    nameField.innerHTML = category.name;
    nameField.setAttribute("title", category.description);
    return view;
}

function fillProduct(product) {
    if(localStorage.getItem(product.id)) {
        addRowToCartTable(CART_VIEW_TABLE, product);
    }
    const view = PRODUCT_TEMPLATE.content.cloneNode(true);
    view.querySelector(".product-container").onclick = function () {
        showProductView(product);
    };
    view.querySelector(".product-name-link").innerHTML = product.name;
    view.querySelector(".product-image").src = product.image_url;

    const priceField = view.querySelector(".product-price");
    const specialPriceField = view.querySelector(".product-special-price")
    priceField.innerHTML = product.price;
    if (product.special_price) {
        priceField.style.textDecoration = "line-through";
        specialPriceField.innerHTML = product.special_price;
    } else {
        specialPriceField.style.display = "none";
    }

    view.querySelector(".add-to-cart").onclick = function(e) {
        e.stopPropagation();
        addRowToCartTable(CART_VIEW_TABLE, product);
        showCartView();
    };
    return view;
}

function addRowToCartTable(table, product) {
    if (!itemsInCart.includes(product.id)) {
        itemsInCart.push(product.id);
        countOfItemsInCart.push(localStorage.getItem(product.id) || 1);

        if(!localStorage.getItem(product.id)) {
            localStorage.setItem(product.id, "1");
        }
        const row = CART_VIEW_TABLE.insertRow(CART_VIEW_TABLE.rows.length);
        row.insertCell(0).innerHTML = product.name;
        row.insertCell(1).innerHTML = (product.special_price || product.price);

        const dec = row.insertCell(2);
        dec.innerHTML = "-";
        const count = row.insertCell(3);
        const index = itemsInCart.length - 1;
        dec.onclick = function () {
            if (countOfItemsInCart[index] > 1) {
                count.innerHTML--;
                countOfItemsInCart[index]--;
                localStorage.setItem(product.id, countOfItemsInCart[index]);
            }
        }
        count.innerHTML = localStorage.getItem(product.id);
        const inc = row.insertCell(4);
        inc.innerHTML = "+";
        inc.onclick = function () {
            countOfItemsInCart[index]++;
            count.innerHTML++;
            localStorage.setItem(product.id, countOfItemsInCart[index])
        }

        const del = row.insertCell(5);
        del.className = "delete-button";
        del.onclick = function () {
            localStorage.removeItem(product.id);
            const index = itemsInCart.indexOf(product.id);
            table.deleteRow(index + 1);
            itemsInCart.splice(index, 1);
            countOfItemsInCart.splice(index, 1)
        }
    }
}

function showProductView(product) {
    document.getElementById("products").style.display = "none";
    document.getElementById("cart-view").style.display = "none";

    const view = document.getElementById("product-view");
    view.style.display = "block";
    document.getElementById("product-view-name").innerHTML = product.name;
    document.getElementById("product-view-image").src = product.image_url;
    const priceField = document.getElementById("product-view-price");
    const specialPriceField = document.getElementById("product-view-special-price");
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
        const cartTable = document.getElementById("cart-view-table")
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
        const formData = new FormData(document.forms.cart);
        let nameIsCorrect = true;
        let phoneIsCorrect = true;
        let emailIsCorrect = true;
        let productListIsCorrect = true;
        if (formData.get("name").length < 1) {
            nameIsCorrect = false;
        }
        if (!emailCorrect(formData.get("email"))) {
            emailIsCorrect = false;
        }
        if (!phoneCorrect(formData.get("phone"))) {
            phoneIsCorrect = false;
        }
        if (itemsInCart.length < 1) {
            productListIsCorrect = false;
        }
        if (!(nameIsCorrect && emailIsCorrect && phoneIsCorrect && productListIsCorrect)) {
            let warning = "";
            if (!nameIsCorrect) {
                warning += "Некоректне ім'я <br>";
            }
            if (!emailIsCorrect) {
                warning += "Некоректна пошта <br>"
            }
            if (!phoneIsCorrect) {
                warning += "Некоректний номер телефону <br>";
            }
            if (!productListIsCorrect) {
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
            for(let i=0;i<CART_VIEW_TABLE.rows.length-1;i++)
                CART_VIEW_TABLE.deleteRow(1);
            itemsInCart = [];
            countOfItemsInCart = [];
            localStorage.clear();
            showListView();
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
    setupCartInputs();
};
function setupCartInputs() {
    let nameField = document.getElementById("cart-view-name");
    nameField.value = localStorage.getItem("name");
    nameField.oninput = function() {
        localStorage.setItem("name", nameField.value);
    }

    let emailField = document.getElementById("cart-view-email");
    emailField.value = localStorage.getItem("email");
    emailField.oninput = function() {
        localStorage.setItem("email", emailField.value);
    }

    let phoneField = document.getElementById("cart-view-phone");
    phoneField.value = localStorage.getItem("phone");
    phoneField.oninput = function() {
        localStorage.setItem("phone", phoneField.value);
    }
}

function showModal(header, text, successful) {
    const modal = document.querySelector(".modal");
    modal.style.display = "block";
    if (successful) {
        modal.querySelector(".modal-content").style.borderColor = "green";
        modal.querySelector(".modal-content").style.backgroundColor = "#deefd9";
    } else {
        modal.querySelector(".modal-content").style.borderColor = "red";
        modal.querySelector(".modal-content").style.backgroundColor = "#f1dede";
    }
    modal.querySelector(".modal-header").innerHTML = header;
    modal.querySelector(".modal-text").innerHTML = text;
}

// interface functions
var menuHided = true;
document.getElementById("categories-icon").onclick = function () {
    const categories = document.getElementById("list-view");
    if (menuHided) {
        categories.style.maxHeight = (document.getElementById("categories").childElementCount * 100) + "px";
    } else {
        categories.style.maxHeight = "0";
    }
    menuHided = !menuHided;
}
document.getElementById("store-header").onclick = showListView;
document.getElementById("cart-icon").onclick = showCartView;

window.onclick = function (event) {
    if (event.target === document.querySelector(".modal")) {
        document.querySelector(".modal").style.display = "none";
    }
}
document.getElementById("cart-view-back").onclick = showListView;