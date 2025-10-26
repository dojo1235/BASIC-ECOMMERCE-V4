import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/users/entities/user.entity'
import { Product } from 'src/products/entities/product.entity'

@Entity()
export class Cart {
  @ApiProperty({ description: 'Unique identifier for the cart item' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: 'ID of the user who owns this cart item' })
  @Column()
  userId: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @ApiProperty({ description: 'ID of the product added to cart' })
  @Column()
  productId: number

  @ApiProperty({
    description: 'Product details for this cart item',
    type: Product,
  })
  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn()
  product: Product

  @ApiProperty({ description: 'Quantity of the product in the cart' })
  @Column({ type: 'int' })
  quantity: number

  @ApiProperty({ description: 'Timestamp when the cart item was created' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @ApiProperty({ description: 'Timestamp when the cart item was last updated', type: Date })
  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date | null
}
