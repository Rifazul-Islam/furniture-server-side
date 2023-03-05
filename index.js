const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000 ;

// middele were use
app.use(cors());
app.use(express.json())



const uri =`mongodb+srv://${process.env.DB_USERS}:${process.env.DB_PASS}@cluster0.o15tjkl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

    try{ 

        const categoriesCollection = client.db('furnituredb').collection('categories');
        const allProductCollection = client.db('furnituredb').collection('products');
        const usersCollection = client.db('furnituredb').collection('users');
        const sellerProductsCollection = client.db('furnituredb').collection('sellerProducts')

        app.get('/categories', async (req,res)=>{
            const query = {};
            const result = await categoriesCollection.find(query).toArray()
            res.send(result)

        })

        
       //  get categories data filter api

       app.get('/categories/:id', async(req,res)=>{

        const id = req.params.id;
        const filter ={_id : new ObjectId(id)}
        const category = await categoriesCollection.findOne(filter)
        const query = {category:category.category}
        const result = await allProductCollection.find(query).toArray()
        res.send(result)

      
  })
       

      //  get  users Api

      app.post('/users',async(req,res)=>{
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result)
   })



    //  get check seller role Api

    app.get('/users/admin/:email',async(req,res)=>{

        const email = req.params.email;
        const query = {email}
        const user = await usersCollection.findOne(query)

        res.send({ isAdmin: user?.role === 'admin'})
  })





   app.get('/users/buyer/:email',async(req,res)=>{

     const email = req.params.email;
     const query = {email}
     const user = await usersCollection.findOne(query)

     res.send({ isBuyer: user?.role === 'buyer'})
})



    //  get check seller role Api

    app.get('/users/seller/:email',async(req,res)=>{

        const email = req.params.email;
         const query = {email}
         const user = await usersCollection.findOne(query)

         res.send({ isSeller: user?.role === 'seller'})
   })


//   post sellerProducts methoad 
    
app.post('/sellerProducts',async(req,res)=>{

    const product = req.body;
    const result = await sellerProductsCollection.insertOne(product)
    const resul = await allProductCollection.insertOne(product)
    res.send(result)

})


app.get('/sellerProducts', async(req,res)=>{

    const query = {};
    const products = await sellerProductsCollection.find(query).toArray()
    res.send(products)
})





    }


    finally{


    }


}

run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('Furniture server site running to ...')
})


   app.listen(port,()=>{

    console.log(`Furniture  server runnings ${port}`)
})
