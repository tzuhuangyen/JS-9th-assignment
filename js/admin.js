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
        // 組時間字串
        const timeStamp = new Date(item.createdAt * 1000);
        const orderTime = `
             ${timeStamp.getFullYear()}/
             ${timeStamp.getMonth() + 1}/${timeStamp.getDate()}`;
        console.log(orderTime);

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
        <td>${orderTime}</td>
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
      renderC3();
    });
}
// 訂單狀態/操作刪除按鈕監聽處理
orderList.addEventListener("click", (e) => {
  e.preventDefault();
  const targetClass = e.target.getAttribute("class");
  //console.log(targetClass);
  let id = e.target.getAttribute("data-id");
  if (targetClass == "delSingleOrder-Btn js-orderDelete") {
    //alert("你點到刪除按鈕");
    deleteOrder(id);
    return;
  }
  if (targetClass == "js-orderStatus") {
    let status = e.target.getAttribute("data-status");

    changeOrderStatus(status, id);
    return;
  }
});
// 變更訂單狀態函示
function changeOrderStatus(status, id) {
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
// 刪除訂單
function deleteOrder(id) {
  //console.log(id);
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${id}`,
      {
        headers: {
          authorization: token,
        },
      }
    )
    .then((res) => {
      alert("has deleted this order");
      getOderList();
    });
}
//刪除全部訂單
const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click", (e) => {
  e.preventDefault();
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          authorization: token,
        },
      }
    )
    .then((res) => {
      alert("has deleted ALL orders");
      getOderList();
    });
});

//c3圖表
function renderC3() {
  console.log(orderData);
  let total = {};
  orderData.forEach((item) => {
    item.products.forEach((productItem) => {
      if (total[productItem.category] === undefined) {
        total[productItem.category] = productItem.price * productItem.quantity;
      } else {
        total[productItem.category] += productItem.price * productItem.quantity;
      }
    });
  });
  console.log(total);
  //資料關聯
  let categoryAry = Object.keys(total);
  console.log(categoryAry);
  let newData = [];
  categoryAry.forEach((item) => {
    let ary = [];
    ary.push(item);
    ary.push(total[item]);
    newData.push(ary);
  });
  console.log(newData);
  let chart = c3.generate({
    bindto: "#chart", // HTML 元素綁定
    data: {
      type: "pie",
      columns: newData,
      //   colors: {
      //     "Louvre 雙人床架": "#DACBFF",
      //     "Antony 雙人床架": "#9D7FEA",
      //     "Anty 雙人床架": "#5434A7",
      //     其他: "#301E5F",
      //   },
    },
  });
}
