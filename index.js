const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Connect to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'company_db'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to the database.');
    startApp();
});

// Start the application
function startApp() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    }).then(answer => {
        switch (answer.action) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    });
}

function viewDepartments() {
    const query = 'SELECT * FROM department';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
}

function viewRoles() {
    const query = `
        SELECT role.id, role.title, role.salary, department.name AS department
        FROM role
        LEFT JOIN department ON role.department_id = department.id
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
}

function viewEmployees() {
    const query = `
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON manager.id = employee.manager_id
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
}

function addDepartment() {
    inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'Enter the name of the department:'
    }).then(answer => {
        const query = 'INSERT INTO department SET ?';
        connection.query(query, { name: answer.name }, (err, res) => {
            if (err) throw err;
            console.log(`Department ${answer.name} added!`);
            startApp();
        });
    });
}

function addRole() {
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'Enter the title of the role:'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Enter the salary of the role:'
        },
        {
            name: 'department_id',
            type: 'input',
            message: 'Enter the department ID of the role:'
        }
    ]).then(answer => {
        const query = 'INSERT INTO role SET ?';
        connection.query(query, { title: answer.title, salary: answer.salary, department_id: answer.department_id }, (err, res) => {
            if (err) throw err;
            console.log(`Role ${answer.title} added!`);
            startApp();
        });
    });
}

function addEmployee() {
    inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: 'Enter the first name of the employee:'
        },
        {
            name: 'last_name',
            type: 'input',
            message: 'Enter the last name of the employee:'
        },
        {
            name: 'role_id',
            type: 'input',
            message: 'Enter the role ID of the employee:'
        },
        {
            name: 'manager_id',
            type: 'input',
            message: 'Enter the manager ID of the employee (if any):'
        }
    ]).then(answer => {
        const query = 'INSERT INTO employee SET ?';
        connection.query(query, { first_name: answer.first_name, last_name: answer.last_name, role_id: answer.role_id, manager_id: answer.manager_id || null }, (err, res) => {
            if (err) throw err;
            console.log(`Employee ${answer.first_name} ${answer.last_name} added!`);
            startApp();
        });
    });
}

function updateEmployeeRole() {
    inquirer.prompt([
        {
            name: 'employee_id',
            type: 'input',
            message: 'Enter the ID of the employee whose role you want to update:'
        },
        {
            name: 'role_id',
            type: 'input',
            message: 'Enter the new role ID:'
        }
    ]).then(answer => {
        const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
        connection.query(query, [answer.role_id, answer.employee_id], (err, res) => {
            if (err) throw err;
            console.log(`Employee's role updated!`);
            startApp();
        });
    });
}
