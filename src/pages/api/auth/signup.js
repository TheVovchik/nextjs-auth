import { hashPassword } from "@/api/auth";
import { closeDB, connectDB, getCollectionItem, insertDoc } from "@/api/mongo"

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const { email, password } = req.body;

  if (!email || !email.includes('@') || !password.trim() || password.trim().length< 7) {
    res.status(422).json({ error: true, message: 'invalid input', data: null});

    return;
  }

  try {
    await connectDB();
  } catch (err) {
    res.status(500).json({ error: true, message: 'database connection error', data: null})

    return;
  }

  try {
    const user = await getCollectionItem('accounts', { email });

    if (user.length !== 0) {
      res.status(422).json({ error: true, message: 'user exists', data: null});
      closeDB();
      return;
    }

  } catch (err) {
    res.status(500).json({ error: true, message: 'database connection error', data: null})

    return;
  }

  const hashedPassword = await hashPassword(password);

  try {
    await insertDoc('accounts', { email, password: hashedPassword });

    res.status(201).json({ error: false, message: 'success', data: null});
  } catch (err) {
    res.status(500).json({ error: true, message: 'failed to create account', data: null});

    return;
  }

  closeDB();
}
