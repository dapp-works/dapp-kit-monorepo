import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { helper } from '@dappworks/kit';
import { error } from 'console';
import { env } from '~/env.mjs';

const handler =  NextAuth({
  providers: [
    GithubProvider({
      clientId: "14f83b848722e38be86a",
      clientSecret:"5885b3c007e3940bd1f3fdd8da563a5f19b670a4",
      authorization: {
        url: 'https://github.com/login/oauth/authorize',
        params: { scope: 'read:user user:email' },
      },
      // checks: ['none'],
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (user) {
        try {
          return true;
        } catch (error) {
          return false;
        }
      }
      return false;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        const iat = Date.now() / 1000;
        const exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
        token.token = await helper.encode({
          sub: user.id,
          name: user.name as string,
          iat,
          exp,
        });
      }
      return token;
    },
    async session({ session, user, token }) {
      // @ts-ignore
      session.user.id = token.sub;
      // @ts-ignore
      session.user.token = token.token;
      return session;
    },
  },
});

export {handler as GET,handler as POST};