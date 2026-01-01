import { employees } from "../controllers/employee.controller.js";
import { io } from "../socket.js";
import { processCSV } from "../utils/csvImporter.js";
import { v4 as uuidv4 } from "uuid";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const employeeImportQueue = {
  add: async (job) => {
    setTimeout(() => processImport(job), 1000);
  },
};

const processImport = async (job) => {
  await processCSV({
    filePath: job.filePath,

    onBatch: async (batch) => {
      const employeesWithId = batch.map((row) => ({
        id: uuidv4(),
        ...row,
        created_at: new Date(),
        updated_at: new Date(),
      }));

      employees.push(...employeesWithId);
      console.log(batch)
      await sleep(2000);
    },

    onProgress: (processed) => {
      io.emit("employeeImportProgress", {
        jobId: job.jobId,
        processed,
      });
    },
  });

  io.emit("employeeImportDone", {
    jobId: job.jobId,
  });
};
