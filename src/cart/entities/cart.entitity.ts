import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm'
import { User } from 'src/users/entities/user.entity'
import { Product } from 'src/products/entities/product.entity'

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @Column()
  productId: number

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn()
  product: Product

  @Column({ type: 'int' })
  quantity: number

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null
}