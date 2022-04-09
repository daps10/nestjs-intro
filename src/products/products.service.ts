import { Injectable, NotFoundException } from "@nestjs/common";
import { NotFoundError } from "rxjs";

import { Product } from "./products.model";

@Injectable()
export class ProductsService {
    private products:Product[] = [];

    insertProduct(title:string, description:string, price:number) {
        const prodId= Math.random().toString();

        // Create new product from model
        const newProduct = new Product(
            prodId,
            title,
            description,
            price
        )
        this.products.push(newProduct);

        // Return response
        return prodId;
    }

    getProducts () {
        return [...this.products];
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