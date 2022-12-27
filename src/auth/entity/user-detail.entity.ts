import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserDetail {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true, type: 'text' })
  picture!: string;

  @Column({ nullable: true, type: 'varchar' })
  phoneNumber!: string;

  @Column({ nullable: true, type: 'date' })
  birtDate!: Date;

  @Column({ nullable: true, type: 'varchar' })
  province!: string;

  @Column({ nullable: true, type: 'varchar' })
  city!: string;

  @Column({ nullable: true, type: 'varchar' })
  address!: string;

  @Column({ nullable: true, type: 'varchar' })
  postCode!: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
