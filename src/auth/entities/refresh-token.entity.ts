import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm'
import { User } from 'src/users/entities/user.entity'

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @Column({ type: 'varchar', length: 255 })
  token: string

  @Column({ type: 'tinyint', default: false })
  revoked: boolean

  @Column({ type: 'timestamp' })
  expiresAt: Date

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  revokedBy: User

  @Column({ type: 'timestamp', nullable: true })
  revokedAt: Date | null
}