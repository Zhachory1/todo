module.exports = function (seq, dt) {
	return seq.define('todo', {
		description: {
			type: dt.STRING,
			allowNull: false,
			validate: {
				len: [1, 256]
			}
		},
		completed: {
			type: dt.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	});
};