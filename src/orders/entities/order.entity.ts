import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm'
import { User } from 'src/users/entities/user.entity'
import { Product } from 'src/products/entities/product.entity'

export enum OrderStatus {
  Pending = 'pending',
  Processing = 'processing',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total: number

  @Column({ type: 'varchar', length: 100 })
  contact: string

  @Column({ type: 'varchar', length: 255 })
  shippingAddress: string

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  shippingFee: number

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus

  @Column({ type: 'tinyint', default: false })
  isDeleted: boolean

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @Column({ nullable: true })
  updatedById: number | null

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  updatedBy: User

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null

  @Column({ nullable: true })
  deletedById: number | null

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  deletedBy: User

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null

  @Column({ nullable: true })
  restoredById: number | null

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  restoredBy: User

  @Column({ type: 'timestamp', nullable: true })
  restoredAt: Date | null

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  orderItems: OrderItem[]
}

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  orderId: number

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order

  @Column()
  productId: number

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn()
  product: Product

  @Column({ type: 'int', default: 1 })
  quantity: number

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
}
