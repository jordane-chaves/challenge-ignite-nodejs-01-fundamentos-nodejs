export async function json(request, response) {
  const buf = [];

  for await (const chunk of request) {
    buf.push(chunk);
  }

  const fullStreamContent = Buffer.concat(buf).toString();

  try {
    request.body = JSON.parse(fullStreamContent);
  } catch {
    request.body = null;
  }

  response.setHeader('Content-Type', 'application/json');
}
