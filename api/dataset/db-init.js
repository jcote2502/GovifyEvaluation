const { Client } = require('pg');

// File is used to create the local database with specif admin role
// Can also be used as a delete database function

// Exucuted by node dataset/db-init.js

// In a production setting they would be stored in env files 
// For sake of time with the assignment i just typed them in as I went

async function initializeDatabase() {

    const client = new Client({
        role: 'postgres',
        host: 'localhost',
        database: 'postgres',
        port: 5432
    });

    const db_init = {
        database:'wellfound',
        password:'wellfound',
        role:'admin',
        host:'127.0.0.1'
    }


    try {
        await client.connect();

        await client.query(`CREATE DATABASE ${db_init.database};`);

        await client.query(`CREATE USER ${db_init.role} WITH PASSWORD '${db_init.password}';`);

        await client.query(`GRANT ALL PRIVILEGES ON DATABASE ${db_init.database} TO ${db_init.role};`);

        console.log('Database and user created successfully!');
    } catch (err) {
        console.error('Error initializing database:', err.message);
    } finally {
        await client.end();
    }


    // FOR DEVELOPEMENT PURPOSES


    // try {
    //     await client.connect();
    //     await client.query(`DROP DATABASE ${db_init.database};`);
    //     await client.query(`DROP ROLE "${db_init.role}";`);
    //     console.log('Database and user deleted successfully!');
    // } catch (err) {
    //     console.error('Error initializing database:', err.message);
    // } finally {
    //     await client.end();
    // }



}

initializeDatabase();
