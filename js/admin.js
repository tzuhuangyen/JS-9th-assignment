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
      renderC3_lv2();
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
    //使用 getAttribute 取出的值都會是字串，所以帶到函式 changeOrderStatus 的 status 型別就會是字串 "true" 或者 "false"。
    changeOrderStatus(status, id);
    return;
  }
});
// 變更訂單狀態函示
function changeOrderStatus(status, id) {
  //console.log(status, id);
  let newStatus;
  if (status == "true") {
    // 記得是比對字串
    //如果將字串的 “true” 和布林值的 true 拿來比對，會出現錯誤
    //"true" == true; // false
    //"false" == true; // false
    //所以會導致以下程式碼不論如何都只會跑 else 的選項，造成每次編輯訂單都會是「已處理」的結果
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

//c3圖表 lv1 &lv2
function renderC3() {
  //   console.log(orderData);
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
  //console.log(total);
  //資料關聯
  let categoryAry = Object.keys(total);
  //console.log(categoryAry);
  let newData = [];
  categoryAry.forEach((item) => {
    let ary = [];
    ary.push(item);
    ary.push(total[item]);
    newData.push(ary);
  });
  //console.log(newData);
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
//c3-level2
//資料關聯
//設計前三名與其他分類排名
function renderC3_lv2() {
  //1.將title資料計算分類{}
  let obj = {};
  //console.log(orderData);
  //array(3)[{...},{...},{...}]
  //當單筆訂單內有多項產品時 比須先加總
  orderData.forEach((item) => {
    item.products.forEach((productItem) => {
      if (obj[productItem.title] === undefined) {
        obj[productItem.title] = productItem.quantity * productItem.price;
      } else {
        obj[productItem.title] += productItem.quantity * productItem.price;
      }
    });
  });
  console.log(obj);
  //{"title":price|}
  //{
  //   "Antony 雙人床架／雙人加大": 12000,
  //   "Jordan 雙人床架／雙人加大": 9000
  // }
  //2.將obj變成自己的格式["title","title",...]
  let originAry = Object.keys(obj);
  console.log(originAry);
  let rankSortAry = [];
  originAry.forEach((item) => {
    let ary = [];
    ary.push(item);
    ary.push(obj[item]);
    rankSortAry.push(ary);
  });
  console.log(rankSortAry);
  //[[title,price],[title,price],[..]]
  //比大小排序目的：營收前三名品項當主要色塊 其餘品項加起來當一個色塊
  rankSortAry.sort((a, b) => {
    return b[1] - a[1];
    //a b只是每個陣列 但要比較陣列內的陣列price所以是[1]
  });
  console.log(rankSortAry);
  //如果超過四筆以上 就統整為其他
  if (rankSortAry.length > 3) {
    let otherTotal = 0;
    rankSortAry.forEach((item, index) => {
      //前三筆不動作從第四筆開始執行函示
      if (index > 2) {
        otherTotal += rankSortAry[index][1];
        //第四筆開始加總每筆[index]的價錢[1]
        //otherTotal是其他排名價錢的總額
      }
    });
    rankSortAry.splice(3, rankSortAry.length - 1);
    //移除第三筆資料後index3的資料 用otherTotal 代替跑c3圖表
    rankSortAry.push(["other", otherTotal]);
  }
  console.log(rankSortAry);
  //c3 chart
  c3.generate({
    bindto: "#chart2", // HTML 元素綁定
    data: {
      type: "pie",
      columns: rankSortAry,
    },
    colors: {
      pattern: ["#DACBFF", "#9D7FEA", "#5434A7", "#301E5F"],
    },
  });
}
