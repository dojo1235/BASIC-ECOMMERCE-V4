import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/users/entities/user.entity'

export enum ProductStatus {
  InStock = 'inStock',
  Discontinued = 'discontinued',
  OutOfStock = 'outOfStock',
}

@Entity()
export class Product {
  @ApiProperty({ description: 'Unique identifier for the product' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: 'Name of the product' })
  @Column({ type: 'varchar', length: 150 })
  name: string

  @ApiProperty({ description: 'Product description', type: String })
  @Column({ type: 'text', nullable: true })
  description: string | null

  @ApiProperty({ description: 'Product price in USD' })
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number

  @ApiProperty({ description: 'URL of the product image' })
  @Column({ type: 'varchar', length: 255 })
  image: string

  @ApiProperty({ description: 'Number of items currently in stock' })
  @Column({ type: 'int', default: 0 })
  stock: number

  @ApiProperty({
    enum: ProductStatus,
    description: 'Current availability status of the product',
  })
  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.InStock })
  status: ProductStatus

  @ApiProperty({ description: 'Indicates if the product has been soft-deleted' })
  @Column({ type: 'tinyint', default: false })
  isDeleted: boolean

  @ApiProperty({ description: 'User ID of the creator', type: Number })
  @Column({ nullable: true })
  createdById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  createdBy: User | null

  @ApiProperty({ description: 'Date and time the product was created' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @ApiProperty({ description: 'User ID of the last updater', type: Number })
  @Column({ nullable: true })
  updatedById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  updatedBy: User | null

  @ApiProperty({ description: 'Date and time the product was last updated', type: Date })
  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null

  @ApiProperty({ description: 'User ID of the person who deleted the product', type: Number })
  @Column({ nullable: true })
  deletedById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  deletedBy: User | null

  @ApiProperty({ description: 'Timestamp when the product was deleted', type: Date })
  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null

  @ApiProperty({ description: 'User ID of the person who restored the product', type: Number })
  @Column({ nullable: true })
  restoredById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  restoredBy: User | null

  @ApiProperty({ description: 'Timestamp when the product was restored', type: Date })
  @Column({ type: 'timestamp', nullable: true })
  restoredAt: Date | null
}
