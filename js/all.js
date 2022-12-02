console.log("hello");
console.log(api_path, token);

const productList = document.querySelector(".productWrap");
//console.log(productWrap);

//0.初始化
function init() {
  getProductList();
  getCartList();
}
init();

//1.取得外部資料api並渲染
let productData = [];
function getProductList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`
    )
    .then(function (response) {
      productData = response.data.products;
      //console.log(productData);
      renderProductList(productData);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}
//2.渲染畫面 render function
function renderProductList(renderData) {
  let str = "";
  renderData.forEach((item) => {
    str += `
      <li class="productCard">
      <h4 class="productType">新品</h4>
      <img
        src="${item.images}"
        alt=""
      />
      <a href="#" id="addCardBtn" class="js-addCart" data-id="${item.id}" >加入購物車</a>
     
      <h3>${item.title}</h3>
      <del class="originPrice">NT$${item.origin_price}</del>
      <p class="nowPrice">NT$${item.price}</p>
      </li>
      `;
  });
  productList.innerHTML = str;
  searchResultText.innerHTML = `本次搜尋共 ${renderData.length} 筆資料`;
}
//3.下拉式產品分類選單
const productSelect = document.querySelector(".productSelect");
//console.log(productSelect);
productSelect.addEventListener("change", (e) => {
  //console.log(e.target.value);
  if (e.target.value === "全部") {
    renderProductList(productData);
    return;
  }
  //如果資料是由外部傳入適合用push
  let selectedCategories = [];
  productData.forEach((item) => {
    if (e.target.value === item.category) {
      selectedCategories.push(item);
      renderProductList(selectedCategories);
    }
  });
});
//4.下拉式產品分類選單顯示筆數
const searchResultText = document.querySelector("#searchResult-text");
//範本基本篩選語法+重構句子語法
// function combineProductHTMLItem(item){
//   return `<li class="productCard">
//         <h4 class="productType">新品</h4>
//         <img
//           src="${item.images}"
//           alt="">
//         <a href="#" class="js-addCart"  id="addCardBtn" data-id="${item.id}">加入購物車</a>
//         <h3>${item.title}</h3>
//         <del class="originPrice">NT$${toThousands(item.origin_price)}</del>
//         <p class="nowPrice">NT$${toThousands(item.price)}</p>
//       </li>`
// }
// function renderProductList(){
//   let str = "";
//   productData.forEach(function (item) {
//     str += combineProductHTMLItem(item);
//   })
//   productList.innerHTML = str;
// }
// productSelect.addEventListener('change',function(e){
//   const category = e.target.value;
//   if(category=="全部"){
//     renderProductList();
//     return;
//   }
//   // 函式消除重複
//   let str = "";
//   productData.forEach(function(item){
//     if(item.category ==category){
//       str += combineProductHTMLItem(item)
//     }
//   })
//   productList.innerHTML = str;
// })

console.log("from here");
let cartData = [];
//５.購物車列表
const cartList = document.querySelector(".shoppingCart-tabList");
function getCartList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
    )
    .then(function (response) {
      document.querySelector(".js-total").textContent =
        response.data.finalTotal;
      cartData = response.data.carts;
      //console.log(cartData);
      let str = "";
      cartData.forEach((item) => {
        str += `<tr>
        <td>
          <div class="cardItem-title">
            <img src="${item.product.images}" alt="" />
            <p>${item.product.title}</p>
          </div>
        </td>
        <td>$${item.product.price}</td>
        <td>${item.quantity}</td>
        <td>NT$${item.product.price * item.quantity}</td>
        <td class="discardBtn">
          <a href="#" class="material-icons" data-id="${item.id}"> clear </a>
        </td>
      </tr>`;
      });

      cartList.innerHTML = str;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}
//６.加入購物車
productList.addEventListener("click", (e) => {
  e.preventDefault();
  //console.log(e.target.getAttribute("data-id"));
  //在renderProductList內“加入購物車”字串內加入並可抓到id的值
  let addCartClass = e.target.getAttribute("class");
  //抓出點到的class屬性來if判斷點到的是不是我們要的
  //console.log(addCartClass);
  if (addCartClass !== "js-addCart") {
    return;
  }
  let productId = e.target.getAttribute("data-id");
  //確認條件屬性最好只有一個 我使用class但裡面放兩個不一樣的class名稱就顯示不了
  //console.log(productId);
  //點到商品時要先確認購物車已是否有此產品 如果有就+1 沒有就=0
  let numCheck = 1;
  // 產品數量預設數量是１
  //點到產品列表的商品時取到商品id去跟購物車做比對
  cartData.forEach((item) => {
    //如果產品列表的產品id跟購物車的一樣
    if (item.product.id === productId) {
      numCheck = item.quantity += 1;
    }
  });
  //console.log(numCheck);
  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,
      {
        data: {
          productId: productId,
          quantity: numCheck,
        },
      }
    )
    .then(function (response) {
      alert("已加入購物車清單");
      getCartList();
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
});
//7-1.刪除單筆購物車清單
cartList.addEventListener("click", (e) => {
  e.preventDefault();
  const cartId = e.target.getAttribute("data-id");
  //console.log(cartId);
  if (cartId === null) {
    alert("請點選按鈕");
    return;
  }
  //console.log(cartId);
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`
    )
    .then(function (response) {
      alert("已刪除此筆產品");
      getCartList();
    });
});
///7-2刪除全部購物車清單
const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click", (e) => {
  e.preventDefault();
  //console.log(discardAllBtn);
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
    )
    .then(function (response) {
      alert("已刪除全部產品");
      getCartList();
    })
    .catch(function (response) {
      alert("購物車已清空！快再去買起來");
    });
});

//8.送出訂單
const orderInfoBtn = document.querySelector(".orderInfo-btn");
orderInfoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  //console.log("clicked");
  //確認購物車有無商品＆＆表單訊息完整才能送出訂單
  if (cartData.length === 0) {
    alert("購物車沒有商品 快去買起乃");
    return;
  }
  //DOM訂單
  const customerName = document.querySelector("#customerName").value;
  const customerPhone = document.querySelector("#customerPhone").value;
  const customerEmail = document.querySelector("#customerEmail").value;
  const customerAddress = document.querySelector("#customerAddress").value;
  const tradeWay = document.querySelector("#tradeWay").value;
});
console.log(
  customerName,
  customerPhone.value,
  customerEmail.value,
  customerAddress.value,
  tradeWay.value
);
