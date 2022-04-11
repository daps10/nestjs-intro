import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose"; // This simply tells nest js that you wanna inject a mongoose model

import { Model } from 'mongoose';
import { NotFoundError } from "rxjs";

import { Product } from "./products.model";

@Injectable()
export class ProductsService {
    private products:Product[] = [];

    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {}

    async insertProduct(title:string, description:string, price:number) {
        
        // Create new product from model
        const newProduct = new this.productModel({
            title,
            description,
            price
        })
        const result = await newProduct.save();
        return result.id as string;
    }

    async getProducts () {
        const products= await this.productModel.find().exec();
        return products.map((prod) => ({
            id:prod.id, 
            title:prod.title,
            description:prod.description,
            price:prod.price
        }));
    }

    async getSingleProduct(productId:string) {
        const product = await this.findProduct(productId);
        return {
            id:product.id, 
            title:product.title,
            description:product.description,
            price:product.price
        };
    }

    async updateProduct(productId:string, title:string, desc:string, price:number) {
        const updatedProduct = await this.findProduct(productId);
        if(title){
            updatedProduct.title = title;
        }
        if(desc){
            updatedProduct.description = desc;
        }
        if(price){
            updatedProduct.price = price;
        }
        updatedProduct.save();
    }

    async removeProduct(productId:string) {
        await this.productModel.deleteOne({id:productId}).exec();
    }

    private async findProduct(id:string): Promise<Product> {
        let product;
        try {
            product = await this.productModel.findById(id);
        } catch (error) {
            throw new NotFoundException("Could not find product!");
        }
        
        if(!product){
            throw new NotFoundException("Could not find product!");
        }

        return product;
    }
}