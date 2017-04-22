var mysql = require("mysql");
var inquirer = require("inquirer");
var tableContent = "";
var newStock = 0;

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "elecornos",
	database: "bamazon"
});

getCurrent();
startPrompt();

function startPrompt() {
	console.log("\n");
	inquirer.prompt({
	 	name: "action",
		type: "list",
		message: "What would you like to do?",
		choices: [
			"View Products for Sale", 
			"View Low Inventory", 
			"Add to Inventory", 
			"Add New Product"
		]
	}).then(function(answer) {
		switch (answer.action) {
			case "View Products for Sale":
				viewProducts();
				break;

			case "View Low Inventory":
				lowInventory();
				break;

			case "Add to Inventory":
				addInventory();
				break;

			case "Add New Product":
				addProduct();
				break;
		}
	});
}

function getCurrent() {
	connection.query("select * from products", function(err, res) {
		tableContent = res;
		if(err) throw err;
	});
}

function viewProducts() {
	for (i=0;i<tableContent.length;i++) {
		console.log(
			"\nProduct: "+tableContent[i].product_name+
			"\nID: "+tableContent[i].item_id+
			"\nDepartment: "+tableContent[i].department_name+
			"\nPrice: $"+tableContent[i].price+
			"\n# In Stock: "+tableContent[i].stock_quantity
		);
	}
	startPrompt();
}

function lowInventory() {
	console.log("Products with inventory less than 5\n");
	for (i=0;i<tableContent.length;i++) {
		if (tableContent[i].stock_quantity < 5) {
			console.log(tableContent[i].product_name);
		}
	}
	startPrompt();
}

function addInventory() {
	console.log("\n");
	inquirer.prompt({
			name: "product",
			type: "input",
			message: "\nInput the ID of the product you would like to order more of."
	}).then(function(answer) {
		console.log("You've selected "+tableContent[answer.product - 1].product_name);
		inquirer.prompt({
			name: "number",
			type: "input",
			message: "How many would you like to order?"
		}).then(function(response) {
			newStock = tableContent[answer.product - 1].stock_quantity + response.number;
			id = answer.product;
			console.log("newstock"+newStock+"\nid "+id);
			connection.query("UPDATE products SET ? WHERE ?", [{
  				stock_quantity: newStock
			}, {
  				item_id: id
			}], function(err, res) {});
			console.log("Success!");
			getCurrent();
			startPrompt();
		})
	})
}

function addProduct() {
	console.log("adding product");
}