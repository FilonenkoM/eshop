!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);n(1);var o="https://nit.tron.net.ua/",r=document.getElementById("category-template"),c=document.getElementById("product-template"),l="Y96gIp0vkAZpHhh1L3iI",i=document.getElementById("cart-view-table"),a=[],d=[];function u(){try{return new XMLHttpRequest}catch(e){try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){return new ActiveXObject("Msxml2.XMLHTTP")}}}function m(e,t,n){var o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[],r=u();r.onreadystatechange=function(){4===this.readyState&&200===this.status&&(o.push(JSON.parse(this.responseText)),n.apply(null,o))},r.open("GET",e+t,!0),r.send()}function s(e,t,n){e.innerHTML="";for(var o=n.length-1;o>=0;o--)e.insertBefore(t(n[o]),e.children[0])}function p(e){var t=r.content.cloneNode(!0),n=t.querySelector(".category-name");return n.onclick=function(){v(),m(o,"api/product/list/category/"+e.id,s,[document.getElementById("products"),y])},n.innerHTML=e.name,n.setAttribute("title",e.description),t}function y(e){localStorage.getItem(e.id)&&g(i,e);var t=c.content.cloneNode(!0);t.querySelector(".product-container").onclick=function(){!function(e){document.getElementById("products").style.display="none",document.getElementById("cart-view").style.display="none",document.getElementById("product-view").style.display="block",document.getElementById("product-view-name").innerHTML=e.name,document.getElementById("product-view-image").src=e.image_url;var t=document.getElementById("product-view-price"),n=document.getElementById("product-view-special-price");t.innerText=e.price,e.special_price?(n.style.display="block",n.innerHTML=e.special_price,t.style.textDecoration="line-through"):(n.style.display="none",t.style.textDecoration="");document.getElementById("product-view-description").innerHTML=e.description,document.getElementById("product-view-order").onclick=function(){var t=document.getElementById("cart-view-table");g(t,e),f()}}(e)},t.querySelector(".product-name-link").innerHTML=e.name,t.querySelector(".product-image").src=e.image_url;var n=t.querySelector(".product-price"),o=t.querySelector(".product-special-price");return n.innerHTML=e.price,e.special_price?(n.style.textDecoration="line-through",o.innerHTML=e.special_price):o.style.display="none",t.querySelector(".add-to-cart").onclick=function(t){t.stopPropagation(),g(i,e),f()},t}function g(e,t){if(!a.includes(t.id)){a.push(t.id),d.push(localStorage.getItem(t.id)||1),localStorage.getItem(t.id)||localStorage.setItem(t.id,"1");var n=i.insertRow(i.rows.length);n.insertCell(0).innerHTML=t.name,n.insertCell(1).innerHTML=t.special_price||t.price;var o=n.insertCell(2);o.innerHTML="-";var r=n.insertCell(3),c=a.length-1;o.onclick=function(){d[c]>1&&(r.innerHTML--,d[c]--,localStorage.setItem(t.id,d[c]))},r.innerHTML=localStorage.getItem(t.id);var l=n.insertCell(4);l.innerHTML="+",l.onclick=function(){d[c]++,r.innerHTML++,localStorage.setItem(t.id,d[c])};var u=n.insertCell(5);u.className="delete-button",u.onclick=function(){localStorage.removeItem(t.id);var n=a.indexOf(t.id);e.deleteRow(n+1),a.splice(n,1),d.splice(n,1)}}}function f(){document.getElementById("products").style.display="none",document.getElementById("product-view").style.display="none",document.getElementById("cart-view").style.display="block"}function v(){document.getElementById("categories");"none"===products.style.display&&(document.getElementById("product-view").style.display="none",document.getElementById("products").style.display="block",document.getElementById("cart-view").style.display="none")}function I(){document.getElementById("cart-view-send").onclick=function(){var e=new FormData(document.forms.cart),t=!0,n=!0,r=!0,c=!0;if(e.get("name").length<1&&(t=!1),function(e){return/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(e).toLowerCase())}(e.get("email"))||(r=!1),function(e){return e>=1e8&&e<=999999999}(e.get("phone"))||(n=!1),a.length<1&&(c=!1),t&&r&&n&&c){S("Замовлення надислано","Ваше замовлення успішно збережене та надіслане",!0),e.append("token",l);for(var m=0;m<a.length;m++)e.append("products["+a[m].id+"]",d[m]);!function(e,t,n){var o=u();o.onreadystatechange=function(){4===o.readyState&&(200===o.status||S("Помилка!","Непередбачена помилка",!1))},o.open("POST",e+t,!0),o.send(n)}(o,"api/order/add",e);for(var s=0;s<i.rows.length-1;s++)i.deleteRow(1);a=[],d=[],localStorage.clear(),v()}else{var p="";t||(p+="Некоректне ім'я <br>"),r||(p+="Некоректна пошта <br>"),n||(p+="Некоректний номер телефону <br>"),c||(p+="Ви не обрали жодного товару <br>"),S("Замовлення не відправлено",p,!1)}}}function S(e,t,n){var o=document.querySelector(".modal");o.style.display="block",n?(o.querySelector(".modal-content").style.borderColor="green",o.querySelector(".modal-content").style.backgroundColor="#deefd9"):(o.querySelector(".modal-content").style.borderColor="red",o.querySelector(".modal-content").style.backgroundColor="#f1dede"),o.querySelector(".modal-header").innerHTML=e,o.querySelector(".modal-text").innerHTML=t}window.onload=function(){m(o,"api/category/list",s,[document.getElementById("categories"),p]),m(o,"api/product/list",s,[document.getElementById("products"),y]),document.getElementById("back-button").onclick=v,I(),function(){var e=document.getElementById("cart-view-name");e.value=localStorage.getItem("name"),e.oninput=function(){localStorage.setItem("name",e.value)};var t=document.getElementById("cart-view-email");t.value=localStorage.getItem("email"),t.oninput=function(){localStorage.setItem("email",t.value)};var n=document.getElementById("cart-view-phone");n.value=localStorage.getItem("phone"),n.oninput=function(){localStorage.setItem("phone",n.value)}}()};var E=!0;document.getElementById("categories-icon").onclick=function(){var e=document.getElementById("list-view");e.style.maxHeight=E?100*document.getElementById("categories").childElementCount+"px":"0",E=!E},document.getElementById("store-header").onclick=v,document.getElementById("cart-icon").onclick=f,window.onclick=function(e){e.target===document.querySelector(".modal")&&(document.querySelector(".modal").style.display="none")},document.getElementById("cart-view-back").onclick=v,document.getElementById("all-products").onclick=function(){v(),m(o,"api/product/list",s,[document.getElementById("products"),y]);for(var e=document.getElementsByClassName("menu-radio"),t=0;t<e.length;t++)e[t].checked=!1}},function(e,t,n){}]);