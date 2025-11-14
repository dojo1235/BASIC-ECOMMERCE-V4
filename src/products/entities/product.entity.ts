import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/users/entities/user.entity'
import { Seller } from 'src/sellers/entities/seller.entity'
import { Country } from 'src/countries/entities/country.entity'
import { Category } from './category.entity'
import { ProductImage } from './product-image.entity'

export enum ProductStatus {
  InStock = 'inStock',
  Discontinued = 'discontinued',
  OutOfStock = 'outOfStock',
}

export enum ProductPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Featured = 4,
}

@Entity()
export class Product {
  @ApiProperty({ description: 'Unique identifier for the product' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: 'Seller ID that owns this product' })
  @Column()
  sellerId: number

  @Exclude()
  @ManyToOne(() => Seller, { onDelete: 'CASCADE' })
  @JoinColumn()
  seller: Seller

  @ApiProperty({ description: 'Name of the product' })
  @Column({ type: 'varchar', length: 150 })
  name: string

  @ApiProperty({ description: 'Product description', type: String, nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string | null

  @ApiProperty({ description: 'Product price in USD' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number

  @ApiProperty({ description: 'Original price before discount', type: Number, nullable: true })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice: number | null

  @ApiProperty({ description: 'Name of the brand' })
  @Column({ type: 'varchar', length: 100 })
  brandName: string

  @ApiProperty({ description: 'Category ID of the product' })
  @Column()
  categoryId: number

  @Exclude()
  @ManyToOne(() => Category, { onDelete: 'SET NULL' })
  @JoinColumn()
  category: Category

  @ApiProperty({ description: 'Country ID of the product origin' })
  @Column()
  countryId: number

  @Exclude()
  @ManyToOne(() => Country, { onDelete: 'SET NULL' })
  @JoinColumn()
  country: Country

  @ApiProperty({ description: 'Number of items currently in stock' })
  @Column({ type: 'int', default: 0 })
  stock: number

  @ApiProperty({
    enum: ProductStatus,
    description: 'Current availability status of the product',
  })
  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.InStock })
  status: ProductStatus

  @ApiProperty({ description: 'Indicates the visibility level of the product when listing' })
  @Column({ type: 'tinyint', default: ProductPriority.Low })
  priority: ProductPriority

  @ApiProperty({ description: 'Indicates if the product has been soft-deleted' })
  @Column({ type: 'tinyint', default: false })
  isDeleted: boolean

  @ApiProperty({ description: 'User ID of the creator', type: Number, nullable: true })
  @Column({ nullable: true })
  createdById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  createdBy: User | null

  @ApiProperty({ description: 'Date and time the product was created' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @ApiProperty({ description: 'User ID of the last updater', type: Number, nullable: true })
  @Column({ nullable: true })
  updatedById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  updatedBy: User | null

  @ApiProperty({
    description: 'Date and time the product was last updated',
    type: Date,
    nullable: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null

  @ApiProperty({
    description: 'User ID of the person who deleted the product',
    type: Number,
    nullable: true,
  })
  @Column({ nullable: true })
  deletedById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  deletedBy: User | null

  @ApiProperty({
    description: 'Timestamp when the product was deleted',
    type: Date,
    nullable: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null

  @ApiProperty({
    description: 'User ID of the person who restored the product',
    type: Number,
    nullable: true,
  })
  @Column({ nullable: true })
  restoredById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  restoredBy: User | null

  @ApiProperty({
    description: 'Timestamp when the product was restored',
    type: Date,
    nullable: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  restoredAt: Date | null

  @ApiProperty({
    description: 'List of images for this product',
    type: () => [ProductImage],
  })
  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  productImages: ProductImage[]
}
