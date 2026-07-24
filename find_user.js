const { sequelize, User } = require('./src/models');

async function findUser() {
    const user = await User.findOne({ where: { email: 'gt64384@gmail.com' }});
    console.log(user ? user.toJSON() : 'Not found');
    process.exit(0);
}
findUser();
