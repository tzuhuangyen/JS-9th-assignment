console.log("hello");
console.log(api_path, token);

const productList = document.querySelector(".productWrap");
//console.log(productWrap);

//0.初始化
function init() {
  getProductList();
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
      <a href="#" data-id="${item.id}" class="addCardBtn js-addCart">加入購物車</a>
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
//５.購物車列表

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
  console.log(productId);
});
//7.刪除購物車
