export function transformMongoDocument(doc) {
  if (!doc) return null;
  
  if (Array.isArray(doc)) {
    return doc.map(transformMongoDocument);
  }

  // Handle Mongoose documents
  if (doc._id && typeof doc._id === 'object') {
    const transformed = {
      id: doc._id.toString(),
      ...doc.toObject ? doc.toObject() : doc
    };
    delete transformed._id;
    delete transformed.__v;

    // Convert nested objects
    for (const key in transformed) {
      if (transformed[key] && typeof transformed[key] === 'object') {
        if (transformed[key]._id) {
          transformed[key] = transformMongoDocument(transformed[key]);
        } else if (transformed[key] instanceof Date) {
          transformed[key] = transformed[key].toISOString();
        }
      }
    }

    return transformed;
  }

  return doc;
}