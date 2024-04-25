const fs = require("fs")

class ProductManager{

    constructor(path){
        this.path = path
    }

    async addProduct(title,description,price,thumbnail,stock){
        try{
            const product = {
                code: await this.idAutoIncremental()+1, //validar que no se repita y sea autoincremnt
                title,
                description,
                price,
                thumbnail,
                stock
            }
            const productsFile = await this.getProducts();
            const productExists = productsFile.find((product)=> product.title === title);
            if(productExists) return "este producto ya existe"
            productsFile.push(product);
            await fs.promises.writeFile(this.path ,JSON.stringify(productsFile)) //aca guarda en formato json
            return productsFile
        }
        catch(error){
            console.error(error)
        }
    }
        
    async getProducts(){
        try{
            if(fs.existsSync(this.path)){ //verifica si existe el archivo
                const productsFile= await fs.promises.readFile(this.path, "utf-8") //lee el archivo que esta como cadena de texto
                const products = JSON.parse(productsFile) //pasamos a js
                return products;
            }
            else{
                return []
            }
        }
        catch(error){
            console.error(error)
        }
    }

    async idAutoIncremental(){
        try{
            let maxCode = 0
            const productsFile = await this.getProducts();
            productsFile.map((product)=>{
                if(product.code>maxCode) maxCode = product.code
            })
            return maxCode
        }
        catch(error){
            console.error(error)
        }
    }

    async getProductsById(code){
        const productsFile = await this.getProducts();
        const productId = productsFile.find((product)=> product.code === code)
        if(productId){
            return productId
        }
        console.log("Product not found")
    }
    
    async deleteProduct(code){
        const productsFile = await this.getProducts();
        const indexProductDelete = productsFile.findIndex((product)=>product.code === code)
        if(indexProductDelete!==-1){
            const productDel = productsFile.splice(indexProductDelete,1)
            await fs.promises.writeFile(this.path ,JSON.stringify(productsFile)) //aca guarda en formato json
        }
    }

    async updateProduct(code, stock){
        const productsFile = await this.getProducts();
        for(let i=0;i<productsFile.length;i++){
            const product = productsFile[i]
            if(product.code===code){
                product.stock = stock;
                const indexProductDelete = i
                if(indexProductDelete!==-1){
                    const productDel = productsFile.splice(indexProductDelete,1)
                    productsFile.push(product)
                    await fs.promises.writeFile(this.path ,JSON.stringify(productsFile)) //aca guarda en formato json
                }}
            }
        }
}

//instanciar clase
const productManager = new ProductManager('./products.json')

//agregar productos de manera asincrona
const test = async() =>{
    console.log("Muestro array inicial vacio")
    console.log(await productManager.getProducts())
    await productManager.addProduct("iphone 14", "telefono con 3 camaras", 1000, "https://via.placeholder.com/300x200", 6) 
    await productManager.addProduct("iphone 15", "telefono con 3 camaras pero mas caro que el 14", 1200, "https://via.placeholder.com/300x200", 10) 
    await productManager.addProduct("iphone 16", "telefono con 3 camaras pero mas caro que el 15", 1400, "https://via.placeholder.com/300x200", 15)
    console.log("Muestro array habiendo cargado 3 objetos")
    console.log(await productManager.getProducts())
    console.log("Ahora entrego un producto (objeto) por ID")
    console.log(await productManager.getProductsById(2))
    console.log("Elimino el producto (objeto) por ID y devuelvo array completo")
    await productManager.deleteProduct(1)
    console.log(await productManager.getProducts())
    console.log("Update de stock de un producto (objeto) por id")
    await productManager.updateProduct(2,"500")
    console.log("Muestro productos actualizados post updateProduct")
    console.log(await productManager.getProducts())
}

test()
