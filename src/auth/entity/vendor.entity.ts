import { Role } from 'src/roles/roles.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  businessName: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

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
  bankNumber: string;

  @Column()
  ktpPicture: string;

  @Column()
  ward: string;

  @Column()
  district: string;

  @Column()
  city: string;

  @Column()
  province: string;

  @ManyToOne(() => Role, { eager: true })
  role: Role;

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