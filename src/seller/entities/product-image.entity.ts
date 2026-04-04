import {
    Column, CreateDateColumn, Entity, ManyToOne,
    PrimaryGeneratedColumn, JoinColumn,
} from "typeorm";
import { ProductEntity } from "./product.entity";

@Entity('product_images')
export class ProductImageEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'varchar', length: 255 })
    filename?: string;

    @Column({ type: 'varchar', length: 255 })
    originalName?: string;

    @Column({ type: 'varchar', length: 255 })
    url?: string;

    @Column({ type: 'boolean', default: false })
    isPrimary?: boolean;

    @CreateDateColumn()
    createdAt?: Date;

    // Many images -> one product
    @ManyToOne(() => ProductEntity, (product) => product.images, {
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn({ name: 'productId' })
    product?: ProductEntity;

    @Column()
    productId?: number;
}