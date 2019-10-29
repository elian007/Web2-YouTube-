const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerConfig = require('../src/config/multer');

const User = require('../src/models/User')

const Post = require('../src/models/Post')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'YouTube Wannabe' });
});

router.get('/register', function(req, res, next) {
  res.render('login');
});


/* Upload de vídeo */
router.post('/posts', multer(multerConfig).single('file'), async (req, res) =>{

  const {originalname: name, size, key, url = ''} = req.file;

  const post = await Post.create({
    name,
    size,
    key,
    url,
  })
  res.end();
});


router.post('/register', async(req, res)=>{
  const {email} = req.body;
  try{
      if(await User.findOne())
          return res.status(400).send({error: 'Usuário já existe!'});

      const user = await User.create(req.body);

      user.password = undefined;

      return res.send({user})
  }
  catch(err){
      return res.status(400).send({error: 'Falha ao cadastrar!'})
  }
})

module.exports = router;
