const { Op } = require("sequelize");
const { APIError, STATUS_CODES } = require("../../utils/errors/app-errors");
const { Product } = require("../models");

class ProductRepository {
  constructor() {
    this.Product = new Product().schema;
  }

  // Find All Product by filter

  async GetAll(filters) {
    try {
      const { productName, productID = "" } = filters;

      const products = await this.Product.findAll({
        where: {
          [Op.or]: [
            { productID },
            { productName: { [Op.iLike]: `%${productName}%` } },
          ],
        },
      });
      return products;
    } catch (e) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Error while fetching prodcuts ${e}`,
      );
    }
  }

  // All products

  async ProductList(filters) {
    try {
      const prodList = await this.Product.findAll({ where: filters });
      return prodList;
    } catch (e) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Error while fetching prodcut list ${e}`,
      );
    }
  }

  // Find One Product By filters

  async GetOne(filters) {
    try {
      const product = await this.Product.findOne({ where: filters });
      return product.dataValues;
    } catch (e) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Error while fetching the product ${e}`,
      );
    }
  }

  // Create a product

  async Create(data) {
    try {
      const product = await this.Product.create(data);
      return product;
    } catch (e) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Error while creating the product ${e}`,
      );
    }
  }

  // Update products

  async Update(id, updateDetails, returnUpdatedDetails = true) {
    try {
      const [updatedCount, updatedProducts] = await this.Product.update(
        updateDetails,
        {
          where: { productID: String(id) },
          returning: returnUpdatedDetails,
        },
      );
      const product = updatedProducts[0].dataValues;
      return product;
    } catch (e) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Error while updating the product details ${e}`,
      );
    }
  }

  // bulk update

  async BulkUpdate(updatesArray) {
    try {
      const updatesPromises = updatesArray.map((obj) => {
        const tempObj = {
          ...obj,
        };
        delete tempObj.productID;
        return this.Update(obj.productID, tempObj);
      });

      const result = await Promise.all(updatesPromises);
      return result;
    } catch (e) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Error while updating the product details ${e}`,
      );
    }
  }

  // Delete product

  async Delete(filters) {
    try {
      const deletedProductCount = await this.Product.destroy({
        where: filters,
      });
      return deletedProductCount;
    } catch (e) {
      throw new APIError(
        "API ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        `Error while deleting the product ${e}`,
      );
    }
  }
}

module.exports = ProductRepository;
