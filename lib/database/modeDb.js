const { Sequelize, DataTypes } = require('sequelize');
const config = require('../../config');

const modeDB = config.DATABASE.define('mode', {
    state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

async function getMode() {
  let mode = await modeDB.findOne();
  if (!mode) {
    mode = await modeDB.create({ state: false }); 
  }
  return mode;
}

async function updateMode(value = false) {
  let mode = await modeDB.findOne();
  if (mode) {
    await mode.update({ state: value });
  } else {
    mode = await modeDB.create({ state: value });
  }
  return mode;
}

module.exports = {
  modeDB: modeDB,
  getMode: getMode,
  updateMode: updateMode
};