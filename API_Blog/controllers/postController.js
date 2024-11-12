// controllers/postController.js

const Post = require('../models/Post');
const User = require('../models/User'); // Asegúrate de importar tu modelo de User
const jwt = require('jsonwebtoken');

// Crear un nuevo post
exports.createPost = async (req, res) => {
  try {
    const { title, content, category, multimedia, status, scheduledDate } = req.body;

    // Crear el nuevo post
    const post = new Post({
      title,
      content,
      author: req.user._id, // ID del autor extraído del token JWT
      category,
      multimedia,
      status,
      scheduledDate,
    });

    // Guardar el post en la base de datos
    await post.save();

    // Actualizar el documento del usuario para incluir el nuevo post en el arreglo postRecords
    await User.findByIdAndUpdate(
      req.user._id,  // El ID del usuario que creó el post
      { $push: { postRecords: post._id } },  // Agregar el ID del post al arreglo postRecords
      { new: true }  // Para retornar el documento actualizado
    );

    // Responder con el post creado
    res.status(201).json({ message: 'Post creado exitosamente', post });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los posts con paginación
exports.getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Sin filtros: obtén todos los posts
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Ordenar por fecha de creación descendente
      .skip((page - 1) * limit) // Paginar resultados
      .limit(parseInt(limit)) // Limitar la cantidad de resultados
      .exec();

    // Contar el total de posts para la paginación
    const totalPosts = await Post.countDocuments();

    // Enviar los resultados de la consulta
    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  exports.getPublishedPosts = async (req, res) => {
    try {
      const { page = 1, limit = 10, category, author } = req.query;
      const filter = {
        status: 'published', // Solo obtener posts con status 'published'
        scheduledDate: { $lte: new Date() }, // Filtrar posts cuya fecha programada sea hoy o posterior
      };
  
      // Si se especifica una categoría, añadirla al filtro
      if (category) filter.category = category;
  
      // Si se especifica un autor, añadirlo al filtro
      if (author) filter.author = author;
  
      // Obtener los posts filtrados
      const posts = await Post.find(filter)
        .sort({ createdAt: -1 }) // Ordenar por fecha de creación (más recientes primero)
        .skip((page - 1) * limit) // Paginación: saltar posts previos según la página
        .limit(parseInt(limit)) // Limitar el número de posts por página
        .exec();
  
      // Contar el total de posts que cumplen con el filtro
      const totalPosts = await Post.countDocuments(filter);
  
      // Enviar la respuesta con los posts y la información de paginación
      res.json({
        posts,
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// Búsqueda de un post por su slug
exports.getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Actualizar un post
exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Extraer el token JWT de los encabezados de la solicitud
    const token = req.headers.authorization?.split(' ')[1]; // Se asume el formato 'Bearer <token>'
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    // Decodificar el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userIdFromToken = decoded.id; // 'id' es el campo en el JWT donde se almacena el ID del usuario

    // Buscar el post a actualizar y verificar si el autor coincide con el usuario del token
    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    if (post.author.toString() !== userIdFromToken) {
      return res.status(403).json({ error: 'Permiso denegado, solo el autor puede actualizar el post' });
    }

    // Si el autor coincide, proceder con la actualización
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId, author: userIdFromToken },
      req.body,
      { new: true }
    );

    res.json(updatedPost);
  } catch (error) {
    // Manejo de errores
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    res.status(500).json({ error: error.message });
  }
};
// Eliminar un post
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Si el usuario es un administrador, puede eliminar cualquier post
    if (req.user.role === 'admin') {
      const deletedPost = await Post.findByIdAndDelete(postId);
      if (!deletedPost) {
        return res.status(404).json({ error: 'Post no encontrado' });
      }
      return res.json({ message: 'Post eliminado exitosamente' });
    }

    // Si el usuario es un escritor, solo puede eliminar sus propios posts
    if (req.user.role === 'writer') {
      const deletedPost = await Post.findOneAndDelete({
        _id: postId,
        author: req.user._id, // Verifica que el autor del post sea el mismo que el usuario actual
      });

      if (!deletedPost) {
        return res.status(404).json({ error: 'Post no encontrado o permiso denegado' });
      }
      return res.json({ message: 'Post eliminado exitosamente' });
    }

    // Si el rol no es ni escritor ni administrador, devuelve un error de permiso
    return res.status(403).json({ error: 'Permiso denegado' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Aprobar publicación (para moderadores o administradores)
exports.approvePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { status: 'published' },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json({ message: 'Post aprobado y publicado', updatedPost });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
