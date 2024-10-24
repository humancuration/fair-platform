// Better for complex queries and aggregations
interface AIProject {
  _id: ObjectId
  name: string
  description: string
  category: string
  collaborators: number[]
  upvotes: number
  techStack: string[]
  metadata: Record<string, any> // Flexible schema
}

// Example aggregation pipeline
const pipeline = [
  {
    $match: { category: 'nlp' }
  },
  {
    $lookup: {
      from: 'users',
      localField: 'collaborators',
      foreignField: '_id',
      as: 'collaboratorDetails'
    }
  }
]
