import { Exclude } from 'class-transformer'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm'

export enum Role {
  SuperAdmin = 'superAdmin',
  GeneralAdmin = 'generalAdmin',
  UserManager = 'userManager',
  ProductManager = 'productManager',
  OrderManager = 'orderManager',
  ViewOnlyAdmin = 'viewOnlyAdmin',
  User = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 50 })
  name: string

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  passwordHash: string

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role

  @Column({ type: 'tinyint', default: 0 })
  isBanned: boolean

  @Column({ type: 'tinyint', default: 0 })
  isDeleted: boolean

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date | null

  @Column({ nullable: true })
  createdById: number | null

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  createdBy: User

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
  bannedById: number | null

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  bannedBy: User

  @Column({ type: 'timestamp', nullable: true })
  bannedAt: Date | null

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
}
