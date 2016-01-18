var bc = require('bcryptjs');
var _  = require('underscore');

module.exports = function(sequelize, DataTypes) {
	var user = sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		salt: {
			type: DataTypes.STRING
		},
		password_hash: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			defaultValue: false,
			validate: {
				len: [7, 50],
				isString: function (value) {
					if (typeof value !== 'string') {
						throw new Error('Password must be a string');
					}
				}
			},
			set: function (value) {
				if (typeof value === 'string') {
					var salt     = bc.genSaltSync(10);
					var hashPass = bc.hashSync(value, salt);

					this.setDataValue('password', value);
					this.setDataValue('salt', salt);
					this.setDataValue('password_hash', hashPass);
				}
			}
		}
	}, {
		hooks: {
			beforeValidate: function (user, options) {
				if (typeof user.email === "string") {
					user.email = user.email.toLowerCase();
				};
			}
		},
		instanceMethods: {
			toPublicJSON: function () {
				var json = this.toJSON();
				return _.pick(json, "id", "email", "updatedAt", "createdAt");
			}
		},
		classMethods: {
			auth: function (body) {
				return new Promise(function (resolve, reject) {
					if (typeof body.email === "string" && typeof body.password === "string") {
						body.email = body.email.trim();
						user.findOne({
							where: {
								email: body.email
							}
						}).then(function (user) {
							if(user && bc.compareSync(body.password, user.get('password_hash'))) {
								resolve(user);
							} else {
								reject();
							}
						}).catch(function (e) {
							reject();
						});
					} else {
						reject();
					}
				});
			}
		}
	});

	return user;
};