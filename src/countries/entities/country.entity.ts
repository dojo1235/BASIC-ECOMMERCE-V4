import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/users/entities/user.entity'

@Entity()
export class Country {
  @ApiProperty({ description: 'Unique identifier for the country' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: 'Name of the country' })
  @Column({ type: 'varchar', length: 100 })
  name: string

  @ApiProperty({ description: 'ISO code of the country, e.g., US, NG' })
  @Column({ type: 'varchar', length: 10 })
  isoCode: string

  @ApiProperty({ description: 'User ID who created this country', type: Number, nullable: true })
  @Column({ type: 'int', nullable: true })
  createdById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  createdBy: User | null

  @ApiProperty({ description: 'Timestamp when the country was created' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @ApiProperty({
    description: 'User ID who last updated this country',
    type: Number,
    nullable: true,
  })
  @Column({ type: 'int', nullable: true })
  updatedById: number | null

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  updatedBy: User | null

  @ApiProperty({
    description: 'Timestamp when the country was last updated',
    type: Date,
    nullable: true,
  })
  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date | null
}
