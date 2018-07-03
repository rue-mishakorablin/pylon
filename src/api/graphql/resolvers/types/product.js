type Product {
  active: Boolean!
  attributes: [ProductAttribute]!
  brand: Brand!
  businessId: String!
  forceSoldOut: Boolean!
  images: [{
    black: [ProductImage]!
    default: [ProductImage]!
    gray: [ProductImage]!
  }]!
  info: ProductInfo
  isExperience: Boolean!
  longDescription: String!
  name: String!
  numAngles: Int!
  originalName: String!
  productContexts: [String]!
  returnPolicy: [ReturnPolicy]
  shortDescription: String!
  showMsrp: Boolean!
  showReturnPolicy: Boolean!
  skus: [Sku]!
  tags: [ProductTag]!
}