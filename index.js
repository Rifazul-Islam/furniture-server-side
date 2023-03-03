const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        const CategoriesCollection = client.db('furnituredb').collection('categories');
       
      
        app.get('/categories', async (req,res)=>{

            const query = {};
            const result = await CategoriesCollection.find(query).toArray()
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
