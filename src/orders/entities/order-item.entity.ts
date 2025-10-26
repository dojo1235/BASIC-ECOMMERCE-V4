import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { Order } from './order.entity'
import { Product } from 'src/products/entities/product.entity'

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
