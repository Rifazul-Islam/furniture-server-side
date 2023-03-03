const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const productCollection = client.db('furnituredb').collection('products');
        const usersCollection = client.db('furnituredb').collection('users');
        
        app.get('/categories', async (req,res)=>{

            const query = {};
            const result = await categoriesCollection.find(query).toArray()
            res.send(result)

        })

       //  get categories data filter Api

//        app.get('/categories/:id', async(req,res)=>{

//         const id = req.params.id;
//         const filter ={_id: new ObjectId(id)}
//         const category = await categoriesCollection.findOne(filter)
//         const query = {category:category.category}
//         const result = await productCollection.find(query).toArray()
//         res.send(result)
//   })
       
  
  
      //  get  users Api

      app.post('/users',async(req,res)=>{
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result)
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
