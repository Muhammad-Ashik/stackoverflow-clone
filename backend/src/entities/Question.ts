import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from './Common'
import { User } from './User'

@Entity('question')
export class Question extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string

  @Column({ type: 'text' })
  description: string

  @ManyToOne(() => User, (user) => user.questions)
  user: User
}
