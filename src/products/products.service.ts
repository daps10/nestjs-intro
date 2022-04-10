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
        const product = await this.findProduct(productId)[0];
        return {...product}
    }

    updateProduct(productId:string, title:string, desc:string, price:number) {
        const [product, prodIndex] = this.findProduct(productId);
        const updatedProduct= {...product};

        if(title){
            updatedProduct.title = title;
        }
        if(desc){
            updatedProduct.description = desc;
        }
        if(price){
            updatedProduct.price = price;
        }

        this.products[prodIndex]= updatedProduct;
    }

    removeProduct(productId:string) {
        const prodIndex = this.findProduct(productId)[1];
        this.products.splice(prodIndex, 1);
    }

    private findProduct(id:string) : [Product, number] {
        const productIndex= this.products.findIndex((prod) => prod.id === id);
        const product = this.products.find((prod) => prod.id === id);
        if(!product){
            throw new NotFoundException("Could not find product!");
        }
        return [product, productIndex];
    }
}