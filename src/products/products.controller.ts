import { Controller, Post, Body, Get, Param, Patch, Delete } from "@nestjs/common";
import { ProductsService } from "./products.service";

@Controller("products")  // through this we can filter our api request like :- products/<routename>
export class ProductsController {

    // Inject a service with constructor
    constructor(private readonly ProductsService: ProductsService) {}

    @Post() 
    async addProduct(
        @Body('title') prodTitle:string,
        @Body('description') prodDescription:string,
        @Body('price') prodPrice:number
    ) {
        const generatedId = await this.ProductsService.insertProduct(
            prodTitle, 
            prodDescription, 
            prodPrice
        );
        return {id: generatedId};
    }

    @Get()
    async getAllProducts () {
        const products= await this.ProductsService.getProducts();
        return {data : products};
    }

    @Get(":id")
    async getProduct (@Param("id") prodId: string) {
        const product = await this.ProductsService.getSingleProduct(prodId);
        return { product: product}
    }

    @Patch(":id")
    async updateProduct(
        @Param("id") prodId: string,
        @Body("title") prodTitle: string,
        @Body("description") prodDesc: string,
        @Body("price") prodPrice: number,
    ) {
        const product = await this.ProductsService.updateProduct(prodId, prodTitle, prodDesc, prodPrice);
        return null;
    }

    @Delete(":id")
    async removeProduct(@Param("id") prodId: string) {
        await this.ProductsService.removeProduct(prodId);
        return null;
    }
}