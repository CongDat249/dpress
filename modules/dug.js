function handleString(template, dataObj) {
	const regex = /{%([A-Za-z_0-9'?:.\- ]+)%}/g;
	const ifReg = /if:(\w+) \? (\S+) : (\S+)/g;
	let key = "";
	return template.replace(regex, pattern => {
		let matches_array = ifReg.exec(pattern);
		if (matches_array) {
			key = matches_array[1];
			let trueValue = matches_array[2];
			let falseValue = matches_array[3].slice(0, -2);
			return dataObj[key] ? trueValue : falseValue;
		}
		key = pattern.match(/\w+/)[0];
		return dataObj[key];
	});
}

module.exports = handleString;