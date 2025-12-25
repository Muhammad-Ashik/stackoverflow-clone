import bcrypt from 'bcryptjs'
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  OneToMany,
} from 'typeorm'
import { PASSWORD } from '../constants'
import { BaseEntity } from './Common'
import { Question } from './Question'

@Entity('user')
@Index(['email'], { unique: true })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string

  @Column({ type: 'varchar', length: 255, select: false })
  password!: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  googleId?: string

  @OneToMany(() => Question, (question) => question.user)
  questions: Question[]

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password && !this.password.startsWith(PASSWORD.BCRYPT_PREFIX)) {
      this.password = await bcrypt.hash(this.password, PASSWORD.BCRYPT_ROUNDS)
    }
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    if (this.password && !this.password.startsWith(PASSWORD.BCRYPT_PREFIX)) {
      this.password = await bcrypt.hash(this.password, PASSWORD.BCRYPT_ROUNDS)
    }
  }
}
