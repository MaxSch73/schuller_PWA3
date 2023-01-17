// import fs from 'fs/promises';
// import path from 'path';

// const file = path.join(process.cwd(), 'src/api/model/employees.json');

// let { employees } = JSON.parse(await fs.readFile(file));

import data from './employees.json' assert { type: 'json' };
let { employees } = data;

const getEmployees = () => employees;
const delEmployee = (id) => {
  const index = employees.findIndex((el) => el.id === id);
  if (index === -1) return 404;
  employees.splice(index, 1);
  return 204;
};

export { getEmployees, delEmployee };
