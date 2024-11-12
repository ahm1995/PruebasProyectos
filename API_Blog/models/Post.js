const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  multimedia: [String], // URLs de imágenes, videos o audios
  status: { 
    type: String, 
    enum: ['draft', 'review', 'published', 'archived'], 
    default: 'draft' 
  },
  scheduledDate: { type: Date }, // Para publicaciones programadas
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  slug: { type: String, unique: true },
}, { timestamps: true });

// Hook para generar el slug antes de guardar
postSchema.pre('save', function(next) {
    if (this.isModified('title')) {
      this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('Post', postSchema);
