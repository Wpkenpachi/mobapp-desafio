const bcrypt = require('bcrypt');
const salt = 10;
const Parse = require('parse/node');
Parse.initialize(process.env.APPLICATION_ID, null, process.env.MASTER_KEY);
Parse.serverURL = process.env.SERVER_URL;
const UserModel = Parse.Object.extend("user");

async function getUser(userData) {
    let query = new Parse.Query(UserModel);
    query = query.equalTo("username", userData.username);
    const user = await query.first();
    if (!await bcrypt.compare(userData.password, user.get("password"))) {
        return false;
    }
    return user;
}

async function checkUserExists(userData) {
    let query = new Parse.Query(UserModel);
    query = query.equalTo("username", userData.username);
    return await query.count();
}

async function storeUser(userData) {
    const user = new UserModel();
    userData.password = await bcrypt.hash(userData.password, bcrypt.genSaltSync(salt));
    return await user.save(userData);
}

module.exports = { storeUser, getUser, checkUserExists }