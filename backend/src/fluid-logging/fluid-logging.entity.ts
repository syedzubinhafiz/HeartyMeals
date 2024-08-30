import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("fluid_logging")
export class FluidLogging{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(()=> User, user=> user.user_id)
    @JoinColumn({name: 'user_id'})
    user: User;
    
    @Column({type: 'date'})
    logging_date: Date;

    @Column({type: 'jsonb'})
    remaining_fluid: Array<JSON>;
}