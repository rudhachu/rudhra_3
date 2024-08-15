const config = require('../../config');
const { DataTypes } = require('sequelize');

const chatDb = config.DATABASE.define("Chat", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  conversationTimestamp: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isGroup: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

const messageDb = config.DATABASE.define("message", {
  jid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
});

const contactDb = config.DATABASE.define("contact", {
  jid: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const saveContact = async (jid, name) => {
  try {
    if (!jid || !name) return;
    const isGroupJid = jid.endsWith('@g.us');
    if (isGroupJid) return;
    const exists = await contactDb.findOne({ where: { jid } });
    if (exists) {
      if (exists.name !== name) {
        await contactDb.update({ name }, { where: { jid } });
      }
    } else {
      await contactDb.create({ jid, name });
    }
  } catch (e) {
    console.error('Error saving contact:', e);
  }
};

const saveMessage = async (message, user) => {
  try {
    const jid = message.key.remoteJid;
    const id = message.key.id;
    const msg = message;
    if (!id || !jid || !msg) return;
    await saveContact(user, message.pushName);
    const exists = await messageDb.findOne({ where: { id, jid } });
    if (exists) {
      await messageDb.update({ message: msg }, { where: { id, jid } });
    } else {
      await messageDb.create({ id, jid, message: msg });
    }
  } catch (e) {
    console.error('Error saving message:', e);
  }
};

const loadMessage = async (id) => {
  if (!id) return;
  const message = await messageDb.findOne({ where: { id } });
  if (message) return message.dataValues;
  return false;
};

const saveChat = async (chat) => {
  if (chat.id === "status@broadcast" || chat.id === "broadcast") return;
  const isGroup = chat.id.endsWith('@g.us');
  if (!chat.id || !chat.conversationTimestamp) return;
  const exists = await chatDb.findOne({ where: { id: chat.id } });
  if (exists) {
    await chatDb.update(
      { conversationTimestamp: chat.conversationTimestamp },
      { where: { id: chat.id } }
    );
  } else {
    await chatDb.create({
      id: chat.id,
      conversationTimestamp: chat.conversationTimestamp,
      isGroup,
    });
  }
};

const getName = async (jid) => {
  const contact = await contactDb.findOne({ where: { jid } });
  if (!contact) return jid.split("@")[0].replace(/_/g, " ");
  return contact.name;
};

const StoreDB = config.DATABASE.define('Store', {
  storeid: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  store: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

const getstore = async (storeid) => {
  return await StoreDB.findAll({ where: { storeid } });
};

const storeWriteToDB = async (store, storeid) => {
  const exists = await StoreDB.findOne({ where: { storeid } });
  if (exists) {
    return await exists.update({ store });
  } else {
    return await StoreDB.create({ storeid, store });
  }
};

module.exports = {
  StoreDB,
  getstore,
  storeWriteToDB,
  saveMessage,
  loadMessage,
  saveChat,
  getName,
};