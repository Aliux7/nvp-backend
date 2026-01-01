import fs from "fs";
import csv from "csv-parser";

export const processCSV = async ({ filePath, onBatch, onProgress }) => {
  const BATCH_SIZE = 100;

  let batch = [];
  let processed = 0;
  let total = 0;
  let isProcessing = false;

  await new Promise((resolve) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", () => total++)
      .on("end", resolve);
  });

  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath).pipe(csv());

    stream.on("data", async (row) => {
      stream.pause();

      batch.push({
        name: row.name,
        age: Number(row.age),
        position: row.position,
        salary: Number(row.salary),
      });

      if (batch.length === BATCH_SIZE && !isProcessing) {
        isProcessing = true;

        await onBatch([...batch]);
        processed += batch.length;
        batch = [];

        onProgress(Math.round((processed / total) * 100));
        isProcessing = false;
      }

      stream.resume();
    });

    stream.on("end", async () => { 
      if (batch.length > 0 && !isProcessing) {
        await onBatch([...batch]);
        processed += batch.length;
      }

      onProgress(100);
      fs.unlinkSync(filePath);
      resolve();
    });

    stream.on("error", reject);
  });
};
