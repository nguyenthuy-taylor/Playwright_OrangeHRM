import mysql from 'mysql2/promise';

export async function getDBConnection() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3307,
        user: 'root',
        password: '',
        database: 'orangehrm'
    });
    return connection;
    

}