import { v4 as uuidv4 } from "uuid";
import { employeeNotificationQueue } from "../queues/employeeNotification.queue.js";
import { employeeImportQueue } from "../queues/employeeImport.queue.js";

export let employees = [];

export const getEmployees = (req, res) => { 
  return res.json({
    success: true,
    data: employees,
  });
};

export const getEmployeeById = (req, res) => {
  const employee = employees.find((e) => e.id === req.params.id);

  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  return res.json({
    success: true,
    data: employee,
  });
};

export const createEmployee = async (req, res) => {
  const { name, age, position, salary } = req.body;

  if (!name || !age || !position || !salary) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const employee = {
    id: uuidv4(),
    name,
    age,
    position,
    salary,
    created_at: new Date(),
    updated_at: new Date(),
  };

  employees.push(employee);

  await employeeNotificationQueue.add({
    employeeId: employee.id,
    name: employee.name,
    action: "create",
  });
  
  return res.status(201).json({
    success: true,
    data: employee,
  });
};

export const importEmployeeCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "CSV file is required" });
  }

  const jobId = uuidv4();

  await employeeImportQueue.add({
    type: "IMPORT_CSV",
    jobId,
    filePath: req.file.path,
  });

  return res.status(202).json({
    success: true,
    message: "CSV uploaded, processing started",
    jobId,
  });
};

export const updateEmployee = (req, res) => {
  const index = employees.findIndex((e) => e.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Employee not found" });
  }

  employees[index] = {
    ...employees[index],
    ...req.body,
    updated_at: new Date(),
  };

  return res.json({
    success: true,
    data: employees[index],
  });
};

export const deleteEmployee = (req, res) => {
  const index = employees.findIndex((e) => e.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Employee not found" });
  }

  employees.splice(index, 1);

  return res.json({
    success: true,
    message: "Employee deleted",
  });
};
