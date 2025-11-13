import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Unique,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/users/entities/user.entity'
import { Country } from 'src/countries/entities/country.entity'

export enum PremiumTier {
  Silver = 'silver',
  Gold = 'gold',
  Diamond = 'diamond',
}

@Entity()
@Unique(['userId'])
export class Seller {
  @ApiProperty({ description: 'Unique identifier for the seller' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: 'User ID associated with this seller' })
  @Column()
  userId: number

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @ApiProperty({ description: 'Store name of the seller' })
  @Column({ type: 'varchar', length: 100 })
  storeName: string

  @ApiProperty({ description: 'Description of the store', type: String, nullable: true })
  @Column({ type: 'text', nullable: true })
  storeDescription: string | null

  @ApiProperty({ description: 'Logo URL for the store', type: String, nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  logoUrl: string | null

  @ApiProperty({ description: 'Current balance of the seller' })
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  balance: number

  @ApiProperty({ description: 'Average rating of the seller' })
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number

  @ApiProperty({ description: 'Total sales made by the seller' })
  @Column({ type: 'int', default: 0 })
  totalSales: number

  @ApiProperty({ description: 'Store phone number', type: String, nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  storePhone: string | null

  @ApiProperty({ description: 'Store address' })
  @Column({ type: 'varchar', length: 255 })
  storeAddress: string

  @ApiProperty({ description: 'Store city' })
  @Column({ type: 'varchar', length: 100 })
  storeCity: string

  @ApiProperty({ description: 'Store country ID' })
  @Column()
  storeCountryId: number

  @Exclude()
  @ManyToOne(() => Country, { onDelete: 'CASCADE' })
  @JoinColumn()
  storeCountry: Country

  @ApiProperty({ description: 'Premium tier of the seller', enum: PremiumTier })
  @Column({ type: 'enum', enum: PremiumTier, default: PremiumTier.Silver })
  premiumTier: PremiumTier

  @ApiProperty({ description: 'Whether the seller is verified' })
  @Column({ type: 'tinyint', default: false })
  isVerified: boolean

  @ApiProperty({ description: 'Whether the seller is suspended' })
  @Column({ type: 'tinyint', default: false })
  isSuspended: boolean

  @ApiProperty({ description: 'Timestamp when the seller was created' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @ApiProperty({ description: 'User ID of the last updater', type: Number, nullable: true })
  @Column({ type: 'int', nullable: true })
  updatedById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  updatedBy: User | null

  @ApiProperty({ description: 'Timestamp when the seller was last updated' })
  @Column({ type: 'timestamp' })
  updatedAt: Date

  @ApiProperty({ description: 'User ID who suspended this seller', type: Number, nullable: true })
  @Column({ type: 'int', nullable: true })
  suspendedById: number | null

  @ApiProperty({
    description: 'Timestamp when the seller was suspended',
    type: Date,
    nullable: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  suspendedAt: Date | null

  @ApiProperty({ description: 'User ID who restored this seller', type: Number, nullable: true })
  @Column({ type: 'int', nullable: true })
  restoredById: number | null

  @ApiProperty({
    description: 'Timestamp when the seller was restored',
    type: Date,
    nullable: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  restoredAt: Date | null
}
