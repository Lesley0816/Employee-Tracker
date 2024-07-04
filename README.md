# -Employee-Tracker

## Description

A command-line application to manage a company's departments, roles, and employees using Node.js, Inquirer, and MySQL. This application allows business owners to view and manage the company's organizational structure efficiently.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

1. Clone the repository to your local machine:
    ```bash
    git clone https://github.com/yourusername/company-management-system.git
    cd company-management-system
    ```

2. Install the required dependencies:
    ```bash
    npm install
    ```

3. Set up the MySQL database:
    - Open MySQL command line or MySQL Workbench.
    - Run the SQL script provided in `schema.sql` to create the database and tables.

    ```sql
    CREATE DATABASE company_db;

    USE company_db;

    CREATE TABLE department (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(30) NOT NULL
    );

    CREATE TABLE role (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(30) NOT NULL,
        salary DECIMAL(10, 2) NOT NULL,
        department_id INT,
        FOREIGN KEY (department_id) REFERENCES department(id)
    );

    CREATE TABLE employee (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(30) NOT NULL,
        last_name VARCHAR(30) NOT NULL,
        role_id INT,
        manager_id INT,
        FOREIGN KEY (role_id) REFERENCES role(id),
        FOREIGN KEY (manager_id) REFERENCES employee(id)
    );
    ```

4. Update the database connection configuration in `index.js` with your MySQL credentials:
    ```javascript
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'your_password',
        database: 'company_db'
    });
    ```

## Usage

Run the application using Node.js:
```bash
node index.js
 