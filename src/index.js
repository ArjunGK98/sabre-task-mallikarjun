let pageData = {
  data: [],
  page: 1,
  rows: 10,
  tabs: 5,
  inputText: "",
  inputRange: 0,
  currentPage: 1,
};

let totalPages;
let paginatedClientData;

function createPagination(page) {
  let element = document.querySelector(".pagination ul");
  let liTag = "";
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;
  console.log("pagination", page);
  pageData.page = page;
  createDataTable();

  if (page > 1) {
    liTag += `<li class="btn prev" onclick="createPagination(${
      page - 1
    })"><span><i class="fas fa-angle-left"></i> &#60;</span></li>`;
  }
  if (page > 2) {
    liTag += `<li class="first numb" onclick="createPagination(1)"><span>1</span></li>`;
    if (page > 3) {
      liTag += `<li class="dots"><span>...</span></li>`;
    }
  }
  if (page == totalPages) {
    beforePage = beforePage - 2;
  } else if (page == totalPages - 1) {
    beforePage = beforePage - 1;
  }
  if (page == 1) {
    afterPage = afterPage + 2;
  } else if (page == 2) {
    afterPage = afterPage + 1;
  }
  for (var plength = beforePage; plength <= afterPage; plength++) {
    if (plength > totalPages) {
      continue;
    }
    if (plength == 0) {
      plength = plength + 1;
    }
    if (page == plength) {
      active = "active";
    } else {
      active = "";
    }
    liTag += `<li class="numb ${active}" onclick="createPagination(${plength})"><span>${plength}</span></li>`;
  }
  if (page < totalPages - 1) {
    if (page < totalPages - 2) {
      liTag += `<li class="dots"><span>...</span></li>`;
    }
    liTag += `<li class="last numb" onclick="createPagination(${totalPages})"><span>${totalPages}</span></li>`;
  }
  if (page < totalPages) {
    liTag += `<li class="btn next" onclick="createPagination(${
      page + 1
    })"><span>&#62;<i class="fas fa-angle-right"></i></span></li>`;
  }
  element.innerHTML = liTag;
}

function pagination(clientData, page, rows) {
  let pageStart = (page - 1) * rows;
  let pageEnd = pageStart + rows;

  let residueData = clientData.slice(pageStart, pageEnd);

  let pages = Math.round(clientData.length / rows);
  totalPages = pages;
  return {
    data: residueData,
    pages: pages,
  };
}

function loadclientData(clientData) {
  let tableBody = document.getElementById("table-body");
  let html = "";

  if (clientData.length) {
    for (let i = 0; i < clientData.length; i++) {
      if (clientData[i]) {
        html += "<tr>";
        html += "<td>" + clientData[i].name + "</td>";
        html += "<td>" + clientData[i].company + "</td>";
        html += "<td>" + Math.floor(clientData[i].sales) + "</td>";
        html += "</tr>";
      }
    }
    tableBody.innerHTML = html;
  } else {
    html += "<p> No Data Found </p>";
    tableBody.innerHTML = html;
  }
}

function calculateAverageSales() {
  let highPerfomerClients = pageData.data.filter((el) => {
    return el.sales >= 800;
  });
  console.log("high performers =", highPerfomerClients);

  let clientStrength = highPerfomerClients.length;

  let totalSales = 0;

  highPerfomerClients.forEach((elem) => (totalSales += elem.sales));

  console.log("totalSales =", totalSales);

  totalSales = totalSales / clientStrength;

  let totalPercentage = Math.floor(
    (clientStrength / pageData.data.length) * 100
  );

  document.getElementById("client-percentage").innerText = totalPercentage;
  document.getElementById("client-sales").innerText =
    "$" + Math.floor(totalSales);

  console.log("percentage = ", totalPercentage);
}

function createDataTable() {
  let totalSalesValue = 0;
  let pageSubTotal = 0;
  paginatedClientData = pagination(pageData.data, pageData.page, pageData.rows);
  pageData.data.forEach((elem) => {
    totalSalesValue += elem.sales;
  });
  paginatedClientData.data.forEach((elem) => {
    pageSubTotal += elem.sales;
  });
  loadclientData(paginatedClientData.data);

  document.getElementById("page-sales-total").innerText =
    pageSubTotal.toFixed(3);
  document.getElementById("sales-total").innerText = totalSalesValue.toFixed(3);

  calculateAverageSales();
}

function filterUserDetails() {
  let filteredData = pageData.data.filter((item) => {
    if (item.company.toLowerCase().includes(pageData.inputText.toLowerCase())) {
      if (item.sales >= pageData.inputRange) {
        return item;
      }
    }
  });
  console.log(filteredData);
  pageData.data = [...filteredData];
  //   createDataTable();
  createPagination(1);
}

function registerListners() {
  let inputTextElement = document.getElementById("input-box");
  let inputRangeElement = document.getElementById("range-input");
  let filterBtnElement = document.getElementById("filter-btn");
  let refreshBtnElement = document.getElementById("refresh-btn");

  inputTextElement.addEventListener("change", (event) => {
    // console.log(event.target.value);
    pageData.inputText = event.target.value;
  });

  inputRangeElement.addEventListener("change", function (event) {
    // console.log(event.target.value);
    let inputRangeText = document.getElementById("range-output");
    pageData.inputRange = event.target.value;
    inputRangeText.innerText = pageData.inputRange;
  });

  filterBtnElement.addEventListener("click", function () {
    filterUserDetails();
  });

  refreshBtnElement.addEventListener("click", async function () {
    console.log("refresh the data");
    pageData.data = [...(await fetchClientData())];
    createDataTable();
  });
}

async function fetchClientData() {
  let url = "../src/data.json";
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

async function init() {
  let data = await fetchClientData();
  console.log(data);
  pageData.data = [...data];
  createDataTable();
  createPagination(pageData.page);
  registerListners();
}

window.onload = init;
