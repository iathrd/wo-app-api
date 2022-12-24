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

  @Column()
  picture: string;

  @Column()
  phoneNumber: string;

  @Column()
  birtDate: Date;

  @Column()
  province: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column()
  postCode: number;

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
