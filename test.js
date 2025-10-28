"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./src/users/entities/user.entity");
const options = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [user_entity_1.User],
    synchronize: true,
    logging: false,
};
const main = async () => {
    const dataSource = new typeorm_1.DataSource(options);
    await dataSource.initialize();
    const usersRepo = dataSource.getRepository(user_entity_1.User);
    try {
        const existing = await usersRepo.findOne({ where: { email: 'alice@example.com' } });
        if (existing) {
            await usersRepo.delete(existing.id);
            console.log('Deleted existing user:', existing);
        }
        const inserted = await usersRepo.save(usersRepo.create({
            name: 'Alice',
            email: 'alice@example.com',
            passwordHash: 'secret123',
        }));
        console.log('Inserted user:', inserted);
        const found = await usersRepo.findOne({ where: { email: 'alice@example.com' } });
        if (!found)
            throw new Error('User not found');
        console.log('Found user:', found);
        const updated = await usersRepo.save({ id: found.id, name: 'Alice Updated' });
        console.log('Updated user:', updated);
        const deleted = await usersRepo.delete(found.id);
        console.log('Deleted user:', deleted);
    }
    catch (err) {
        console.error('Error during CRUD test:', err);
    }
    finally {
        await dataSource.destroy();
    }
};
main();
//# sourceMappingURL=test.js.map