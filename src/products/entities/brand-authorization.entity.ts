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
@Unique(['brandName', 'sellerId'])
export class BrandAuthorization {
  @ApiProperty({ description: 'Unique identifier for the brand authorization' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: 'Name of the brand being authorized' })
  @Column({ type: 'varchar', length: 50 })
  brandName: string

  @ApiProperty({ description: 'Seller ID associated with this authorization' })
  @Column({ type: 'int' })
  sellerId: number

  @Exclude()
  @ManyToOne(() => Seller, { onDelete: 'CASCADE' })
  @JoinColumn()
  seller: Seller

  @ApiProperty({ description: 'Whether this seller is authorized for the brand' })
  @Column({ type: 'tinyint', default: false })
  isAuthorized: boolean

  @ApiProperty({ description: 'User ID who authorized this brand', type: Number, nullable: true })
  @Column({ type: 'int', nullable: true })
  authorizedById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  authorizedBy: User | null

  @ApiProperty({
    description: 'Timestamp when the brand was authorized',
    type: Date,
    nullable: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  authorizedAt: Date | null

  @ApiProperty({
    description: 'User ID who un-authorized this brand',
    type: Number,
    nullable: true,
  })
  @Column({ type: 'int', nullable: true })
  unAuthorizedById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  unAuthorizedBy: User | null

  @ApiProperty({
    description: 'Timestamp when the brand was un-authorized',
    type: Date,
    nullable: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  unAuthorizedAt: Date | null

  @ApiProperty({ description: 'Timestamp when this record was created' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
}
