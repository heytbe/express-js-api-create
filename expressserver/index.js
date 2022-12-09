const express = require("express");
const Joi = require("@hapi/joi");

const app = express();

app.use(express.json());

const kullanicilar = [
    {id : 1, ad: "adi", numara : "10"},
    {id : 2, ad: "heytbe", numara : "11"},
    {id : 3, ad: "heyt", numara : "12"},
    {id : 4, ad: "adiiki", numara : "13"},
    {id : 5, ad: "adiuc", numara : "14"}
];

app.get("/",(req,res)=>{
    console.log("ana sayfa")
    res.send("Merhaba İndex")
});

app.get("/users",(req,res)=>{
   if(req.query.ters){
       res.send(kullanicilar.reverse()); // /users?ters=true
   }else{
       res.send(kullanicilar);
   }
});

app.get("/users/:id",(req,res)=>{
   const bulunandeger = kullanicilar.find(response =>
   response.id === parseInt(req.params.id)); // params => /users/id
   if(bulunandeger){
       res.send(bulunandeger);
   }else{
       res.status(404).send([{error : "Kullanıcı bulunamadı", code: 404}]);
   }
});

app.get("/hakkimizda",(req,res)=>{
   res.send([{
      ad : "deneme",
      okul : "heytbe üniversitesi"
   }]);
});

app.post("/users",(req,res)=>{

    const schema = Joi.object({
        ad : Joi.string().min(3).max(30).required(),
        numara : Joi.number().integer().min(9).max(99).required()
    });

    const sonuc = schema.validate(req.body);
    if(sonuc.error){
        res.status(400).send(sonuc.error);
    }else{
        const yenikullanici = {
            id : kullanicilar.length + 1,
            ad : req.body.ad,
            numara : req.body.numara
        }

        kullanicilar.push(yenikullanici);

        res.send(kullanicilar);
    }
});

app.put("/users/:id",(req,res)=>{
    const update = kullanicilar.find(ara => ara.id === parseInt(req.params.id));
    if(!update){
        return res.send(req.params.id+" "+ "idli kullanıcı bulunamadı"); // burda return dememin sebebi yani karşındaki degeri dondür sonra fonksiyondan çık çıktıgı fonksiyon app.put
    }

    const schema = Joi.object({
        ad : Joi.string().min(3).max(30).required(),
        numara : Joi.number().integer().min(9).max(99).required()
    });

    const sonuc = schema.validate(req.body);
    if(sonuc.error){
        res.status(400).send(sonuc.error);
    }else{
      update.ad = req.body.ad;
      update.numara = req.body.numara;

      res.send(update);

    }
});

app.delete("/users/:id",(req,res)=>{

    const usersdelete = kullanicilar.find(sonuc => sonuc.id === parseInt(req.params.id));

    if(!usersdelete){
        return res.send(req.params.id+" "+ "idli kullanıcı bulunamadı"); // burda return dememin sebebi yani karşındaki degeri dondür sonra fonksiyondan çık çıktıgı fonksiyon app.put
    }else{
        const index = kullanicilar.indexOf(usersdelete);
        kullanicilar.splice(index,1);
        res.send(usersdelete.id+" "+ "idli kullanıcı silindi");

    }

});

app.listen(3000,()=>{
    console.log("Server 3000 portundan dinliyor");
});
