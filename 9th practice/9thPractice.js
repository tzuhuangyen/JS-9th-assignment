//第九週關卡API：
//https://hexschool.github.io/hexschoolliveswagger/#/
console.log(" Day 37 - 申請產品列表 API");
const api_path = "yaqn09";
const token = "W73Jo634INQKRQqtfSGKdlsFzC43";
const customerUrl = "https://livejs-api.hexschool.io/api/livejs/v1/customer";

function init() {
  getProductList();
  getCartList();
}
init();
//1.取得產品列表 getProductList
//DOM
const productList = document.querySelector(".productList");
let productData = [];
function getProductList() {
  const getProductListLink = `${customerUrl}/${api_path}/products`;
  axios
    .get(getProductListLink)
    .then((res) => {
      productData = res.data.products;
      //console.log(productData)
      renderProductList();
    })
    .catch((error) => {
      console.log(error.res.data);
    });
}
//getProductList()

//2.將產品渲染網頁
function renderProductList() {
  let str = "";
  productData.forEach(function (item) {
    str += ` 
     <div class="col-6 mb-3">
     <div class="card">
        <img src="${item.images}" class="card-img-top productImg" alt="產品圖片">
        <div class="card-body">
          <h5 class="card-title"><strong>${item.title}:</strong> </h5>
          <p class="card-text"><strong>種類:${item.category}</strong> </p>
          <p class="card-text"><strong>原始價格:${item.origin_price}</strong> </p>
          <p class="card-text"><strong>售價:${item.price}</strong> </p>
          <p class="card-text"><strong>描述:${item.description}</strong> </p>
         <input type="button" class="js-addCart" data-id="${item.id}" value="加入購物車"></>
        </div>
       </div>
      </div>`;
  });
  productList.innerHTML = str;
  //console.log(str)
}
//console.log("  Day 39 購物車 API")

//3.取得購物車清單 getCartList
const cartList = document.querySelector(".cartList");
let cartListData = [];
function getCartList() {
  axios
    .get(`${customerUrl}/${api_path}/carts`)
    .then((res) => {
      cartListData = res.data.carts;
      //console.log(res.data.carts)
      //renderCartList
      let str = "";
      cartListData.forEach(function (item) {
        str += `
    <li>品名:${item.product.title}- 
        單價：${item.product.price} 
        數量:${item.quantity}
        <input type="button" value="刪除" data-id="${item.id}">
    </li> `;
      });
      cartList.innerHTML = str;
    })
    .catch((err) => {
      console.log(error.res.data);
    });
}
//getCartList()

//6.加入購物車
function addCartItem(id) {
  axios
    .post(`${customerUrl}/${api_path}/carts`, {
      data: {
        productId: id,
        quantity: 1,
      },
    })

    .then((res) => {
      alert("已加入購物清單");
      getCartList();
    })
    .catch((err) => {
      console.log(err);
    });
}
//test add item id: M8TiK5WKxF3wUs7inx3z
//6.加入購物車綁定監聽
productList.addEventListener("click", (e) => {
  //console.log(e.target)
  //宣告變數確認點擊到屬性是class加入購物車按鈕
  const addCartClass = e.target.getAttribute("class");
  if (addCartClass !== "js-addCart") {
    alert("請點選加入購物車按鈕");
    return;
  }
  //確認點擊到商品並取到商品的id
  const productId = e.target.getAttribute("data-id");
  //console.log(productId)
  addCartItem(productId);
});

//5.刪除全部購物清單delete all cart list
const deleteAllBtn = document.querySelector(".deleteAllBtn");
deleteAllBtn.addEventListener("click", function (e) {
  deleteAllCartList();
});
function deleteAllCartList() {
  axios
    .delete(`${customerUrl}/${api_path}/carts`)
    .then((res) => {
      alert("已刪除全部購物清單");
      getCartList();
    })
    .catch((err) => {
      alert("購物車已清空");
    });
}

//5.刪除購物車內特定商品
//確認cartList內有生成刪除按鈕
//購物車列表綁定監聽+deleteCartItem(id) function
function deleteCartItem(cartId) {
  axios.delete(`${customerUrl}/${api_path}/carts/${cartId}`).then((res) => {
    alert("刪除此筆購物車成功");
    getCartList();
  });
}
cartList.addEventListener("click", (e) => {
  let cartId = e.target.getAttribute("data-id");
  //console.log(cardId)
  if (cartId == null) {
    return;
  }
  deleteCartItem(cartId);
});

//7.送出購買訂單，並再次初始化購物車列表
//DOM
const submitForm = document.querySelector(".submitForm");
const customerName = document.querySelector("#customerName");
const customerTel = document.querySelector("#customerTel");
const customerEmail = document.querySelector("#customerEmail");
const customerAddress = document.querySelector("#customerAddress");
const payMethod = document.querySelector("#payMethod");
//console.log(customerAddress)//確認是否有抓到值

//送出表單監聽
const submitBtn = document.querySelector(".submitBtn");
submitBtn.addEventListener("click", function (e) {
  //console.log("clicked");
  e.preventDefault();
  checkCart(e);
});

const submitOrderLink = `${customerUrl}/${api_path}/orders`;
function checkCart(e) {
  if (cartListData.length == 0) {
    alert("cart List is empty!!");
    return;
  } else if (
    customerName.value == "" ||
    customerTel.value == "" ||
    customerEmail.value == "" ||
    customerAddress.value == "" ||
    payMethod.value == ""
  ) {
    alert("資料請輸入完整");
    return;
  }
  //確認表單內都有值後就可以存到一個變數內
  //注意{{{}}}
  let newOderInfo = {
    data: {
      user: {
        name: customerName.value.trim(),
        tel: customerTel.value.trim(),
        email: customerEmail.value.trim(),
        address: customerAddress.value.trim(),
        payment: payMethod.value.trim(),
      },
    },
  };
  //console.log(newOderInfo)
  axios
    .post(submitOrderLink, newOderInfo) //這裡不用{}

    .then((res) => {
      console.log(res);
      alert("訂單已送出");
      getCartList();
      submitForm.reset();
    })
    .catch((error) => {
      "購物車沒有任何商品";
    });
}
