const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000 ;

// middele were use
app.use(cors());
app.use(express.json())



const uri =`mongodb+srv://${process.env.DB_USERS}:${process.env.DB_PASS}@cluster0.o15tjkl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function jwtverify(req,res,next){

    const headerAuth = req.headers.authorization
    if(!headerAuth){

         return res.status(401).send('authorization unaccess')
    }
    const token = headerAuth.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded) {
        
        if(err) {

           return res.status(403).send({message:'forbidend accesss'})
        }
        req.decoded = decoded;
        next();

       })

}







async function run(){

    try{ 

        const categoriesCollection = client.db('furnituredb').collection('categories');
        const allProductCollection = client.db('furnituredb').collection('products');
        const usersCollection = client.db('furnituredb').collection('users');
        const sellerProductsCollection = client.db('furnituredb').collection('sellerProducts')
        const bookingsCollection = client.db('furnituredb').collection('bookings')
        
        
        app.get('/categories', async (req,res)=>{
            const query = {};
            const result = await categoriesCollection.find(query).toArray()
            res.send(result)

        })

        
       //  get categories data filter api

       app.get('/categories/:id',async(req,res)=>{

        const id = req.params.id;
        const filter ={_id: new ObjectId(id)}
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


      // get jwt created  

      app.get('/jwt',async(req,res)=>{

        const email  =req.query.email;
        const query = {email:email}
        const user = await usersCollection.findOne(query)

        if(user){
             
            const token = jwt.sign({email},process.env.ACCESS_TOKEN, {expiresIn:'7d'})

         return res.send({accessToken : token})
         }
         res.status(403).send({accessToken: ''})

 })


 // post bookings Api
            
 app.post('/bookings',async(req,res)=>{
    const booking = req.body;
    const result = await bookingsCollection.insertOne(booking);
    res.send(result)
})

// get  Specefic email Api bookings verify

app.get('/bookings', jwtverify, async (req,res)=>{

    const email = req.query.email;
  const decodedEmail = req.decoded.email;
   
     if( email !== decodedEmail){
      
        return res.status(403).send({message:'forbidden'})
     }

    
    const query = {email:email}
     const result = await bookingsCollection.find(query).toArray()
     res.send(result)
     
})



    // get  Specefic  id  payment  Api 
    app.get('/bookings/:id',async(req,res)=>{

        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const payment = await bookingsCollection.findOne(query)
        res.send(payment)
})



    //  get check seller role Api

    app.get('/users/admin/:email',async(req,res)=>{

        const email = req.params.email;
        const query = {email}
        const user = await usersCollection.findOne(query)

        res.send({ isAdmin: user?.role === 'admin'})
  })


 //  get check seller role Api and buyer verify
  app.get('/buyers', async(req,res)=>{

    const filter ={role:'buyer'}
    const result = await usersCollection.find(filter).toArray()
   res.send(result)
     
})



  // specing buyer delete 

  app.delete('/buyers/:id',async(req,res)=>{

    const id = req.params.id;
    const query={_id:new ObjectId(id)}
    const buyer = await usersCollection.deleteOne(query)
    res.send(buyer)
})



//  get check seller role Api

app.get('/users',async(req,res)=>{

    const filter ={role:'seller'}
       
    const result = await usersCollection.find(filter).toArray()
   res.send(result)
     
})

  // specing buyer delete 

app.delete('/sellers/:id',async(req,res)=>{

    const id = req.params.id;
    const query={_id:new ObjectId(id)}
    const seller = await usersCollection.deleteOne(query)
    res.send(seller)
})



    //  get check buyer role Api

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
