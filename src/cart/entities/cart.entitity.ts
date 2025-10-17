import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,
CreateDateColumn, JoinColumn } from 'typeorm'
import { User } from 'src/users/entities/user.entity'
import { Product } from 'src/products/entities/product.entity'

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product

  @Column({ type: 'int' })
  quantity: number

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null
}