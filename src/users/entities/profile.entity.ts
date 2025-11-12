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
import { User } from './user.entity'

export enum Gender {
  Male = 'male',
  Female = 'female',
}

@Entity()
export class Profile {
  @ApiProperty({ description: 'Unique identifier for the profile' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: 'User ID associated with this profile' })
  @Column()
  userId: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @ApiProperty({ description: 'First name of the user' })
  @Column({ type: 'varchar', length: 50 })
  firstName: string

  @ApiProperty({ description: 'Middle name of the user', type: String, nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  middleName: string | null

  @ApiProperty({ description: 'Last name of the user' })
  @Column({ type: 'varchar', length: 50 })
  lastName: string

  @ApiProperty({ description: 'Date of birth of the user', type: Date, nullable: true })
  @Column({ type: 'date', nullable: true })
  dob: Date | null

  @ApiProperty({ description: 'Primary contact number', type: String, nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  contact: string | null

  @ApiProperty({ description: 'Gender of the user', enum: Gender, nullable: true })
  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender | null

  @ApiProperty({ description: 'Profile picture URL or path', type: String, nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  profilePicture: string | null

  @ApiProperty({ description: 'Timestamp when the profile was created' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @ApiProperty({ description: 'Timestamp when the profile was last updated' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
