import { employeeQueue } from "@/queues/employeeQueue.js";
import { io } from "@/server/socket.js";
employeeQueue.process(async (job) => {
  const { employeeId, name, action } = job.data;

  await new Promise((resolve) => setTimeout(resolve, 2000));

  io.emit("employeeNotification", {
    message: `Employee "${name}" telah diproses`,
    employeeId,
    action,
  });

  return Promise.resolve();
});
