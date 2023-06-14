import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { closeDB, connectDB, getCollectionItem, updateDoc } from "@/api/mongo";
import { hashPassword, verifyPassword } from "@/api/auth";

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({
      error: true,
      message: 'not authenticated',
      data: {},
    });

    return;
  }

  const { email } = session.user;

  const { newPassword, oldPassword } = req.body;

  try {
    await connectDB();
  } catch (err) {
    res.status(500).json({ error: true, message: 'database connection error', data: null})

    return;
  }


  try {
    const user = await getCollectionItem('accounts', { email });

    if (user.length === 0) {
      closeDB();

      res.status(404).json({ error: true, message: 'no user found!', data: null})

      return;
    }

    const isValid = await verifyPassword(oldPassword, user[0].password);

    if (!isValid) {
      closeDB();

      res.status(422).json({ error: true, message: 'not valid input!', data: null})

      return;
    }

    if (!newPassword.trim() || newPassword.trim().length< 7) {
      res.status(422).json({ error: true, message: 'invalid input', data: null});
  
      return;
    }

    const hashedPassword = await hashPassword(newPassword);
    const result = await updateDoc('accounts', email, hashedPassword);

    console.log(result)
    res.status(200).json({ error: false, message: 'success', data: null});
  } catch (err) {
    res.status(500).json({ error: true, message: 'failed to change password', data: null});
  }
}