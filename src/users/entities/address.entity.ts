import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { User } from './user.entity' // fixed import path

@Entity()
export class Address {
  @ApiProperty({ description: 'Unique identifier for the address' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: 'User ID associated with this address' })
  @Column()
  userId: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @ApiProperty({ description: 'Primary address line' })
  @Column({ type: 'varchar', length: 255 })
  addressLine1: string

  @ApiProperty({ description: 'Secondary address line', type: String, nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  addressLine2: string | null

  @ApiProperty({ description: 'Contact number for this address', type: String, nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  contact: string | null

  @ApiProperty({ description: 'City for the address' })
  @Column({ type: 'varchar', length: 100 })
  city: string

  @ApiProperty({ description: 'Country for the address' })
  @Column({ type: 'varchar', length: 100 })
  country: string

  @ApiProperty({ description: 'Postal code', type: String, nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  postalCode: string | null

  @ApiProperty({ description: 'Indicates if this is the default address' })
  @Column({ type: 'tinyint', default: false })
  isDefault: boolean

  @ApiProperty({ description: 'Timestamp when the address was created' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @ApiProperty({ description: 'Timestamp when the address was last updated' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
