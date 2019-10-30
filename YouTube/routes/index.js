const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerConfig = require('../src/config/multer');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../src/models/User')
const authConfig = require('../src/config/auth')
const Post = require('../src/models/Post')
//const authMiddleware = require('../src/middlewares/auth')


function generateToken(params = {}){
  return jwt.sign(paramns, authConfig.secret, {
    expiresIn: 7200,
  })
}

//router.use(authMiddleware)


/* GET home page. */
router.get('/', async (req, res, next)=> {
  const post = await Post.find()

  res.render('home', { title: 'YouTube Wannabe' }, {posts});
  
});





/* Upload de vídeo */

router.get('/upload', function(req, res, next) {
  res.render('upload');
});

router.post('/posts', multer(multerConfig).single('file'), async (req, res) =>{

  const {originalname: name, size, key, url = ''} = req.file;

  const post = await Post.create({
    name,
    size,
    key,
    url,
  })
  res.render('home2');
});



/* Excluir vídeos*/

router.post('/posts/:id', async (req, res)=>{
  const post = await Post.findById(req.params.id)

  await post.remove()

  return res.send()
})


/* Cadastro, login e autenticação de usuário */
router.get('/register', function(req, res, next) {
  res.render('login');
});

router.get('/authenticate', function(req, res, next) {
  res.render('home2');
});


router.post('/register', async(req, res)=>{
  const {email} = req.body;
  try{
      if(await User.findOne())
          return res.status(400).send({error: 'Usuário já existe!'});

      const user = await User.create(req.body);

      user.password = undefined;

      return res.send({
        user,
        token: generateToken({id: user.id})
      })
  }
  catch(err){
      return res.status(400).send({error: 'Falha ao cadastrar!'})
  }
})

router.post('/authenticate', async (req, res)=>{
    const {email, password} = req.body

    const user = await User.findOne({email}).select('+password')

    if(!user)
      return res.status(400).send({error: 'Usuário não encontrado!'})

    if(!await bcrypt.compare(password, user.password))
      return res.status(400).send({error: 'Senha inválida'})

    user.password = undefined

    res.send({
      user, 
      token: generateToken({id: user.id})
    })

})


module.exports = router;
