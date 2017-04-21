var mysql = require("mysql");
var inquirer = require("inquirer");
var tableContent = "";

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "elecornos",
	database: "bamazon"
});

connection.connect(function(err) {
	if(err) throw err;
	console.log("connection successful.  id: "+connection.threadId);
});

connection.query("select * from products", function(err, res) {
	tableContent = res;
	if(err) throw err;
	for (i=0;i<res.length;i++) {
		console.log(
			"\nProduct: "+res[i].product_name+
			"\nID: "+res[i].item_id+
			"\nDepartment: "+res[i].department_name+
			"\nPrice: $"+res[i].price+
			"\n# In Stock: "+res[i].stock_quantity
		);
	}
});


var purchasePrompt = function() {
	inquirer.prompt({
		name: "product",
		type: "input",
		message: "\nWhich product are you interested in?  Input the ID of the product."
	}).then(function(answer) {
		console.log("You've selected "+tableContent[answer.product - 1].product_name);
		inquirer.prompt({
			name: "number",
			type: "input",
			message: "\nHow many would you like to buy?"
		}).then(function(response) {
			if (response.number > tableContent[answer.product - 1].stock_quantity) {
				console.log("Insufficient Quantity Available. Restarting...\n");
				purchasePrompt();
			} else {
				newStock = tableContent[answer.product - 1].stock_quantity - response.number;
				id = answer.product;
				console.log("newstock"+newStock+"\nid "+id);
				connection.query("UPDATE products SET ? WHERE ?", [{
  					stock_quantity: newStock
				}, {
  					item_id: id
				}], function(err, res) {});
				itemCost = tableContent[answer.product - 1].price;
				purchaseCost = response.number * itemCost;
				console.log("Your total purchase price is $"+purchaseCost);
				purchasePrompt();
			}
		});
	})
}

setTimeout(function() {purchasePrompt();}, 500);