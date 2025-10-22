import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import { User } from 'src/users/entities/user.entity'

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  token: string

  @Column({ type: 'tinyint', default: false })
  revoked: boolean

  @Column({ type: 'timestamp' })
  expiresAt: Date

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @Column({ type: 'int', nullable: true })
  revokedById: number | null

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  revokedBy: User

  @Column({ type: 'timestamp', nullable: true })
  revokedAt: Date | null
}
