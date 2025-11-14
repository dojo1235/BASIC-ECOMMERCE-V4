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
@Unique(['brandName'])
export class BrandAuthorization {
  @ApiProperty({ description: 'Unique identifier for the brand authorization' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: 'Name of the brand being authorized' })
  @Column({ type: 'varchar', length: 100 })
  brandName: string

  @ApiProperty({ description: 'Seller ID associated with this authorization' })
  @Column()
  sellerId: number

  @Exclude()
  @ManyToOne(() => Seller, { onDelete: 'CASCADE' })
  @JoinColumn()
  seller: Seller

  @ApiProperty({ description: 'Whether this seller is authorized for the brand' })
  @Column({ type: 'tinyint', default: false })
  isAuthorized: boolean

  @ApiProperty({ description: 'User ID who authorized this brand', type: Number, nullable: true })
  @Column({ nullable: true })
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

  @ApiProperty({ description: 'Timestamp when this record was created' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @ApiProperty({
    description: 'User ID who last updated this record',
    type: Number,
    nullable: true,
  })
  @Column({ nullable: true })
  updatedById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  updatedBy: User | null

  @ApiProperty({
    description: 'Timestamp when this record was last updated',
    type: Date,
    nullable: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null
}
