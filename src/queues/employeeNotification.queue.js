import { io } from "../socket.js";

const jobQueue = [];

export const employeeNotificationQueue = {
  add: async (job) => {
    jobQueue.push(job); 

    setTimeout(async () => {  
      io.emit("employeeNotification", {
        message: `Employee "${job.name}" telah diproses`,
        employeeId: job.employeeId,
        action: job.action,
      });

    }, 100);
  },
};
