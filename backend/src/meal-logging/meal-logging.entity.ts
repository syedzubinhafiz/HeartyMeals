import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { MealType } from "src/meal-logging/enum/meal-type.enum";
import { User } from "src/user/user.entity";
import { Recipe } from "src/recipe/recipe.entity";

@Entity('meal_logging')
export class MealLogging{

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({type: 'timestamptz'})
    date: Date;

    @Column({
        type: 'enum',
        enum: MealType
    })
    type: MealType;

    @Column({
        type: 'boolean',
        default: false
    })
    is_consumed: boolean = false;

    @ManyToOne(()=> User, user=> user.user_id)
    @JoinColumn({name: 'user_id'})
    user: User;

    @ManyToOne(()=> Recipe, recipe=> recipe.id)
    @JoinColumn({name: 'recipe_id'})
    recipe: Recipe;

    @Column({
        type: 'float'
    })
    portion: Number;

    @Column({type: 'timestamp with time zone'})
    created_at: Date;

    @Column({type: 'timestamp with time zone'})
    updated_at: Date;

    @Column({type: 'timestamp with time zone', nullable: true, default: null})
    deleted_at?: Date;
}