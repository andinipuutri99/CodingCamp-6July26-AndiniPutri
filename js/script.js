const itemName = document.getElementById("itemName");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const addBtn = document.getElementById("addBtn");
const total = document.getElementById("total");
const transactionList = document.getElementById("transactionList");
const savedTransactions = localStorage.getItem("transactions");
const chartCanvas = document.getElementById("expenseChart");
const themeBtn = document.getElementById("themeBtn");
const sortBtn = document.getElementById("sortBtn");

let transactions = [];
let expenseChart;
    
if(savedTransactions){

    transactions = JSON.parse(savedTransactions);

    renderTransactions();

    updateTotal();
    updateChart();
}

function renderTransactions() {

    transactionList.innerHTML = "";

    transactions.forEach(function(transaction, index) {

        transactionList.innerHTML += `
            <div class="transaction-item
            ${transaction.amount > 100000 ? "high-spending" : ""}">

                <h3>${transaction.name}</h3>

                <p>Rp ${transaction.amount}</p>

                <p>${transaction.category}</p>

                <button onclick="deleteTransaction(${index})">
                    Delete
                </button>

            </div>
        `;

    });

}

function updateTotal() {

    let totalAmount = 0;

    transactions.forEach(function(transaction){

        totalAmount += transaction.amount;

    });

    total.textContent = `Rp ${totalAmount}`;

}

function updateChart() {

    let food = 0;
    let transport = 0;
    let fun = 0;

    transactions.forEach(function(transaction){

        if(transaction.category === "Food"){
            food += transaction.amount;
        }

        else if(transaction.category === "Transport"){
            transport += transaction.amount;
        }

        else if(transaction.category === "Fun"){
            fun += transaction.amount;
        }

    });

    if(expenseChart){
        expenseChart.destroy();
    }

    expenseChart = new Chart(chartCanvas,{
        type:"doughnut",
        data:{
            labels:["Food","Transport","Fun"],
            datasets:[{
                data:[
                    food,
                    transport,
                    fun
                ]
            }]
        }
    });
}

function saveToLocalStorage(){

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}

function deleteTransaction(index){

    transactions.splice(index,1);

    renderTransactions();

    updateTotal();
    updateChart();
    saveToLocalStorage();

}

themeBtn.addEventListener("click",function(){

    document.body.classList.toggle("dark");

});

sortBtn.addEventListener("click",function(){

    transactions.sort(function(a,b){

        return a.amount-b.amount;

    });

    renderTransactions();

    saveToLocalStorage();

});

addBtn.addEventListener("click", function () {

    const name = itemName.value.trim();
    const money = amount.value;
    const selectedCategory = category.value;

    if (name === "" || money === "" || selectedCategory === "") {
        alert("Please fill in all fields!");
        return;
    }

    const transaction = {
        name: name,
        amount: Number(money),
        category: selectedCategory
    };

    transactions.push(transaction);

    renderTransactions();
    updateTotal();
    updateChart();
    saveToLocalStorage();

    itemName.value = "";
    amount.value = "";
    category.value = "";

});