import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'usuarios' })
export class PostgresUserAccount {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'name', nullable: true })
  name?: string

  @Column()
  email!: string

  @Column({ name: 'id_facebook', nullable: true })
  facebookId?: string

  @Column({ name: 'foto', nullable: true })
  pictureUrl?: string

  @Column({ name: 'iniciais_nome', nullable: true })
  initials?: string
}
