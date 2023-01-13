import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DetailPartner {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  isAdminVerify: boolean;

  @Column()
  isEmailVerify: boolean;

  @Column()
  status: string;

  @Column()
  rejectedReason: string;
}
