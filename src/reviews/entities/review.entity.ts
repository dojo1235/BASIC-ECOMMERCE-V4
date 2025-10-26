import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Unique,
  Check,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/users/entities/user.entity'
import { Product } from 'src/products/entities/product.entity'

@Entity()
@Unique(['userId', 'productId'])
@Check(`"rating" >= 1 AND "rating" <= 5`)
export class Review {
  @ApiProperty({ description: 'Unique identifier for the review' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: 'ID of the user who wrote the review' })
  @Column()
  userId: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @ApiProperty({ description: 'ID of the product being reviewed' })
  @Column()
  productId: number

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn()
  product: Product

  @ApiProperty({ description: 'Rating given to the product (1-5)' })
  @Column({ type: 'int' })
  rating: number

  @ApiProperty({ description: 'Text comment for the review' })
  @Column({ type: 'text' })
  comment: string

  @ApiProperty({ description: 'Indicates if the review is visible' })
  @Column({ type: 'tinyint', default: true })
  isVisible: boolean

  @ApiProperty({ description: 'Timestamp when the review was created' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @ApiProperty({ description: 'Timestamp when the review was last updated', type: Date })
  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null

  @ApiProperty({ description: 'ID of the user who hid the review', type: Number })
  @Column({ nullable: true })
  hiddenById: number | null

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  hiddenBy: User | null

  @ApiProperty({ description: 'Timestamp when the review was hidden', type: Date })
  @Column({ type: 'timestamp', nullable: true })
  hiddenAt: Date | null

  @ApiProperty({ description: 'ID of the user who restored the review', type: Number })
  @Column({ nullable: true })
  restoredById: number | null

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  restoredBy: User | null

  @ApiProperty({ description: 'Timestamp when the review was restored', type: Date })
  @Column({ type: 'timestamp', nullable: true })
  restoredAt: Date | null
}
