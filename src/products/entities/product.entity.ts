import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { ProductImages } from '../../product_images/entities/product_images.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  stock: number;

  @Column({ name: 'category_id', nullable: true })
  categoryId: number | null;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  @OneToMany(() => ProductImages, (productImage) => productImage.product)
  images: ProductImages[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
