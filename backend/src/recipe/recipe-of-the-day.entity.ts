import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, } from "typeorm";
import { Recipe } from "./recipe.entity";
import { User } from "src/user/user.entity";


@Entity('recipe_of_the_day')
export class RecipeOfTheDay{

    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column({type: 'timestamp with time zone', nullable: false,})
    date: Date

    @ManyToOne(() => Recipe, { nullable: true, eager: true })
    @JoinColumn({ name: 'recipe_id' })
    recipe: Recipe;

    @OneToOne(()=> User, user=> user.user_id, {eager: true})
    @JoinColumn({name: 'user_id'})
    user: User;

}