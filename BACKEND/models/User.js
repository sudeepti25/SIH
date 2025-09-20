import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  server_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  mobile_number: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validate: {
      isNumeric: true,
      len: [10, 15]
    }
  },
  pin: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [4, 4]
    }
  },
  aadhaar_id: {
    type: DataTypes.STRING(12),
    allowNull: true,
    validate: {
      isNumeric: true,
      len: [12, 12]
    }
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isIn: [['M', 'F', 'Other']]
    }
  },
  device_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_mobile_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  synced_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['mobile_number', 'pin']
    },
    {
      fields: ['mobile_number']
    },
    {
      fields: ['device_id']
    }
  ],
  hooks: {
    beforeCreate: async (user) => {
      if (user.pin) {
        user.pin = await bcrypt.hash(user.pin, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('pin')) {
        user.pin = await bcrypt.hash(user.pin, 10);
      }
    }
  }
});

// Instance methods
User.prototype.validatePin = async function(pin) {
  return await bcrypt.compare(pin, this.pin);
};

User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.pin;
  return values;
};

export default User;
