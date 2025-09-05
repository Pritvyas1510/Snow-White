// controllers/Product.js
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

/** Map Multer/Cloudinary file => { url, publicId } */
function mapFile(file) {
  return {
    url: file.path,
    publicId: file.filename,
  };
}

/** CREATE */
exports.create = async (req, res) => {
  try {
    console.log("CREATE BODY:", req.body);
    console.log("CREATE FILES:", req.files);

    // build doc
    const data = {
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price) || 0,
      discountPercentage: Number(req.body.discountPercentage) || 0,
      stockQuantity: Number(req.body.stockQuantity) || 0,
      isDeleted: false,
    };

    // only set if not empty string (avoid ObjectId cast error)
    if (req.body.category && req.body.category !== "") {
      data.category = req.body.category;
    }
    if (req.body.brand && req.body.brand !== "") {
      data.brand = req.body.brand;
    }

    // Thumbnail
    if (req.files?.thumbnail?.[0]) {
      data.thumbnail = mapFile(req.files.thumbnail[0]);
    }

    // Gallery images
    if (req.files?.images?.length) {
      data.images = req.files.images.map(mapFile);
    }

    const created = await Product.create(data);

    // repull populated (Mongoose 6+)
    const populated = await Product.findById(created._id)
      .populate("brand")
      .populate("category")
      .exec();

    res.status(201).json(populated || created);
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return res.status(500).json({
      message: error.message || "Error adding product, please try again later",
    });
  }
};

/** GET ALL */
exports.getAll = async (req, res) => {
  try {
    const filter = {};
    const sort = {};
    let skip = 0;
    let limit = 0;

    const csvToArray = (val) =>
      Array.isArray(val) ? val : typeof val === "string" ? val.split(",") : [];

    if (req.query.brand) {
      filter.brand = { $in: csvToArray(req.query.brand) };
    }

    if (req.query.category) {
      filter.category = { $in: csvToArray(req.query.category) };
    }

    if (req.query.user) {
      filter.isDeleted = false;
    }

    if (req.query.sort) {
      sort[req.query.sort] =
        req.query.order && req.query.order === "asc" ? 1 : -1;
    }

    if (req.query.page && req.query.limit) {
      const pageSize = Number(req.query.limit);
      const page = Number(req.query.page);
      skip = pageSize * (page - 1);
      limit = pageSize;
    }

    const totalDocs = await Product.countDocuments(filter).exec();

    let query = Product.find(filter)
      .sort(sort)
      .populate("brand")
      .populate("category");

    if (limit > 0) query = query.skip(skip).limit(limit);

    const results = await query.exec();

    res.set("X-Total-Count", totalDocs);
    res.status(200).json(results);
  } catch (error) {
    console.error("GET ALL PRODUCTS ERROR:", error);
    res.status(500).json({
      message: "Error fetching products, please try again later",
    });
  }
};

/** GET BY ID */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findById(id)
      .populate("brand")
      .populate("category");
      console.log(result);
      
    res.status(200).json(result);
  } catch (error) {
    console.error("GET PRODUCT BY ID ERROR:", error);
    res.status(500).json({
      message: "Error getting product details, please try again later",
    });
  }
};

/** UPDATE */
exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const replaceImages = req.query.replaceImages === "true";

    console.log("UPDATE BODY:", req.body);
    console.log("UPDATE FILES:", req.files);

    const current = await Product.findById(id);
    if (!current) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Base update from body (fallback to current)
    const updateData = {
      title: req.body.title ?? current.title,
      description: req.body.description ?? current.description,
      price:
        req.body.price !== undefined
          ? Number(req.body.price)
          : current.price,
      discountPercentage:
        req.body.discountPercentage !== undefined
          ? Number(req.body.discountPercentage)
          : current.discountPercentage,
      stockQuantity:
        req.body.stockQuantity !== undefined
          ? Number(req.body.stockQuantity)
          : current.stockQuantity,
    };

    // category/brand optional
    if (req.body.category !== undefined && req.body.category !== "") {
      updateData.category = req.body.category;
    }
    if (req.body.brand !== undefined && req.body.brand !== "") {
      updateData.brand = req.body.brand;
    }

    // New thumbnail?
    if (req.files?.thumbnail?.[0]) {
      if (current.thumbnail?.publicId) {
        try {
          await cloudinary.uploader.destroy(current.thumbnail.publicId);
        } catch (err) {
          console.warn(
            "Cloudinary destroy thumbnail failed:",
            err?.message || err
          );
        }
      }
      updateData.thumbnail = mapFile(req.files.thumbnail[0]);
    }

    // New gallery images?
    if (req.files?.images?.length) {
      const newImgs = req.files.images.map(mapFile);
      if (replaceImages) {
        // delete all old gallery images
        const oldPublicIds = current.images
          .filter((img) => img.publicId)
          .map((img) => img.publicId);
        if (oldPublicIds.length) {
          try {
            await cloudinary.api.delete_resources(oldPublicIds);
          } catch (err) {
            console.warn(
              "Cloudinary batch destroy gallery failed:",
              err?.message || err
            );
          }
        }
        updateData.images = newImgs;
      } else {
        // append mode
        updateData.images = [...current.images, ...newImgs];
      }
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("brand")
      .populate("category");

    res.status(200).json(updated);
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({
      message: "Error updating product, please try again later",
    });
  }
};

/** UNDELETE */
exports.undeleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const unDeleted = await Product.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    )
      .populate("brand")
      .populate("category");
    res.status(200).json(unDeleted);
  } catch (error) {
    console.error("UNDELETE PRODUCT ERROR:", error);
    res.status(500).json({
      message: "Error restoring product, please try again later",
    });
  }
};

/** SOFT DELETE */
exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    )
      .populate("brand")
      .populate("category");
    res.status(200).json(deleted);
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    res.status(500).json({
      message: "Error deleting product, please try again later",
    });
  }
};
