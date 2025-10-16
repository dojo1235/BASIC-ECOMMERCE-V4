import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm'

export enum Role {
  SuperAdmin = 'superAdmin',
  GeneralAdmin = 'generalAdmin',
  UserManager = 'userManager',
  ProductManager = 'productManager',
  OrderManager = 'orderManager',
  ViewOnlyAdmin = 'viewOnlyAdmin',
  User = 'user',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 50 })
  name: string

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string
  
  @Column({ type: 'varchar', length: 255 })
  passwordHash: string

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role

  @Column({ type: 'tinyint', default: 0 })
  isBanned: boolean

  @Column({ type: 'tinyint', default: 0 })
  isDeleted: boolean

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date | null

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: User

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'bannedBy' })
  bannedBy: User

  @Column({ type: 'timestamp', nullable: true })
  bannedAt: Date | null

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'deletedBy' })
  deletedBy: User

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'restoredBy' })
  restoredBy: User

  @Column({ type: 'timestamp', nullable: true })
  restoredAt: Date | null
}