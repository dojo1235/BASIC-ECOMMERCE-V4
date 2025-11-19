import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { Seller } from 'src/sellers/entities/seller.entity'
import { Product } from './product.entity'
import { User } from 'src/users/entities/user.entity'

@Entity()
export class ProductImage {
  @ApiProperty({ description: 'Unique identifier for the product image' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: 'Seller ID that owns this product image' })
  @Column({ type: 'int' })
  sellerId: number

  @Exclude()
  @ManyToOne(() => Seller, { onDelete: 'CASCADE' })
  @JoinColumn()
  seller: Seller

  @ApiProperty({ description: 'ID of the product this image belongs to' })
  @Column({ type: 'int' })
  productId: number

  @Exclude()
  @ManyToOne(() => Product, (product) => product.productImages, { onDelete: 'CASCADE' })
  @JoinColumn()
  product: Product

  @ApiProperty({ description: 'URL of the product image' })
  @Column({ type: 'varchar', length: 255 })
  imageUrl: string

  @ApiProperty({ description: 'Indicates whether this is the primary image' })
  @Column({ type: 'tinyint', default: false })
  isPrimary: boolean

  @ApiProperty({ description: 'User ID who created this image', type: Number, nullable: true })
  @Column({ type: 'int', nullable: true })
  createdById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  createdBy: User | null

  @ApiProperty({ description: 'Timestamp when this image was created' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @ApiProperty({ description: 'User ID who last updated this image', type: Number, nullable: true })
  @Column({ type: 'int', nullable: true })
  updatedById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  updatedBy: User | null

  @ApiProperty({
    description: 'Timestamp when this image was last updated',
    type: Date,
    nullable: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null
}
