var bc = require('bcryptjs');
var _  = require('underscore');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user', {
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
				var salt     = bc.genSaltSync(10);
				var hashPass = bc.hashSync(value, salt);

				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashPass);
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
		}
	});
};