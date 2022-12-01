console.log("hello");
console.log(api_path, token);

const productList = document.querySelector(".productWrap");

//console.log(productWrap);
function init() {
  getProductList();
}
init();

let productData = [];
function getProductList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`
    )
    .then(function (response) {
      productData = response.data.products;
      //console.log(response.data.products);
      productData.forEach((item) => {
        let str = "";
        productData.forEach((item) => {
          str = `<li class="productCard">
          <h4 class="productType">新品</h4>
          <img
            src="${item.images}"
            alt=""
          />
          <a href="#" class="addCardBtn">加入購物車</a>
          <h3>${item.title}</h3>
          <del class="originPrice">NT$${item.origin_price}</del>
          <p class="nowPrice">NT$${item.price}</p>
          </li>`;
        });
        productList.innerHTML = str;
      });
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}
