import fs from 'node:fs';
import { parse } from 'csv-parse';

const filePath = new URL('./tasks.csv', import.meta.url);

async function importTasksFromCsvFile() {
  const fileStream = fs.createReadStream(filePath, 'utf8');
  const csvParse = parse({
    delimiter: ',',
    from: 2,
  });

  const parser = fileStream.pipe(csvParse);

  for await (const chunk of parser) {
    const [title, description] = chunk;

    const body = JSON.stringify({ title, description });

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
  }
}

importTasksFromCsvFile();
