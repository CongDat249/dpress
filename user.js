const dpress = require("./index");
const dug = require("./modules/dug");
const PORT = 4000;

dpress.set('viewEngine', dug);

dpress.get("/", (req, res) => {
  res.render("index");
});

dpress.get("/about", (req, res) => {
  res.render("about")
})

dpress.listen(PORT, () => {
	console.log("Server is running");
});
