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
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number

  @Exclude()
  @Column()
  userId: number

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  token: string

  @Exclude()
  @Column({ type: 'tinyint', default: false })
  revoked: boolean

  @Exclude()
  @Column({ type: 'timestamp' })
  expiresAt: Date

  @Exclude()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @Exclude()
  @Column({ type: 'int', nullable: true })
  revokedById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  revokedBy: User | null

  @Exclude()
  @Column({ type: 'timestamp', nullable: true })
  revokedAt: Date | null
}
