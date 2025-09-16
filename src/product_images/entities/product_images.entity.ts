import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('product_images')
export class ProductImages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: number;

  @Column()
  image_url: string;

  @Column({ default: false })
  is_primary: boolean;

  @Column({ nullable: true })
  alt_text: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => Product, (product) => product.images)
  product: Product;
}
