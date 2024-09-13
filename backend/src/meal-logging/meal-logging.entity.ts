import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { MealType } from "src/meal-logging/enum/meal-type.enum";
import { User } from "src/user/user.entity";
import { Recipe } from "src/recipe/recipe.entity";

@Entity('meal_logging')
export class MealLogging{

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({type: 'timestamptz', nullable: true, default: null})
    consumed_date_time: Date;

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
    portion: number;

    @CreateDateColumn({type: 'timestamp with time zone', default: () => 'now()'})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamp with time zone', nullable: true, default: null})
    updated_at: Date;

    @DeleteDateColumn({type: 'timestamp with time zone', nullable: true, default: null})
    deleted_at?: Date;
}