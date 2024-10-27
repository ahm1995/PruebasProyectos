import Product from "../models/productModel.mjs"; // Asegúrate de que la extensión sea .mjs

// Crear un producto nuevo
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId, images, link, stock } = req.body;

    // Validaciones
    if (
      !name ||
      !description ||
      !price ||
      !categoryId ||
      !images ||
      !link ||
      !stock
    ) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios " });
    }

    // Crear el nuevo producto
    const newProduct = new Product({
      name,
      description,
      price,
      categoryId,
      images,
      link,
      stock,
      sales: 0,
      averageRating: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: true,
    });

    // Guardar el nuevo producto en la base de datos
    await newProduct.save();

    res.status(201).json({ message: "Producto creado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el producto", error });
  }
};

// Ver todos los productos
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos", error });
  }
};

export const getProductBtId = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    return res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto", error });
  }
};
