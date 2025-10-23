import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
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
  @ApiProperty({ description: 'Unique identifier for the order' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: 'ID of the user who placed the order' })
  @Column()
  userId: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @ApiProperty({ description: 'Total cost of all items in the order' })
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total: number

  @ApiProperty({ description: 'Contact phone number associated with the order' })
  @Column({ type: 'varchar', length: 100 })
  contact: string

  @ApiProperty({ description: 'Address where the order will be shipped' })
  @Column({ type: 'varchar', length: 255 })
  shippingAddress: string

  @ApiProperty({ description: 'Shipping fee applied to the order' })
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  shippingFee: number

  @ApiProperty({ enum: OrderStatus, description: 'Current status of the order' })
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus

  @ApiProperty({ description: 'Indicates whether the order is marked as deleted' })
  @Column({ type: 'tinyint', default: false })
  isDeleted: boolean

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @ApiProperty({ description: 'ID of the user who last updated this order', type: Number })
  @Column({ nullable: true })
  updatedById: number | null

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  updatedBy: User

  @ApiProperty({ description: 'Date and time when the order was last updated', type: Date })
  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null

  @ApiProperty({ description: 'ID of the user who deleted this order', type: Number })
  @Column({ nullable: true })
  deletedById: number | null

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  deletedBy: User

  @ApiProperty({ description: 'Date and time when the order was deleted', type: Date })
  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null

  @ApiProperty({ description: 'ID of the user who restored this order', type: Number })
  @Column({ nullable: true })
  restoredById: number | null

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  restoredBy: User

  @ApiProperty({ description: 'Date and time when the order was restored', type: Date })
  @Column({ type: 'timestamp', nullable: true })
  restoredAt: Date | null

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  orderItems: OrderItem[]
}

@Entity()
export class OrderItem {
  @ApiProperty({ description: 'Unique identifier for the order item' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: 'ID of the order this item belongs to' })
  @Column()
  orderId: number

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order

  @ApiProperty({ description: 'ID of the product being ordered' })
  @Column()
  productId: number

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn()
  product: Product

  @ApiProperty({ description: 'Quantity of the product ordered' })
  @Column({ type: 'int', default: 1 })
  quantity: number

  @ApiProperty({ description: 'Price per unit of the product at the time of order' })
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number

  @ApiProperty({ description: 'Date and time when this order item was created' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
}
