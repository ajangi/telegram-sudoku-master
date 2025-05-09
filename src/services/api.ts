export async function createUser({
  telegramId,
  name,
  avatar,
}: {
  telegramId: string;
  name: string;
  avatar: string;
}) {
  const res = await fetch('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegramId, name, avatar }),
  });
  console.log(res);
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
}
