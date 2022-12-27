import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  businessName: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  companyEmail: string;

  @Column()
  businessEmail: string;

  @Column()
  responsible: string;

  @Column()
  phoneNumber: string;

  @Column()
  whatsappNumber: string;

  @Column()
  companyPhoneNumber: string;

  @Column()
  companyWhatsappNumber: string;

  @Column()
  bankName: string;

  @Column()
  bankNumber;

  @Column()
  ktpPicture: string;

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
