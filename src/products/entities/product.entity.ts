import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm'
import { User } from 'src/users/entities/user.entity'

export enum ProductStatus {
  InStock = 'inStock',
  Discontinued = 'discontinued',
  OutOfStock = 'outOfStock',
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 150 })
  name: string

  @Column({ type: 'text', nullable: true })
  description: string | null

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number

  @Column({ type: 'varchar', length: 255 })
  image: string

  @Column({ type: 'int', default: 0 })
  stock: number

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.InStock,
  })
  status: ProductStatus

  @Column({ type: 'tinyint', default: false })
  isDeleted: boolean

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  createdBy: User

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  updatedBy: User

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  deletedBy: User

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  restoredBy: User

  @Column({ type: 'timestamp', nullable: true })
  restoredAt: Date | null
}