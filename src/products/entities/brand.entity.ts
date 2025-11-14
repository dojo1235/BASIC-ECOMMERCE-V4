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
import { Seller } from 'src/sellers/entities/seller.entity'
import { User } from 'src/users/entities/user.entity'

@Entity()
@Unique(['name'])
export class Brand {
  @ApiProperty({ description: 'Unique identifier for the brand' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: 'Seller ID that owns this brand' })
  @Column()
  sellerId: number

  @Exclude()
  @ManyToOne(() => Seller, { onDelete: 'CASCADE' })
  @JoinColumn()
  seller: Seller

  @ApiProperty({ description: 'Name of the brand' })
  @Column({ type: 'varchar', length: 100 })
  name: string

  @ApiProperty({ description: 'Description of the brand', type: String, nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string | null

  @ApiProperty({ description: 'Whether this brand is active' })
  @Column({ type: 'tinyint', default: true })
  isActive: boolean

  @ApiProperty({ description: 'Whether this brand is restricted' })
  @Column({ type: 'tinyint', default: false })
  isRestricted: boolean

  @ApiProperty({ description: 'User ID who created the brand' })
  @Column({ type: 'int' })
  createdById: number

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  createdBy: User | null

  @ApiProperty({ description: 'Timestamp when the brand was created' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @ApiProperty({ description: 'User ID who last updated the brand', type: Number, nullable: true })
  @Column({ type: 'int', nullable: true })
  updatedById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  updatedBy: User | null

  @ApiProperty({ description: 'Timestamp when the brand was last updated' })
  @Column({ type: 'timestamp' })
  updatedAt: Date
}
