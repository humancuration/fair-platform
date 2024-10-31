import { Auth } from "@auth/core"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "../lib/prisma"

// Social providers
import Google from "@auth/core/providers/google"
import GitHub from "@auth/core/providers/github"
import Discord from "@auth/core/providers/discord"
import Twitter from "@auth/core/providers/twitter"
import LinkedIn from "@auth/core/providers/linkedin"
import TikTok from "@auth/core/providers/tiktok"
import Instagram from "@auth/core/providers/instagram"
import Facebook from "@auth/core/providers/facebook" // Required for Threads
import Pinterest from "@auth/core/providers/pinterest"

// Fediverse/ActivityPub
import Mastodon from "@auth/core/providers/mastodon"
import Pixiv from "@auth/core/providers/pixiv"
import Matrix from "@auth/core/providers/matrix"

// Asian markets
import WeChat from "@auth/core/providers/wechat"
import Line from "@auth/core/providers/line"
import Kakao from "@auth/core/providers/kakao"
import Naver from "@auth/core/providers/naver"
import Mixi from "@auth/core/providers/mixi"
import Weibo from "@auth/core/providers/weibo"

// European/Russian markets
import VK from "@auth/core/providers/vk"

// Global messaging
import Telegram from "@auth/core/providers/telegram"
import XMPP from "@auth/core/providers/xmpp"

// Decentralized platforms
import BlueSky from "@auth/core/providers/bluesky" // Once available

// Enterprise
import KeycloakProvider from "@auth/core/providers/keycloak"

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Major social platforms
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    Twitter({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    }),
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
    
    // Meta platforms
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    Instagram({
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    }),
    // Threads uses Facebook OAuth
    
    // Creative platforms
    TikTok({
      clientId: process.env.TIKTOK_CLIENT_ID,
      clientSecret: process.env.TIKTOK_CLIENT_SECRET,
    }),
    Pinterest({
      clientId: process.env.PINTEREST_CLIENT_ID,
      clientSecret: process.env.PINTEREST_CLIENT_SECRET,
    }),
    Pixiv({
      clientId: process.env.PIXIV_CLIENT_ID,
      clientSecret: process.env.PIXIV_CLIENT_SECRET,
    }),
    
    // Fediverse/ActivityPub
    Mastodon({
      clientId: process.env.MASTODON_CLIENT_ID,
      clientSecret: process.env.MASTODON_CLIENT_SECRET,
      server: process.env.MASTODON_SERVER
    }),

    // Asian markets
    WeChat({
      clientId: process.env.WECHAT_CLIENT_ID,
      clientSecret: process.env.WECHAT_CLIENT_SECRET,
    }),
    Line({
      clientId: process.env.LINE_CLIENT_ID,
      clientSecret: process.env.LINE_CLIENT_SECRET,
    }),
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
    Naver({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
    }),
    Mixi({
      clientId: process.env.MIXI_CLIENT_ID,
      clientSecret: process.env.MIXI_CLIENT_SECRET,
    }),
    Weibo({
      clientId: process.env.WEIBO_CLIENT_ID,
      clientSecret: process.env.WEIBO_CLIENT_SECRET,
    }),

    // European/Russian markets
    VK({
      clientId: process.env.VK_CLIENT_ID,
      clientSecret: process.env.VK_CLIENT_SECRET,
    }),

    // Messaging platforms
    Telegram({
      clientId: process.env.TELEGRAM_CLIENT_ID,
      clientSecret: process.env.TELEGRAM_CLIENT_SECRET,
    }),
    Matrix({
      clientId: process.env.MATRIX_CLIENT_ID,
      clientSecret: process.env.MATRIX_CLIENT_SECRET,
      server: process.env.MATRIX_SERVER,
    }),
    XMPP({
      clientId: process.env.XMPP_CLIENT_ID,
      clientSecret: process.env.XMPP_CLIENT_SECRET,
      server: process.env.XMPP_SERVER,
    }),

    // Decentralized platforms
    // BlueSky({ // Once available
    //   clientId: process.env.BLUESKY_CLIENT_ID,
    //   clientSecret: process.env.BLUESKY_CLIENT_SECRET,
    // }),

    // Enterprise features
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    })
  ],
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: user.role,
          permissions: user.permissions,
          groups: user.groups,
          organization: user.organization,
        },
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        
        if (account?.provider === 'keycloak') {
          token.accessToken = account.access_token
          token.refreshToken = account.refresh_token
          token.idToken = account.id_token
        }
      }
      return token
    }
  },
  events: {
    async signIn({ user, account, profile }) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'SIGN_IN',
          provider: account.provider,
          metadata: {
            ip: profile.ip,
            userAgent: profile.userAgent,
          }
        }
      })
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    encryption: true,
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    newUser: '/auth/new-user'
  }
}