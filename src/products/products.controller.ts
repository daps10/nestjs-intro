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
    getProduct (@Param("id") prodId: string) {
        return { product: this.ProductsService.getSingleProduct(prodId)}
    }

    @Patch(":id")
    updateProduct(
        @Param("id") prodId: string,
        @Body("title") prodTitle: string,
        @Body("description") prodDesc: string,
        @Body("price") prodPrice: number,
    ) {
        this.ProductsService.updateProduct(prodId, prodTitle, prodDesc, prodPrice);
        return null;
    }

    @Delete(":id")
    removeProduct(@Param("id") prodId: string) {
        this.ProductsService.removeProduct(prodId);
        return null;
    }
}