// Sequelize-TypeScript approach
import { Model, Column, Table, HasMany } from 'sequelize-typescript'

@Table
class User extends Model {
  @Column
  declare name: string

  @HasMany(() => Post)
  declare posts: Post[]
}

// Requires more setup and manual type definitions
const user = await User.findOne({
  where: { id: 1 },
  include: [Post]
})
