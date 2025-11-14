import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Tree,
  TreeChildren,
  TreeParent,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/users/entities/user.entity'

@Entity()
@Tree('materialized-path')
export class Category {
  @ApiProperty({ description: 'Unique identifier for the category' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: 'Parent category ID', type: Number, nullable: true })
  @Column({ nullable: true })
  parentId: number | null

  @TreeParent()
  @JoinColumn()
  parent: Category | null

  @ApiProperty({ description: 'Name of the category' })
  @Column({ length: 100 })
  name: string

  @ApiProperty({ description: 'Description of the category', type: String, nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string | null

  @ApiProperty({ description: 'User ID who created the category', type: Number, nullable: true })
  @Column({ nullable: true })
  createdById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  createdBy: User | null

  @ApiProperty({ description: 'Timestamp when the category was created' })
  @CreateDateColumn()
  createdAt: Date

  @ApiProperty({
    description: 'User ID who last updated the category',
    type: Number,
    nullable: true,
  })
  @Column({ nullable: true })
  updatedById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  updatedBy: User | null

  @ApiProperty({ description: 'Timestamp when the category was last updated' })
  @UpdateDateColumn()
  updatedAt: Date

  @ApiProperty({ description: 'User ID who deleted the category', type: Number, nullable: true })
  @Column({ nullable: true })
  deletedById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  deletedBy: User | null

  @ApiProperty({
    description: 'Timestamp when the category was deleted',
    type: Date,
    nullable: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null

  @ApiProperty({ description: 'User ID who restored the category', type: Number, nullable: true })
  @Column({ nullable: true })
  restoredById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  restoredBy: User | null

  @ApiProperty({
    description: 'Timestamp when the category was restored',
    type: Date,
    nullable: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  restoredAt: Date | null

  @ApiProperty({ description: 'Whether the category is active' })
  @Column({ default: true, type: 'tinyint' })
  isActive: boolean

  @ApiProperty({ description: 'Whether the category is deleted' })
  @Column({ default: false, type: 'tinyint' })
  isDeleted: boolean

  @TreeChildren()
  @ApiProperty({ description: 'Child categories', type: () => [Category] })
  children: Category[]
}
