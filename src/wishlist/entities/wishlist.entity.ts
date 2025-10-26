import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Unique,
} from 'typeorm'
import { User } from 'src/users/entities/user.entity'
import { Product } from 'src/products/entities/product.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
@Unique(['userId', 'productId'])
export class Wishlist {
  @ApiProperty({ description: 'Unique identifier for the wishlist entry' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: 'ID of the user who added the product to wishlist' })
  @Column()
  userId: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @ApiProperty({ description: 'ID of the product added to the wishlist' })
  @Column()
  productId: number

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn()
  product: Product

  @ApiProperty({ description: 'Timestamp when the product was added to the wishlist' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
}
