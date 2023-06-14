import { verifyPassword } from '@/api/auth';
import { closeDB, connectDB, getCollectionItem } from '@/api/mongo';
import NextAuth from 'next-auth/next';
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        const { email, password } = credentials;

        try {
          await connectDB();
        } catch (err) {
          throw new Error('database connection error');
        }

        try {
          const user = await getCollectionItem('accounts', { email });

          if (user.length === 0) {
            closeDB();

            throw new Error('No user found!');
          }

          const isValid = await verifyPassword(password, user[0].password);

          if (!isValid) {
            closeDB();

            throw new Error('Could not log you in!');
          }

          return {
            email: user[0].email,
          };
        } catch (err) {
          throw new Error(err.message || 'something went wrong');
        }
      }
    })
  ]
}

export default NextAuth(authOptions)
