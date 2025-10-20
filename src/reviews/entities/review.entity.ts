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
import { User } from 'src/users/entities/user.entity'
import { Product } from 'src/products/entities/product.entity'

@Entity()
@Unique(['userId', 'productId'])
@Check(`"rating" >= 1 AND "rating" <= 5`)
export class Review {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  userId!: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User

  @Column()
  productId!: number

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn()
  product!: Product

  @Column({ type: 'int' })
  rating!: number

  @Column({ type: 'text' })
  comment!: string

  @Column({ type: 'tinyint', default: true })
  isVisible!: boolean

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date

  @Column({ type: 'timestamp', nullable: true })
  updatedAt!: Date | null

  @Column({ nullable: true })
  hiddenById!: number | null

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  hiddenBy!: User

  @Column({ type: 'timestamp', nullable: true })
  hiddenAt!: Date | null

  @Column({ nullable: true })
  restoredById!: number | null

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  restoredBy!: User

  @Column({ type: 'timestamp', nullable: true })
  restoredAt!: Date | null
}
