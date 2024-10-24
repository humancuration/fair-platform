// Your current stack but with Prisma instead of Sequelize
import prisma from '../src/lib/prisma'

// Type-safe queries out of the box
const getUserWithPosts = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { posts: true }
  })
  return user
}
