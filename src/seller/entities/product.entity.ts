import {
    Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { ProductImageEntity } from "./product-image.entity";

@Entity('products')
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'varchar', length: 50 })
    category?: string;

    @Column({ type: 'varchar', length: 100 })
    name?: string;

    @Column({ type: 'varchar', length: 255 })
    description?: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price?: number;

    @Column({ type: 'integer', default: 1 })
    stock?: number;

    @Column({
        type: 'enum',
        enum: ['available', 'out_of_stock'],
        default: 'available'
    })
    status?: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    // One product -> many images
    @OneToMany(() => ProductImageEntity, (image) => image.product, {
        cascade: true,
        eager: true,
    })
    images?: ProductImageEntity[];

}