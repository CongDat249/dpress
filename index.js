const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

class Dpress {
	routes = [];
	config = {
		extname: ".html",
		viewDir: path.join(__dirname, "views"),
    viewEngine: () => { return '' },
	};
	views = {};

	start(config) {
		// Config server
		this.config = Object.assign(this.config, config);

		// Read views dir
		fs.readdir(this.config.viewDir, (err, files) => {
			files = files.filter((file) => path.extname(file) == this.config.extname);
			this.views = files.reduce((acc, file) => {
				// remove extname
				file = path.parse(file).name;
				const filepath = path.join(
					this.config.viewDir,
					file + this.config.extname
				);
        acc[file] = fs.readFileSync(filepath, "utf-8");
        return acc;
			}, {});
		});
	}

  set(key, value) {
    this.config[key] = value;
  }

	get(pathName, callback) {
		this.routes.push({ pathName, method: "GET", callback });
	}

	getRoutes() {
		this.routes.forEach((route) => {
			console.log(route);
		});
	}

	getViewContent() {}

	createServer() {
		this.server = http.createServer((req, res) => {
      // Add render method for res
      res.render = (filename, objData) => {
        console.log(this.views[filename]);
        res.end(this.config.viewEngine(this.views[filename], objData));
      }
			const { query, pathname, path } = url.parse(req.url, true);
			this.routes.forEach((route) => {
				if (pathname === route.pathName && req.method === route.method) {
					route.callback(req, res);
				}
			});
		});
	}

	listen(port, callback) {
    this.start();
		this.createServer();
		this.server.listen(port, () => {
			callback();
		});
	}
}

module.exports = new Dpress();
