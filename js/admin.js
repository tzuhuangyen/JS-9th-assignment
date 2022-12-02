let orderData = [];
const orderList = document.querySelector(".js-orderList");
function init() {
  getOderList();
}
init();
// 後台訂單表格
function getOderList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          authorization: token,
        },
      }
    )
    .then((res) => {
      orderData = res.data.orders;

      let str = "";
      orderData.forEach((item) => {
        //   組同筆訂單多樣產品字串
        let productStr = "";
        item.products.forEach((productItem) => {
          productStr += `<p>${productItem.title}x${productItem.quantity}</p>`;
        });
        //   判斷訂單處理狀態
        let orderStatus = "";
        if (item.paid === true) {
          orderStatus = "已處理";
        } else {
          orderStatus = "未處理";
        }
        //   組全部訂單字串
        str += ` <tr>
        <td>${item.id}</td>
        <td>
          <p>${item.user.name}</p>
          <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
          <p>${productStr}</p>
        </td>
        <td>${item.createdAt}</td>
        <td class="orderStatus">
          <a href="#" 
          class="js-orderStatus" 
          data-status="${item.paid}"
          data-id="${item.id}">
          ${orderStatus}
          </a>
        </td>
        <td>
          <input type="button" 
          class="delSingleOrder-Btn js-orderDelete" 
          data-id="${item.id}" 
          value="刪除" />
        </td>
      </tr>`;
      });
      orderList.innerHTML = str;
    });
}
// 訂單處理
orderList.addEventListener("click", (e) => {
  e.preventDefault();
  const targetClass = e.target.getAttribute("class");
  //console.log(targetClass);
  if (targetClass == "delSingleOrder-Btn js-orderDelete") {
    alert("你點到刪除按鈕");
    return;
  }
  if (targetClass == "js-orderStatus") {
    let status = e.target.getAttribute("data-status");
    let id = e.target.getAttribute("data-id");
    deleteOrderItem(status, id);
    return;
  }
});
// 刪除訂單
function deleteOrderItem(status, id) {
  //console.log(status, id);
  let newStatus;
  if (status == true) {
    newStatus = false;
  } else {
    newStatus = true;
  }
  axios
    .put(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        data: {
          id: id,
          paid: newStatus,
        },
      },
      {
        headers: {
          authorization: token,
        },
      }
    )
    .then((res) => {
      alert("變更成功");
      getOderList();
    });
}
