const link =
  "https://raw.githubusercontent.com/hexschool/2021-ui-frontend-job/master/frontend_data.json?token=AAQWFQDSNRRXC6FBW7PDSETBOESVW";
let data;

function init() {
  axios.get(link).then(function (response) {
    data = response.data;
    console.log(data);
    //檢查
    render1();
    render2();
    render3();
    render4();
  });
}

function render1() {
  let caseCompanyNum = 0;
  let salaryScore = 0;
  let avg;

  let caseCompanySatify = {};
  data.forEach(function (item) {
    if (item.company.industry === "接案公司") {
      caseCompanyNum += 1;
      salaryScore += parseInt(item.company.salary_score);
    }
  });
  avg = (salaryScore / caseCompanyNum).toFixed(0);
  let chart = c3.generate({
    bindto: "#caseCompanyAve", // HTML 元素綁定
    data: {
      columns: [["接案公司的薪資滿意度平均分數", avg]], // 資料存放
      types: {
        接案公司的薪資滿意度平均分數: "bar",
      },
    },
    axis: {
      y: {
        max: 9,
        min: 1,
      },
    },
    bar: {
      width: {
        ratio: 0.3, // this makes bar width 50% of length between ticks
      },
      // or
      width: 100, // this makes bar width 100px
    },
  });
}
function render2() {
  let gambleNum = 0;
  let gambleScore = 0;
  let ecommeNum = 0;
  let ecommeScore = 0;

  data.forEach(function (item) {
    if (item.company.industry === "博奕") {
      gambleNum++;
      gambleScore += parseInt(item.company.score);
    } else if (item.company.industry === "電子商務") {
      ecommeNum++;
      ecommeScore += parseInt(item.company.score);
    }
  });

  let gamebleAvg = (gambleScore / gambleNum).toFixed(1);
  let ecommeAvg = (ecommeScore / ecommeNum).toFixed(1);

  let newData = [["博弈"], ["電子商務"]];
  newData[0].push(gamebleAvg);
  newData[1].push(ecommeAvg);
  let chart = c3.generate({
    bindto: "#companiesSatisfy", // HTML 元素綁定
    data: {
      columns: newData, // 資料存放
      type: "bar",
    },
    axis: {
      x: {
        type: "category",
        categories: ["博弈、電商公司兩個產業滿意度的平均分數"],
      },
    },
    size: {
      height: 300,
    },
  });
}
function render3() {
  let male = 0;
  let female = 0;
  let genderAvg;
  data.forEach((item) => {
    item.gender === "男性" ? male++ : female++;
  });

  let gender = [["男性"], ["女性"]];
  gender[0].push(male);
  gender[1].push(female);
  console.log(gender);

  let chart = c3.generate({
    bindto: "#genderProportion", // HTML 元素綁定
    data: {
      columns: gender, // 資料存放
      type: "pie",
    },
    axis: {
      x: {
        type: "category",
        categories: ["男性跟女性比例"],
      },
    },
    size: {
      height: 300,
    },
  });
}
function render4() {
  let obj = {};
  data.forEach((item) => {
    if (obj[item.company.salary] === undefined) {
      obj[item.company.salary] = 1;
    } else {
      obj[item.company.salary]++;
    }
    // console.log(obj);
  });
  console.log(obj);
  //1.先分類薪資範圍並加總人數 此時資料是物件{}
  //{36-50萬:117,61-70萬：76,...}

  //2.物件資料轉換成陣列
  console.log(Object.keys(obj));
  let salaryAry = object.keys(obj);

  //["36-50萬","61-70萬",...]

  //3.再將陣列轉換乘c3需要的格式[{},{},{}]
  let newData = [];
  salaryAry.forEach((item) => {
    newData.push([item, obj[item]]);

    //push陣列名,obj數值
    // let ary = {};
    // ary.salary = item;
    // ary.num = obj[item];
    // newData.push(ary);
    console.log(newData);
  });

  let chart = c3.generate({
    bindto: "#salaryLevel", // HTML 元素綁定
    data: {
      columns: newData, // 資料存放
      type: "pie",
    },
    // axis: {
    //   x: {
    //     type: "category",
    //     categories: ["男性跟女性比例"],
    //   },
    // },
    // size: {
    //   height: 300,
    // },
  });
}
init();
