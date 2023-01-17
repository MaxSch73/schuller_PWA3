import { Router } from 'express';

const router = Router();

import { getEmployees, delEmployee } from '../model/employees.js';

router.get('/', (req, res) => res.json(getEmployees()));
router.delete('/:id', ({ params }, res) => res.status(delEmployee(Number(params.id))).end());

export default router;
