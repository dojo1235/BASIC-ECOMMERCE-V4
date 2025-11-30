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
  @Column({ type: 'int', nullable: true })
  parentId: number | null

  @TreeParent()
  @JoinColumn()
  parent: Category | null

  @ApiProperty({ description: 'Name of the category' })
  @Column({ type: 'varchar', length: 50 })
  name: string

  @ApiProperty({ description: 'Description of the category', type: String, nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string | null

  @ApiProperty({ description: 'Whether the category is active' })
  @Column({ type: 'tinyint', default: true })
  isActive: boolean

  @ApiProperty({ description: 'User ID who created the category', type: Number, nullable: true })
  @Column({ type: 'int', nullable: true })
  createdById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  createdBy: User | null

  @ApiProperty({ description: 'Timestamp when the category was created' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @ApiProperty({
    description: 'User ID who last updated the category',
    type: Number,
    nullable: true,
  })
  @Column({ type: 'int', nullable: true })
  updatedById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  updatedBy: User | null

  @ApiProperty({ description: 'Timestamp when the category was last updated' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @ApiProperty({ description: 'Child categories', type: () => [Category] })
  @TreeChildren()
  children: Category[]
}
