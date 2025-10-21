import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Transform } from 'class-transformer'
import { User } from 'src/users/entities/user.entity'

@Entity()
export class RefreshToken {
  @ApiProperty({ example: 1, description: 'Unique identifier of the refresh token' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ example: 42, description: 'ID of the user this token belongs to' })
  @Column()
  userId: number

  @ApiProperty({ type: () => User, description: 'User entity associated with this token' })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  token: string

  @ApiProperty({ example: false, description: 'Whether this token has been revoked' })
  @Column({ type: 'tinyint', default: false })
  revoked: boolean

  @ApiProperty({
    example: '2025-12-31T23:59:59.000Z',
    description: 'Date and time when this token expires',
  })
  @Transform(({ value }) => value?.toISOString())
  @Column({ type: 'timestamp' })
  expiresAt: Date

  @ApiProperty({
    example: '2025-10-19T15:30:00.000Z',
    description: 'Date and time when this token was created',
  })
  @Transform(({ value }) => value?.toISOString())
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  // Separate revokedById column
  @ApiProperty({ example: 1, description: 'ID of the user who revoked this token', nullable: true })
  @Column({ type: 'int', nullable: true })
  revokedById: number | null

  @ApiProperty({
    type: () => User,
    description: 'User who revoked this token (if applicable)',
    nullable: true,
  })
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'revokedById' })
  revokedBy: User

  @ApiProperty({
    example: null,
    description: 'Date and time when this token was revoked (null if still valid)',
    nullable: true,
  })
  @Transform(({ value }) => value?.toISOString() ?? null)
  @Column({ type: 'timestamp', nullable: true })
  revokedAt: Date | null
}
